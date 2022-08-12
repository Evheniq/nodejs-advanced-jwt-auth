const requestLogger = (req, res, next) => {
  const now = new Date(Date.now());
  console.log('New request! Time:', now.toTimeString());
  console.log('Details:', req.body, req.method, req.url);
  next();
}

module.exports = requestLogger;