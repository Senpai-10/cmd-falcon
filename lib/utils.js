"use strict";
// Utility Functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.crash_if_required = exports.find_option = void 0;
const chalk_1 = require("chalk");
/**
 * find option using it's long or short name in options map
 */
function find_option(name, type, options) {
    if (type == 'long') {
        return options.get(name);
    }
    for (const [_, value] of options.entries()) {
        if (value.name.short == `-${name}`) {
            return value;
        }
    }
}
exports.find_option = find_option;
function crash_if_required(argument_name, required) {
    if (!required)
        return;
    console.log(`${argument_name} is ${(0, chalk_1.red)('required')}`);
    process.exit(1);
}
exports.crash_if_required = crash_if_required;
