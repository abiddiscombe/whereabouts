import { type Context, Hono } from 'hono';
import { messages } from '../utilities/messages.ts';
import { getClassList } from '../services/getClassList.ts';

export const classesController = new Hono();

classesController.get('/', async (c: Context) => {
  try {
    const classList = await getClassList();
    return c.json({
      host: `${messages.info.name} (v${messages.info.version})`,
      endpoint: '/classes',
      classes: classList,
    });
  } catch {
    c.status(messages.errors['InternalServiceError-ClassList'].status);
    return c.json({
      ...c.get('header'),
      error: messages.errors['InternalServiceError-ClassList'].summary,
    });
  }
});
