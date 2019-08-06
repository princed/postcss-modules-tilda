const postcss = require('postcss')
const plugin = require('./')

function run (input, output, opts) {
  return postcss([plugin(opts)]).process(input).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings()).toHaveLength(0)
  })
}

it('adds tilda for modules paths', () => {
  return run(
    '@value module from "module/module.css";',
    '@value module from "~module/module.css";'
  )
})

it('doesn\'t change relative paths', () => {
  return run(
    '@value module from "./module/module.css";',
    '@value module from "./module/module.css";'
  )
})

it('doesn\'t change absolute paths', () => {
  return run(
    '@value module from "/module/module.css";',
    '@value module from "/module/module.css";'
  )
})

it('adds tilda for modules paths inside composes', () => {
  return run(
    'a { composes: selector from "module/module.css"; }',
    'a { composes: selector from "~module/module.css"; }'
  )
})

it('supports multiline imports', () => {
  return run(
    `@value (
  module,
  module2
) from "module/module.css";`,
    `@value (
  module,
  module2
) from "~module/module.css";`
  )
})

it('supports imports from scoped packages', () => {
  return run(
    `@value module from "@scope/module/module.css"`,
    `@value module from "~@scope/module/module.css"`
  )
})
