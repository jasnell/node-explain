#!/usr/bin/env node
'use strict';

const { URL } = require('url');
const { bold, underline } = require('chalk');
const minimist = require('minimist');
const opn = require('opn');
const errors = require('./errors.json');
const deprecations = require('./deprecations.json');
errors._pattern = new RegExp(errors._pattern);
errors._base_url = new URL(errors._base_url);
deprecations._pattern = new RegExp(deprecations._pattern);
deprecations._base_url = new URL(deprecations._base_url);

const argsConfig = {
  boolean: [
    'help',
    'open'
  ],
  string: [
    'locale'
  ],
  alias: {
    'h': 'help',
    'o': 'open',
    'l': 'locale'
  },
  default: {
    'locale': 'en'
  }
};

function usage() {
  let msg = 'node-explain [options] CODE\n';
  msg += ' [options]\n';
  msg += '  -h --help   : show help\n';
  msg += '  -o --open   : open Node.js documentation for specified CODE\n';
  msg += '\n Example:\n';
  msg += '  node-explain -o ERR_ASSERTION\n';
  console.log(msg);
  process.exit(0);
}

function codeUnknown(code) {
  console.log(`The code "${bold.red(code)}" is not known.\n`);
  process.exit(1);
}

function showDetail(code, detail, locale) {
  console.log(`${bold.green(code)}:\n  ${detail[locale]}\n`);
}

function open(code, base) {
  const url = new URL(`#${code}`, base).toString();
  console.log(
    `Opening documentation for code ${bold.green(code)}: ${underline(url)}`);
  opn(url, { wait: false });
}

const args = minimist(process.argv.slice(2), argsConfig);

if (args._.length !== 1 || args.help)
  usage();

let detail, base;
const code = args._[0];
if (errors._pattern.test(code)) {
  detail = errors[code];
  base = errors._base_url;
} else if (deprecations._pattern.test(code)) {
  detail = deprecations[code];
  base = deprecations._base_url;
}

if (detail !== undefined) {
  if (args.open) {
    open(code, base);
  } else {
    showDetail(code, detail, args.locale);
  }
} else {
  codeUnknown(code);
}