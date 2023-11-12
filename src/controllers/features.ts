import { z } from 'zod';
import { type Context, Hono } from 'hono';
import { bbox } from '../utilities/bbox.ts';
import { messages } from '../utilities/messages.ts';
import { getClassList } from '../services/getClassList.ts';
import { getFeatureByName } from '../services/getFeatureByName.ts';
import { getFeatureByBounds } from '../services/getFeatureByBounds.ts';
import { getFeatureByRadius } from '../services/getFeatureByRadius.ts';

export const featuresController = new Hono();

featuresController.get('/', async (c: Context) => {
  const rawName = c.req.query('name') || '';
  const rawBounds = c.req.query('bounds') || '';
  const rawRadius = c.req.query('radius') || '';
  const rawClassFilter = c.req.query('class') || '';
  const rawOffsetFilter = c.req.query('offset') || '';

  try {
    const parsedClassFilter = await _validateClassFilter({ classFilter: rawClassFilter });
    const parsedOffsetFilter = _validateOffsetFilter({ offsetFilter: rawOffsetFilter });

    if ((rawName && rawBounds) || (rawBounds && rawRadius) || (rawRadius && rawName)) {
      throw new Error('Validation-Gen-MultipleSearchParameters');
    }

    if (rawName) {
      const parsedName = _validateName({ name: rawName });
      const dbResponse = await getFeatureByName(parsedName, parsedClassFilter);
      if (!dbResponse.success) {
        throw new Error('InternalServerError-Name');
      } else {
        return c.json({
          ..._generateBodyHeader({
            searchMethod: 'Textual',
            resultCount: dbResponse.features.length,
            queryParams: {
              name: parsedName,
              ...parsedClassFilter && {
                classFilter: parsedClassFilter,
              },
            },
          }),
          type: 'FeatureCollection',
          ...(parsedOffsetFilter !== 0) && {
            info: 'The provided \'offset\' filter has no effect on a textual query.',
          },
          ...(dbResponse.features.length > 600) && {
            warn: 'A large number of results have been returned. Please refine your search.',
          },
          features: dbResponse.features,
        });
      }
    }

    if (rawBounds) {
      const parsedBounds = _validateBounds({ bounds: rawBounds });
      // @ts-ignore: parsedRadius is safe, Zod does not lock the number of array items.
      const dbResponse = await getFeatureByBounds(parsedBounds, parsedClassFilter, parsedOffsetFilter);
      if (!dbResponse.success) {
        throw new Error('InternalServerError-Bounds');
      } else {
        return c.json({
          ..._generateBodyHeader({
            searchMethod: 'Geospatial',
            resultCount: dbResponse.features.length,
            queryParams: {
              offset: parsedOffsetFilter,
              bounds: parsedBounds,
              ...parsedClassFilter && {
                classFilter: parsedClassFilter,
              },
            },
          }),
          type: 'FeatureCollection',
          ...(dbResponse.features.length === 1000) && {
            warn: 'Feature limit reached. Additional features may be available.',
          },
          features: dbResponse.features,
        });
      }
    }

    if (rawRadius) {
      const parsedRadius = _validateRadius({ radius: rawRadius });
      // @ts-ignore: parsedRadius is safe, Zod does not lock the number of array items.
      const dbResponse = await getFeatureByRadius(parsedRadius, parsedClassFilter, parsedOffsetFilter);
      if (!dbResponse.success) {
        throw new Error('InternalServerError-Radius');
      } else {
        return c.json({
          ..._generateBodyHeader({
            searchMethod: 'Geospatial',
            resultCount: dbResponse.features.length,
            queryParams: {
              offset: parsedOffsetFilter,
              radius: {
                center: [
                  parsedRadius[0],
                  parsedRadius[1],
                ],
                distance: parsedRadius[2],
              },
              ...parsedClassFilter && {
                classFilter: parsedClassFilter,
              },
            },
          }),
          type: 'FeatureCollection',
          ...(dbResponse.features.length === 1000) && {
            warn: 'Feature limit reached. Additional features may be available.',
          },
          features: dbResponse.features,
        });
      }
    }

    throw new Error('Validation-Gen-NoSearchParameter');
  } catch (e) {
    console.error(`  !!! Service Error: ${e.message}`);
    const error = e.message || '';
    const errorInfo = messages.errors[error] ? messages.errors[error] : messages.errors.default;

    c.status(errorInfo.status);
    return c.json({
      ..._generateBodyHeader({}),
      error: errorInfo.summary,
    });
  }
});

