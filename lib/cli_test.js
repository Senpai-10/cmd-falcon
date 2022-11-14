"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const cli = new index_1.Cli('cli-test', 'just a test', '0.1.0', {
    verbose_parsing: true,
}, ['--test']);
cli.add_option({
    name: { long: '--test', short: '-t' },
    is_flag: true,
    description: 'test option',
})
    .add_option({
    name: { long: '--verbose' },
    is_flag: true,
    description: 'test option',
})
    .add_option({
    name: { long: '--name', short: '-n' },
    is_flag: false,
    default: 'senpai-10',
    description: 'get username',
});
cli.parse();
let opts = cli.opts;
console.log(opts);
