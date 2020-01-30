/* eslint-env jest */
const postcss = require('postcss');
const plugin = require('./');

function run(input, output, opts) {
  return postcss([plugin(opts)]).process(input).then((result) => {
    expect(result.css).toEqual(output);
    expect(result.warnings()).toHaveLength(0);
  });
}

it('adds tilda for modules paths', () => run(
  '@value module from "module/module.css";',
  '@value module from "~module/module.css";',
));

it('doesn\'t change relative paths', () => run(
  '@value module from "./module/module.css";',
  '@value module from "./module/module.css";',
));

it('doesn\'t change absolute paths', () => run(
  '@value module from "/module/module.css";',
  '@value module from "/module/module.css";',
));

it('adds tilda for modules paths inside composes', () => run(
  'a { composes: selector from "module/module.css"; }',
  'a { composes: selector from "~module/module.css"; }',
));

it('supports multiline imports', () => run(
  `@value (
  module,
  module2
) from "module/module.css";`,
  `@value (
  module,
  module2
) from "~module/module.css";`,
));

it('supports imports from scoped packages', () => run(
  '@value module from "@scope/module/module.css"',
  '@value module from "~@scope/module/module.css"',
));

it('adds tilda for namespaced global imports', () => run(
  '@import "@scope/module/module.css"',
  '@import "~@scope/module/module.css"',
));

it('adds tilda for modules global imports', () => run(
  '@import "module/module.css"',
  '@import "~module/module.css"',
));

it('doesn\'t change relative global imports', () => run(
  '@import "./module/module.css"',
  '@import "./module/module.css"',
));

it('doesn\'t change absolute global imports', () => run(
  '@import "/module/module.css"',
  '@import "/module/module.css"',
));
