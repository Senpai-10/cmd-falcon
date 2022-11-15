import { Option } from './interfaces';
import { Version } from './types';
export declare class Cli {
    opts: any;
    private args;
    private options;
    private readonly program;
    private readonly description;
    private readonly epilog;
    private readonly version;
    constructor({ program, description, epilog, version, args, }: {
        /** The name of the program */
        program: string;
        description: string;
        /** Text to display after help message */
        epilog?: string;
        version: Version;
        /** provide args (default: process.argv.splice(2)) */
        args?: string[];
    });
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
