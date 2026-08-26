// Dev-only MongoDB instance (real mongod binary provided by mongodb-memory-server).
// Persists data to ./devdata so it survives restarts during development.
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

const dbPath = path.join(__dirname, '..', 'devdata');

(async () => {
  const mem = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbPath,
      storageEngine: 'wiredTiger',
    },
    binary: { version: '7.0.14' },
  });
  console.log('DEV MongoDB ready at', mem.getUri());
  // keep process alive
  process.stdin.resume();
})().catch((e) => {
  console.error('Failed to start dev MongoDB:', e);
  process.exit(1);
});
