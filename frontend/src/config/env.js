const env = Object.freeze({
  appName: import.meta.env.VITE_APP_NAME || "AgriMart",

  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_GATEWAY_URL ||
    "http://localhost:8000/api/v1",

  requestTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,

  environment:
    import.meta.env.VITE_ENVIRONMENT || "development",

  // Set this to true only after GET /home is available from the API gateway.
  enableHomeApi: import.meta.env.VITE_ENABLE_HOME_API === "true",
});

export default env;
