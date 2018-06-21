#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');
const finder = require('find-package-json');
const generateEsIndex = require('../lib/generate-es-index');

const ansi = {
  black: '\u001b[30m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  cyan: '\u001b[36m',
  white: '\u001b[37m',
  reset: '\u001b[0m',
};

const argv = yargs
  .alias('i', 'input')
  .alias('o', 'output')
  .alias('c', 'cwd')
  .alias('v', 'verbose').argv;

argv.cwd = argv.cwd || process.cwd();

const root =
  (path.isAbsolute(argv.cwd)
    ? argv.cwd
    : path.resolve(process.cwd(), argv.cwd)) ||
  path.dirname(finder().next().filename);
const dist = path.isAbsolute(argv.output)
  ? argv.output
  : path.resolve(root, argv.output);
const eventHandlers = argv.verbose
  ? {
      before() {
        console.log('Generating a index file...');
        console.log();
      },
      after({ dist }) {
        console.log(
          `${ansi.green}[Generated] ${ansi.blue}${dist}${ansi.reset}`
        );
        console.log();
      },
    }
  : {};

generateEsIndex(
  {
    root,
    pattern: argv.input,
    dist,
  },
  eventHandlers
).catch(err => {
  console.error(err.message);
});
