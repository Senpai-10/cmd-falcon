import { Option } from './interfaces';
import { Option_name } from './types';
/**
 * find option using it's long or short name in options map
 */
export declare function find_option(name: string, type: Option_name, options: Map<string, Option>): Option | undefined;
export declare function crash_if_required(argument_name: string, required: boolean | undefined): void;
