const postcss = require('postcss')
const modulePathPattern = '([\'"])(@?\\w+.*?)'
const prefixPattern = '((?:.+?|\\([\\s\\S]+?\\))\\s+from\\s+)'
const matchImports = RegExp(`^${ prefixPattern }${ modulePathPattern }\\2$`)
const matchOnlyImportPath = RegExp(`^${ modulePathPattern }\\1$`)

module.exports = postcss.plugin('postcss-modules-tilda', () => root => {
  root.walk(node => {
    if (node.type === 'atrule') {
      let newImports
      if (node.name === 'import') {
        newImports = updateImportAtRulePath(node.params)
      } else {
        newImports = updateImports(node.params)
      }
      if (newImports) {
        node.params = newImports
      }
      return
    }

    if (node.type === 'decl' && node.prop === 'composes') {
      let newImports = updateImports(node.value)
      if (newImports) {
        node.value = newImports
      }
    }
  })
})

function updateImports (imports) {
  let matches = matchImports.exec(imports)
  if (!matches) {
    return undefined
  }

  let [, prefix, quote, path] = matches
  return `${ prefix }${ quote }~${ path }${ quote }`
}

function updateImportAtRulePath (stringLiteral) {
  let matches = matchOnlyImportPath.exec(stringLiteral)

  if (!matches) {
    return undefined
  }

  let [, quote, path] = matches
  return `${ quote }~${ path }${ quote }`
}
