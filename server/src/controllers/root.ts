// src/controllers/root.ts

export default {
  index: _index,
};

function _index(ctx) {
  const res = {
    status: 200,
    bundle: {},
    header: {
      id: "WHEREABOUTS Server",
      time: Math.floor(Date.now() / 1000),
      title: "API Version List",
    },
  };

  res.bundle = {
    versions: [
      {
        href: "/v1/",
        name: "Version 1 - API Capabilities",
        desc: "",
      },
    ],
  };

  ctx.response.status = res.status;
  ctx.response.body = { ...res.header, ...res.bundle };
}
