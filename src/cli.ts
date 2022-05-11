// Cli

import { char } from "./char_type";
import * as colors from "chalk";

interface Cli_config {
    verbose_parsing: boolean;
}

interface Option {
    name: {
        long: `--${string}`;
        short?: `-${char}` | undefined;
    };
    is_flag: boolean;
    description: string;
}

const default_cli_config: Cli_config = {
    verbose_parsing: false,
};

export class Cli {
    private cmd_args: string[];
    private options: Map<string, Option>;
    private readonly executable_name: string;
    private readonly description: string;
    private readonly version: `${number}.${number}.${number}`;
    private config: Cli_config;

    constructor(cli_name: string, description: string, version: `${number}.${number}.${number}`, config?: Cli_config) {
        this.cmd_args = process.argv.splice(2);
        this.executable_name = cli_name.replace(/\s/g, "");
        this.description = description;
        this.version = version;
        this.config = config || default_cli_config;
        this.options = new Map();
        this.options.set("help", {
            name: {
                long: "--help",
                short: "-h",
            },
            is_flag: true,
            description: "Print this help message and exit",
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

    /**
     * Add new option to options Map
     */
    public add_option(option: Option) {
        // TODO: also check if short name does already exists
        if (this.options.has(option.name.long.substring(2))) {
            console.log(`error: '${option.name.long.substring(2)}' You can't add an option that already exists!`);
            process.exit(1);
        }
        this.options.set(option.name.long.substring(2), option);
    }

    /**
     * Parse command line arguments
     */
    public parse() {
        //  Check if args array is empty
        //  if true print help and return void
        if (this.cmd_args.length == 0) {
            this.help();
            return;
        }

        var parsed_options: { [key: string]: boolean | string } = {};

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

            // TODO: refactor
            if (arg.startsWith("--")) {
                let arg_long_name = arg.substring(2);
                var value = arg_long_name.split("=")[1];
                arg_long_name = arg_long_name.split("=")[0];

                let option = this.options.get(arg_long_name);
                if (option == undefined) continue;

                if (option.is_flag) {
                    parsed_options[arg_long_name] = true;
                } else {
                    if (!value) {
                        console.log(`error: '${arg.split("=")[0]}' requires a value`);
                        process.exit(1);
                    }

                    parsed_options[arg_long_name] = value;
                }

                continue;
            }

            if (arg.startsWith("-")) {
                arg = arg.split("=")[0].substring(1);

                if (arg.length > 1) {
                    for (const short_option of arg) {
                        let option_obj = get_option_with_short_name(short_option, this.options);
                        if (option_obj == undefined) continue;

                        parsed_options[option_obj!.name.long] = true;
                    }
                } else if (arg.length == 1) {
                    // TODO: handle if not a flag
                    let option = get_option_with_short_name(arg, this.options);
                    if (option == undefined) continue;

                    parsed_options[option!.name.long] = true;
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
        for (const [key, value] of this.options.entries()) {
            let short = (value.name.short && colors.yellowBright(value.name.short)) || "  ";
            let is_flag = (value.is_flag && colors.green("flag ")) || "";
            console.log(`\t${short}, ${colors.yellowBright(value.name.long)}\t${is_flag}${value.description}`);
        }
    }
}

function get_option_with_short_name(short_name: string, options: Map<string, Option>): Option | undefined {
    for (const [_, value] of options.entries()) {
        if (value.name.short == `-${short_name}`) {
            return value;
        }
    }
}
