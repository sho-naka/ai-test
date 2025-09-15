module.exports = (err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ status:500, message: 'Internal Server Error' });
};
