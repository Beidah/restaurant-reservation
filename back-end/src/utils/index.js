
function hasProperties(properties) {
  return (req, res, next) => {
    const { data } = req.body;
  
    if (!data) {
      next({
        status: 400,
        message: "Missing data"
      });
    }
  
    for (let propertery of properties) {
      if (!data[propertery]) {
        next({
          status: 400,
          message: `Missing property: ${propertery}`,
        });
      }
    }
  
    res.locals.data = data;
    return next();
  }
}

module.exports = {
  hasProperties
}