// Cli

import { char } from "./char_type";
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
    private readonly cli_name: string;
    private readonly description: string;
    private readonly version: `${number}.${number}.${number}`;
    config: Cli_config;

    constructor(cli_name: string, description: string, version: `${number}.${number}.${number}`, config?: Cli_config) {
        // get args from process and remove first 2 items
        this.cmd_args = process.argv.splice(2);
        this.cli_name = cli_name.replace(/\s/g, "");
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
                console.log(`${this.cli_name}: ${this.version}`);
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
                        let option_obj = this.get_option_with_short_name(short_option);
                        if (option_obj == undefined) continue;

                        parsed_options[option_obj!.name.long] = true;
                    }
                } else if (arg.length == 1) {
                    // handle if not a flag
                    let option = this.get_option_with_short_name(arg);
                    if (option == undefined) continue;

                    parsed_options[option!.name.long] = true;
                }
                continue;
            }
        }

        return parsed_options;
    }

    private get_option_with_short_name(short_name: string): Option | undefined {
        for (const [_, value] of this.options.entries()) {
            if (value.name.short == `-${short_name}`) {
                return value;
            }
        }
    }

    /** Print help message */
    private help(): void {
        // TODO build help message from provided args and options
        // or build it in this.parse and append string to this.help message
        // and use this method only from printing help_message
        console.log("help message!");
    }
}
