// src/utilities/session.ts

export { sessionCache };

const sessionCache = {
  totalLifetimeRequests: {
    root: 0,
    stats: 0,
    features: 0,
  },
  totalLifetimeFailedAuthenticationEvents: 0,
};
