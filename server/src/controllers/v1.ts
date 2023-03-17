// src/controllers/v1.ts

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
      title: "Version 1 - API Capabilities",
    },
  };

  res.bundle = {
    capabilities: [],
  };

  ctx.response.status = res.status;
  ctx.response.body = { ...res.header, ...res.bundle };
}
