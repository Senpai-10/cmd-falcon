import { char } from "./types";

export interface Option {
    name: {
        /** @example '--test' */
        long: `--${string}`;
        /** @example '-t' */
        short?: `-${char}` | undefined;
    };
    /** If true the option value is boolean */
    is_flag: boolean;
    /** Add a short description for your option */
    description: string;
}

export interface Cli_config {
    /** Print parser info */
    verbose_parsing: boolean;
}
