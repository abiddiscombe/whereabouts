export function readCorsDomain() {
  const domain = Deno.env.get('CORS_ORIGIN') || '';
  if (domain === '*') {
    console.info('CORS has been enabled for all (\'*\') domains.');
  }
  return domain;
}
