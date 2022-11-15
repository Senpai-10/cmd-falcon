// TODO obey by Terms
//      add     add_flag
//      add     add_argument
//      change  add_option to only add options not flags

import * as colors from 'chalk';
import { Option } from './interfaces';
import { Version } from './types';
import { find_option } from './utils';

/*
    TODO:
    parse arguments
    add a new interface named Argument
    add to Cli constructor args, args is an array if objects with type Argument
    in parser method if cli_arg don't start with '-' or '--'
    check if args is not empty if true
    get first arg from args and then
    run parsed_options[arg_name] = cli_arg
    note: (arg_name) is from args first item
    + maybe change parsed_options name to parsed or something like this
*/

export class Cli {
    public opts: any;
    private args: string[];
    private options: Map<string, Option>;
    private readonly program: string;
    private readonly description: string;
    private readonly epilog: string;
    private readonly version: Version;

    constructor({
        program,
        description,
        epilog,
        version,
        args,
    }: {
        /** The name of the program */
        program: string;
        description: string;
        /** Text to display after help message */
        epilog?: string;
        version: Version;
        /** provide args (default: process.argv.splice(2)) */
        args?: string[];
    }) {
        this.opts = {};
        // Remove first 2 items from args array
        this.args = args || process.argv.splice(2);
        // Remove empty space
        this.program = program.replace(/\s/g, '');
        this.description = description;
        this.epilog = epilog || "";
        this.version = version;

        this.options = new Map();
        // Add default options help, version
        this.options.set('help', {
            name: {
                long: '--help',
                short: '-h',
            },
            is_flag: true,
            description: 'Print this message and exit',
        });
        this.options.set('version', {
            name: {
                long: '--version',
                short: '-v',
            },
            is_flag: true,
            description: 'Print version number and exit',
        });
    }

    /** Option is an argument that starts with  '--' (long option) or '-' (short option)
     * Option example: "--test", "-t"
     * @usage
     *      cli.add_option({
     *          name: { long: "--test", short: "-t" },
     *          is_flag: true,
     *          description: "test option",
     *      })
     */
    public add_option(option: Option) {
        // TODO: also check if short name does already exists
        // Remove '--' from option long name
        let long_name = option.name.long.substring(2);

        if (this.options.has(long_name)) {
            console.log(`error: '${long_name}' You can't add an option that already exists!`);
            process.exit(1);
        }

        this.options.set(long_name, option);
        return this;
    }

    public add_argument() {
        // TODO check if argument already exists in args and in options
        return this;
    }

    /**
     * Parse command line arguments
     */
    public parse() {
        //  Check if args array is empty
        //  if true print help and return void
        if (this.args.length == 0) {
            this.help();
            process.exit(0);
        }

        for (let i = 0; i < this.args.length; i++) {
            let arg = this.args[i];

            if (arg == '--help' || arg == '-h') {
                this.help();
                process.exit(0);
            }
            if (arg == '--version' || arg == '-v') {
                console.log(`${colors.yellowBright(this.version)}`);
                process.exit(0);
            }

            // TODO: refactor if arg.startsWith("--") and if arg.startsWith("-")
            // TODO: check if option/flag is required if true print '{option_name} is required' and exit with error code 1
            if (arg.startsWith('--')) {
                arg = arg.substring(2);
                let name = arg.split('=')[0];
                var value = arg.split('=')[1];

                let option = find_option(name, 'long', this.options);
                if (option == undefined) continue;

                if (option.is_flag) {
                    this.opts[name] = true;
                } else {
                    if (!value && !option.default) {
                        console.log(`error: '${arg.split('=')[0]}' requires a value`);
                        process.exit(1);
                    } else if (!value && option.default) {
                        this.opts[name] = option.default;

                        continue;
                    }

                    this.opts[name] = value;
                }

                continue;
            } else if (arg.startsWith('-')) {
                // short option name without '-'
                let value = arg.split('=')[1];
                arg = arg.split('=')[0].substring(1);

                // Check if the flag length is > 1
                // If true that means that the flag contains more flags (Like this: -tvpm)
                // 1. Loop through flag string ("-tvpm")
                // 2. check if flag is valid
                // 3. add flag to parsed_options with true value

                // note: options are not allowd in this compact form
                if (arg.length > 1) {
                    for (const short_option of arg) {
                        let option = find_option(short_option, 'short', this.options);
                        if (option == undefined) continue;
                        let name = option!.name.long.substring(2);

                        // Why? because The option value is going to be 'true'
                        if (option.is_flag == false && !option.default) {
                            continue;
                        } else if (option.default) {
                            this.opts[name] = option.default;
                            continue;
                        }

                        this.opts[name] = true;
                    }
                } else if (arg.length == 1) {
                    let option = find_option(arg, 'short', this.options);
                    if (option == undefined) continue;
                    let name = option!.name.long.substring(2);

                    if (option.is_flag) {
                        this.opts[name] = true;
                    } else {
                        if (!value && !option.default) {
                            console.log(`error: '${arg.split('=')[0]}' requires a value`);
                            process.exit(1);
                        } else if (!value && option.default) {
                            this.opts[name] = option.default;
                            continue;
                        }

                        this.opts[name] = value;
                    }
                }
                continue;
            } else {
                // handle arguments here!
            }
        }
    }

    /** Print help message */
    private help(): void {
        console.log(`Usage: ${this.program} [options]`);
        console.log();
        console.log(`  ${colors.gray(this.description)}`);

        console.log();
        console.log();

        console.log(`${colors.greenBright('Options:')}`);
        for (const [_, value] of this.options.entries()) {
            let short = (value.name.short && colors.yellowBright(value.name.short)) || '  ';
            let long_name = colors.yellowBright(value.name.long);
            let description = colors.gray(value.description);

            if (value.is_flag) {
                console.log(`\t${short}, ${long_name}\t${colors.green('flag ')}\n\t\t${description}`);
            } else if (value.is_flag == false) {
                let default_value = (value.default && `[default: ${value.default}] `) || '';
                console.log(`\t${short}, ${long_name}\t${default_value}\n\t\t${description}`);
            }
        }

        console.log()
        console.log(`${colors.gray(this.epilog)}`)
    }
}
