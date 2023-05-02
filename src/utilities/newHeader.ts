// utilities/newHeader.ts

export { newHeader };

function newHeader(title: string) {
  return {
    ts: Math.floor(Date.now() / 1000),
    host: "Whereabouts API",
    name: title,
  };
}
