// Utility Functions

import { Option } from './interfaces';
import { red } from 'chalk';
import { Option_name } from './types';

/**
 * find option using it's long or short name in options map
 */
export function find_option(name: string, type: Option_name, options: Map<string, Option>): Option | undefined {
    if (type == 'long') {
        return options.get(name);
    }

    for (const [_, value] of options.entries()) {
        if (value.name.short == `-${name}`) {
            return value;
        }
    }
}

export function crash_if_required(argument_name: string, required: boolean | undefined) {
    if (!required) return;

    console.log(`${argument_name} is ${red('required')}`);
    process.exit(1);
}
