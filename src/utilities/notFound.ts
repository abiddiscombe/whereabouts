import { type Context } from 'hono';
import { messages } from '../utilities/messages.ts';

export function notFound(c: Context) {
  c.status(messages.errors.notFound.status);
  return c.json({
    host: `${messages.info.name} (v${messages.info.version})`,
    error: messages.errors.notFound.summary,
  });
}
