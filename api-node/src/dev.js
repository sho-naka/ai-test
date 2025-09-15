const app = require('./index');

const startPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

function tryListen(port, attempts = 5) {
  const server = app.listen(port, () => {
    console.log(`api-node dev server listening on ${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attempts > 0) {
      console.warn(`port ${port} in use, trying ${port + 1} ...`);
      setTimeout(() => tryListen(port + 1, attempts - 1), 200);
      return;
    }
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

tryListen(startPort, 5);
