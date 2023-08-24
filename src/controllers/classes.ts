// classes.ts
import { type Context, Hono, HTTPException } from 'hono';
import { errors, info } from '../utilities/constants.ts';
import { getClassList } from '../services/getClassList.ts';

export const classesController = new Hono();

classesController.get('/', async (c: Context) => {
    c.set('header', {
        time: Math.floor(Date.now() / 1000),
        host: `${info.WHEREABOUTS_NAME} > Class List`,
    });
    try {
        const classList = await getClassList();
        return c.json({
            ...c.get('header'),
            classes: classList,
        });
    } catch {
        throw new HTTPException(500, {
            message: JSON.stringify({
                ...c.get('header'),
                error: errors.HTTP_500,
            }),
        });
    }
});
