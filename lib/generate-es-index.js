const fs = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');
const camelCase = require('camelcase');
const glob = Promise.promisify(require('glob'));
const upath = require('upath');

const generateEsIndex = async function(
  { root, pattern, dist },
  eventHandlers = {}
) {
  /**
   * ファイルパスをパース
   *
   * @param {string} filePath
   * @return {object}
   */
  function parseFilePath(filePath) {
    const relativeFilePath = upath.normalize(
      path.relative(path.dirname(dist), filePath)
    );

    const basename = path.basename(filePath, path.extname(filePath));
    const isFirstLetterUpper = /^[A-Z]/.test(basename);
    const name = camelCase(basename, {
      pascalCase: isFirstLetterUpper,
    });

    return {
      name,
      path: /^\./.test(relativeFilePath)
        ? relativeFilePath
        : `./${relativeFilePath}`,
    };
  }

  /**
   * ファイルオブジェクトを変形
   *
   * @param {object} file
   */
  function transform(file) {
    return `export { default as ${file.name} } from '${file.path}';`;
  }

  /**
   * 開始トリガー
   */
  async function init() {
    if ('before' in eventHandlers) {
      eventHandlers.before();
    }

    const targets = await glob(pattern, {
      cwd: root,
      absolute: true,
    }).then(files => files.map(parseFilePath));

    const content = targets.map(transform).join('\n');

    await fs.outputFile(dist, `${content}\n`);

    if ('after' in eventHandlers) {
      eventHandlers.after({ dist, targets });
    }
  }

  await init();
};

module.exports = generateEsIndex;
