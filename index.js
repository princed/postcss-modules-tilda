const postcss = require('postcss');

const modulePathPattern = '([\'"])(@?\\w+.*?)';
const prefixPattern = '((?:.+?|\\([\\s\\S]+?\\))\\s+from\\s+)';
const matchImports = new RegExp(`^${prefixPattern}${modulePathPattern}\\2$`);
const matchOnlyImportPath = new RegExp(`^${modulePathPattern}\\1$`);

module.exports = postcss.plugin('postcss-modules-tilda', () => (root) => {
  root.walk((node) => {
    if (node.type === 'atrule') {
      const newImports = node.name === 'import'
        ? updateImportAtRulePath(node.params)
        : updateImports(node.params);
      if (newImports) {
        node.params = newImports;
      }
      return;
    }

    if (node.type === 'decl' && node.prop === 'composes') {
      const newImports = updateImports(node.value);
      if (newImports) {
        node.value = newImports;
      }
    }
  });
});

function updateImports(imports) {
  const matches = matchImports.exec(imports);
  if (!matches) {
    return undefined;
  }

  const [, prefix, quote, path] = matches;
  return `${prefix}${quote}~${path}${quote}`;
}

function updateImportAtRulePath(stringLiteral) {
  const matches = matchOnlyImportPath.exec(stringLiteral);

  if (!matches) {
    return undefined;
  }

  const [, quote, path] = matches;
  return `${quote}~${path}${quote}`;
}
