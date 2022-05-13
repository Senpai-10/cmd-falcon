// Utility Functions

import { Option } from "./interfaces";
import { Option_name } from "./types";

/**
 * find option using it's long or short name in options map
 */
export function find_option(name: string, type: Option_name, options: Map<string, Option>): Option | undefined {
    if (type == "long") {
        return options.get(name);
    }

    for (const [_, value] of options.entries()) {
        if (value.name.short == `-${name}`) {
            return value;
        }
    }
}
