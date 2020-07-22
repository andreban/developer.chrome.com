/**
 * @fileoverview Helper for hashing content.
 */

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const hashLength = 8;

function generateAndValidateHash(c) {
  const hash = c.digest('hex').substr(0, hashLength);
  if (hash.length !== hashLength) {
    throw new TypeError(`could not hash content`);
  }
  return hash;
}

/**
 * Hashes the passed content.
 *
 * @param {string} contents to hash
 * @return {string}
 */
function hashForContent(contents) {
  const c = crypto.createHash('sha1');
  c.update(contents);
  return generateAndValidateHash(c);
}

/**
 * Hashes the passed files. Requires at least one.
 *
 * @param {string} file base file to hash
 * @param {...string} rest additional files to hash
 */
function hashForFiles(file, ...rest) {
  const files = [file].concat(rest);

  const c = crypto.createHash('sha1');

  for (const file of files) {
    const b = fs.readFileSync(file);
    c.update(b);
  }

  return generateAndValidateHash(c);
}

/**
 * A quick hacky attempt to take a file path (assuming in dist dir) and return
 * a hashed version of the path.
 * @param {String} file 
 */
function hashAsset(file) {
  console.log(__dirname);
  console.log(path.join(__dirname, '..', '..', 'dist', file));
  try {
    const hash = hashForFiles(path.join(__dirname, '..', '..', 'dist', file));
    return `${file}?v=${hash}`;
  } catch(err) {
    console.error('Could not find asset at', file);
    return file;
  }
}

module.exports = {
  hashForContent,
  hashForFiles,
  hashAsset,
};