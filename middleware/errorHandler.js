exports.routerNotFound = (req, res) => {
  res.status(404).json({ message: "route is not found" });
};

exports.errorHandler = (err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
};
