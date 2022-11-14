import { Cli_config, Option } from './interfaces';
import { Version } from './types';
export declare class Cli {
    opts: any;
    private args;
    private options;
    private readonly executable_name;
    private readonly description;
    private readonly version;
    private config;
    constructor(cli_name: string, description: string, version: Version, config?: Cli_config, args?: string[]);
    /** Option is an argument that starts with  '--' (long option) or '-' (short option)
     * Option example: "--test", "-t"
     * @usage
     *      cli.add_option({
     *          name: { long: "--test", short: "-t" },
     *          is_flag: true,
     *          description: "test option",
     *      })
     */
    add_option(option: Option): this;
    add_argument(): this;
    /**
     * Parse command line arguments
     */
    parse(): void;
    /** Print help message */
    private help;
}