interface GenerateBodyHeaderArgs {
  searchMethod?: string;
  resultCount?: number;
  queryParams?: {
    offset?: number;
    name?: string;
    bounds?: number[];
    radius?: {
      center: number[];
      distance: number;
    };
    classFilter?: string;
  };
}

function _generateBodyHeader(args: GenerateBodyHeaderArgs) {
  return {
    host: `${messages.info.name} (v${messages.info.version})`,
    endpoint: '/features',
    metadata: {
      tsUnix: (Math.floor(Date.now() / 1000)).toString(),
      ...(args.searchMethod) && {
        searchMethod: args.searchMethod,
      },
      resultCount: (args.resultCount) ? args.resultCount : 0,
      queryParams: {
        ...(args.queryParams && args.queryParams.offset) && {
          offset: args.queryParams.offset,
        },
        ...(args.queryParams && args.queryParams.name) && {
          name: args.queryParams.name,
        },
        ...(args.queryParams && args.queryParams.bounds) && {
          bounds: args.queryParams.bounds,
        },
        ...(args.queryParams && args.queryParams.radius) && {
          radius: args.queryParams.radius,
        },
        ...(args.queryParams && args.queryParams.classFilter) && {
          filter: {
            class: args.queryParams.classFilter,
          },
        },
      },
    },
  };
}

interface NameValidationArgs {
  name: string;
}

function _validateName(args: NameValidationArgs) {
  const schema = z.string();
  const parsed = schema.safeParse(args.name);
  if (!parsed.success) {
    throw new Error('Validation-Name-WrongFormat');
  }
  if (parsed.data.length < 4) {
    throw new Error('Validation-Name-IncorrectLengthShort');
  } else if (parsed.data.length > 20) {
    throw new Error('Validation-Name-IncorrectLengthLong');
  }
  return parsed.data;
}

interface BoundsValidationArgs {
  bounds: string;
}

function _validateBounds(args: BoundsValidationArgs) {
  const schema = z.string()
    .transform((value) => value.split(',').map(Number))
    .pipe(z.number().array().length(4));
  const parsed = schema.safeParse(args.bounds);
  if (!parsed.success) {
    throw new Error('Validation-Bounds-WrongFormat');
  }
  if (!bbox.isValidSize(parsed.data)) {
    throw new Error('Validation-Bounds-TooLarge');
  }
  return parsed.data;
}

interface RadiusValidationArgs {
  radius: string;
}

function _validateRadius(args: RadiusValidationArgs) {
  const schema = z.string()
    .transform((value) => value.split(',').map(Number))
    .pipe(z.number().array().length(3));
  const parsed = schema.safeParse(args.radius);
  if (!parsed.success) {
    throw new Error('Validation-Radius-WrongFormat');
  }
  const distance = parsed.data[2];
  if (distance < 1 || distance > 2000) {
    throw new Error('Validation-Radius-SearchDistance');
  }
  return [
    parsed.data[0],
    parsed.data[1],
    parsed.data[2],
  ];
}

interface ClassFilterValidationArgs {
  classFilter: string;
}

async function _validateClassFilter(args: ClassFilterValidationArgs) {
  const schema = z.string();
  const parsed = schema.safeParse(args.classFilter);
  if (!parsed.success) {
    throw new Error('Validation-ClassFilter-WrongFormat');
  }
  const classList = await getClassList();
  if (parsed.data != '') {
    if (!classList.includes(parsed.data)) {
      throw new Error('Validation-ClassFilter-InvalidClass');
    }
  }
  return parsed.data;
}

interface OffsetFilterValidationArgs {
  offsetFilter: string;
}

function _validateOffsetFilter(args: OffsetFilterValidationArgs) {
  if (args.offsetFilter !== '') {
    const schema = z.string().refine((value) => !isNaN(Number(value)));
    const parsed = schema.safeParse(args.offsetFilter);
    if (!parsed.success) {
      throw new Error('Validation-OffsetFilter-WrongFormat');
    }
    if (parseInt(parsed.data) % 1000 !== 0) {
      throw new Error('Validation-OffsetFilter-NotMultiple1000');
    }
    return parseInt(parsed.data);
  }
  return 0;
}
