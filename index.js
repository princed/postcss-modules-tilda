const postcss = require('postcss')
const matchImports = /^((?:.+?|\([\s\S]+?\))\s+from\s+)(['"])(\w+.*?)\2$/

module.exports = postcss.plugin('postcss-modules-tilda', () => root => {
  root.walk(node => {
    if (node.type === 'atrule') {
      let newImports = updateImports(node.params)
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
