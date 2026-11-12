const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  const configuredApiUrl = process.env.REACT_APP_API_URL;
  if (!configuredApiUrl) return;

  const apiUrl = new URL(configuredApiUrl);
  if (!['http:', 'https:'].includes(apiUrl.protocol) || apiUrl.pathname !== '/' || apiUrl.search || apiUrl.hash) {
    throw new Error('REACT_APP_API_URL must be an HTTP(S) origin without a path or query');
  }

  app.use('/api', createProxyMiddleware({
    target: apiUrl.origin,
    changeOrigin: true,
  }));
};
