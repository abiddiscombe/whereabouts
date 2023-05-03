// utilities/header.ts

export { newHeader };

function newHeader(title: string) {
  return {
    time: Math.floor(Date.now() / 1000),
    host: "Whereabouts API",
    name: title,
  };
}
