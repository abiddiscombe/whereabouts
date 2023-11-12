interface messagesType {
  info: {
    name: string;
    version: string;
  };
  endpoints: {
    [id: string]: {
      name: string;
      about: string;
    };
  };
  errors: {
    [code: string]: {
      status: number;
      summary: string;
    };
  };
}

export const messages: messagesType = {
  info: {
    name: 'Whereabouts API Service',
    version: '3.0.0',
  },

  endpoints: {
    'root': {
      name: 'Root (Self)', // add self for root controller
      about: 'Returns a list of available service endpoints.',
    },
    'classes': {
      name: 'Class List',
      about: 'Returns a list of dataset classes on which features can be filtered.',
    },
    'features': {
      name: 'Feature Search',
      about: 'Returns GeoJSON features. Supports either name, bounds, or radial queries.',
    },
    'metadata': {
      name: 'Service Metadata',
      about: 'Returns metadata about the Whereabouts API service and the source dataset.',
    },
  },

  errors: {
    'default': {
      status: 500,
      summary: 'An unknown error has occured. Please try again later.',
    },
    'notFound': {
      status: 404,
      summary: 'The requested endpoint does not exist.',
    },
    'InternalServiceError-Name': {
      status: 500,
      summary: 'Internal Server Error. Something went wrong handling the \'name\' request.',
    },
    'InternalServiceError-Bounds': {
      status: 500,
      summary: 'Internal Server Error. Something went wrong handling the \'bounds\' request.',
    },
    'InternalServiceError-Radius': {
      status: 500,
      summary: 'Internal Server Error. Something went wrong handling the \'radius\' request.',
    },
    'InternalServiceError-ClassList': {
      status: 500,
      summary: 'Internal Server Error. Something went wrong retrieving a list of classes from the database.',
    },
    'Validation-Gen-NoSearchParameter': {
      status: 400,
      summary: 'Please define a search method (\'name\', \'bounds\', or \'radius\') via query parameter.',
    },
    'Validation-Gen-MultipleSearchParameters': {
      status: 400,
      summary: 'Only a single search method (\'name\', \'bounds\', or \'radius\') is permitted per query.',
    },
    'Validation-Name-WrongFormat': {
      status: 400,
      summary: 'The format of \'name\' is incorrect.',
    },
    'Validation-Name-IncorrectLengthShort': {
      status: 406,
      summary: 'The length of parameter \'name\' is too short.',
    },
    'Validation-Name-IncorrectLengthLong': {
      status: 406,
      summary: 'The length of parameter \'name\' is too long.',
    },
    'Validation-Bounds-WrongFormat': {
      status: 400,
      summary: 'The format of \'bounds\' is incorrect.',
    },
    'Validation-Bounds-TooLarge': {
      status: 406,
      summary: 'The area of parameter \'bounds\' is too large. Please specify an area less than 2 km2.',
    },
    'Validation-Radius-WrongFormat': {
      status: 400,
      summary: 'The format of \'radius\' is incorrect.',
    },
    'Validation-Radius-SearchDistance': {
      status: 406,
      summary: 'The search distance for \'radius\' must be greater than 1 and less than 2000 meters.',
    },
    'Validation-ClassFilter-WrongFormat': {
      status: 400,
      summary: 'The format of \'class\' is incorrect.',
    },
    'Validation-ClassFilter-InvalidClass': {
      status: 406,
      summary: 'The \'class\' string provided does not match any classes in the database.',
    },
    'Validation-OffsetFilter-WrongFormat': {
      status: 400,
      summary: 'The format of \'offset\' is incorrect. Please supply an integer that is a multiple of 1000.',
    },
    'Validation-OffsetFilter-NotMultiple1000': {
      status: 406,
      summary: 'The integer provided in \'offset\' is not a multiple of 1000.',
    },
  },
};
