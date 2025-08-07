#!/usr/bin/env node

const semver = require('semver');
const { engines } = require('../package.json');
const version = engines.node;

if (!semver.satisfies(process.version, version)) {
  console.error(`Required node version ${version}, got ${process.version}.`);
  console.error('Please use the correct Node.js version. You can use nvm to switch versions:');
  console.error('  nvm use');
  console.error('  or');
  console.error('  nvm install 16.1.0 && nvm use 16.1.0');
  process.exit(1);
}

console.log(`✅ Node.js version ${process.version} is compatible with required version ${version}`); 