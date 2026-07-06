const app = require('./app');
const env = require('./config/env');
const connectDatabase = require('./config/db');

let server;

const startServer = async () => {
  await connectDatabase();
  server = app.listen(env.port, () => {
    console.log(`Employee Task Manager API running on port ${env.port} in ${env.nodeEnv} mode`);
  });

  server.on('error', (error) => {
    console.error('Server failed:', error);
    process.exit(1);
  });
};

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully.`);
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  shutdown('unhandledRejection');
});

startServer().catch((error) => {
  console.error('Unable to start server:', error);
  process.exit(1);
});
