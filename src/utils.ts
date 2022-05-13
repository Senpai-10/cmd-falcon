// Utility Functions

import { Option } from "./interfaces";
import { Option_name } from "./types";

// TODO (get_option_with_short_name): make the function more generic maybe accept a name_type enum (name_type.Short, name_type.Long)
/** use short name to get option object
 * in case that option does not exist
 * return undefined
 * @deprecated
 */
export function get_option_with_short_name(short_name: string, options: Map<string, Option>): Option | undefined {
    for (const [_, value] of options.entries()) {
        if (value.name.short == `-${short_name}`) {
            return value;
        }
    }
}

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
