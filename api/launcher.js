// Launcher for local/manual start: start the Express app on PORT
const app = require('../api-node/src/index.js');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`api listening on ${PORT}`));

module.exports = app;
