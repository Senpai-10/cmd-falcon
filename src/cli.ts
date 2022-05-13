/*
┌──────────────────────────────────────────────────────────────┐
|                                                              |
│    Terms:                                                    │
│       Option                                                 |
│           is an argv item that starts with '--' or '-'       |
│           example: '--name=foo' '-n=foo'                     |
|           parser.name equal to 'foo'                         |
│                                                              |
│       Argument                                               |
|           is an item of information                          |
|           provided to a program when it is started           |
|                                                              |
│       Flag                                                   |
│           is an argv item that starts with '--' or '-'       |
|            but don't take any type of value                  |
|            example: '--test' '-t'                            |
|            parser.test equal true if found                   |
|                                                              |
└──────────────────────────────────────────────────────────────┘
*/

// TODO obey by Terms
//      add     add_flag
//      add     add_argument
//      change  add_option to only add options not flags

import * as colors from "chalk";
import { Cli_config, Option } from "./interfaces";
import { Version } from "./types";
import { find_option } from "./utils";

const default_cli_config: Cli_config = {
    verbose_parsing: false,
};

// TODO: parse arguments
// add a new interface named Argument
// add to Cli constructor args, args is an array if objects with type Argument
// in parser method if cli_arg don't start with '-' or '--'
// check if args is not empty if true
// get first arg from args and then
// run parsed_options[arg_name] = cli_arg
// note: (arg_name) is from args first item
// + maybe change parsed_options name to parsed or something like this

// TODO: add default value to options
// TODO: add required to Option interface,
//      and in the parser check if option is required or not if true panic and print '{option_name} is required'

export class Cli {
    private cmd_args: string[];
    private options: Map<string, Option>;
    private readonly executable_name: string;
    private readonly description: string;
    private readonly version: Version;
    private config: Cli_config;

    constructor(cli_name: string, description: string, version: Version, config?: Cli_config) {
        // Remove first 2 items from args array
        this.cmd_args = process.argv.splice(2);
        // Remove empty space
        this.executable_name = cli_name.replace(/\s/g, "");
        this.description = description;
        this.version = version;
        // Use default config if config parameter is not undefined
        this.config = config || default_cli_config;

        this.options = new Map();
        // Add default options help, version
        this.options.set("help", {
            name: {
                long: "--help",
                short: "-h",
            },
            is_flag: true,
            description: "Print this message and exit",
        });
        this.options.set("version", {
            name: {
                long: "--version",
                short: "-v",
            },
            is_flag: true,
            description: "Print version number and exit",
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
    }

    public add_argument() {
        // TODO check if argument already exists in args and in options
    }

    /**
     * Parse command line arguments
     */
    public parse() {
        //  Check if args array is empty
        //  if true print help and return void
        if (this.cmd_args.length == 0) {
            this.help();
            process.exit(0);
        }

        /** The returned object
         *  if option is found the option long name will be put into this object
         */
        // var parsed_options: { [key: string]: boolean | string } = {};
        var parsed_options: any = {};

        for (let i = 0; i < this.cmd_args.length; i++) {
            let arg = this.cmd_args[i];

            if (arg == "--help" || arg == "-h") {
                this.help();
                process.exit(0);
            }
            if (arg == "--version" || arg == "-v") {
                console.log(`${colors.yellowBright(this.version)}`);
                process.exit(0);
            }

            // TODO: refactor if arg.startsWith("--") and if arg.startsWith("-")
            if (arg.startsWith("--")) {
                arg = arg.substring(2);
                let name = arg.split("=")[0];
                var value = arg.split("=")[1];

                let option = find_option(name, "long", this.options);
                if (option == undefined) continue;

                if (option.is_flag) {
                    parsed_options[name] = true;
                } else {
                    if (!value) {
                        console.log(`error: '${arg.split("=")[0]}' requires a value`);
                        process.exit(1);
                    }

                    parsed_options[name] = value;
                }

                continue;
            }

            if (arg.startsWith("-")) {
                // short option name without '-'
                arg = arg.split("=")[0].substring(1);

                // Check if the argument length is > 1
                // If true that means that the argument contains more options (Like this: -tvpm)
                // 1. Loop through argument string ("-tvpm")
                // 2. check if option is valid if true
                // 3. add option to parsed_options with true value

                // note: non flag option (option that need a value other than boolean)
                //       are not allowd in this compact form
                if (arg.length > 1) {
                    for (const short_option of arg) {
                        let option_obj = find_option(short_option, "short", this.options);
                        if (option_obj == undefined) continue;

                        // Why? because The option value is going to be 'true'
                        if (option_obj.is_flag == false) {
                            continue;
                        }

                        let name = option_obj!.name.long.substring(2);

                        parsed_options[name] = true;
                    }
                } else if (arg.length == 1) {
                    // TODO: handle if argument
                    let option = get_option_with_short_name(arg, this.options);
                    if (option == undefined) continue;

                    let name = option!.name.long.substring(2);

                    parsed_options[name] = true;
                }
                continue;
            }
        }

        return parsed_options;
    }

    /** Print help message */
    private help(): void {
        console.log(`Usage: ${this.executable_name} [options]`);
        console.log();
        console.log(`  ${colors.gray(this.description)}`);

        console.log();
        console.log();

        console.log(`${colors.greenBright("Options:")}`);
        for (const [_, value] of this.options.entries()) {
            let short = (value.name.short && colors.yellowBright(value.name.short)) || "  ";
            let is_flag = (value.is_flag && colors.green("flag ")) || "";
            console.log(`\t${short}, ${colors.yellowBright(value.name.long)}\t${is_flag}${value.description}`);
        }
    }
}
