import fs from 'fs';
import path from 'path';

// Set all required env vars for every test worker process.
// MONGO_URI is written by globalSetup so each worker process picks it up here.
const uriFile = path.join(__dirname, '.mongo-uri');
if (fs.existsSync(uriFile)) {
  process.env.MONGO_URI = fs.readFileSync(uriFile, 'utf-8').trim();
}

process.env.JWT_SECRET = 'test_jwt_secret_super_long_value_for_tests_only';
process.env.JWT_EXPIRE = '1d';
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.CLIENT_URL = 'http://localhost:3000';
