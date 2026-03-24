import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var __MONGOD__: MongoMemoryServer;
}

export default async function globalSetup() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  global.__MONGOD__ = mongod;
  // Write URI to a temp file so worker processes can read it
  fs.writeFileSync(path.join(__dirname, '.mongo-uri'), uri, 'utf-8');
}
