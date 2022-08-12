const refresherToken = (req, res, next) => {
  if (req.url in ['/signin', '/logout']) next();

  req.header
}

module.exports = requestLogger;