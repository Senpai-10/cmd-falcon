import * as colors from 'chalk';
import { Option } from './interfaces';
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
    private readonly version: string;

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
        version: string;
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
        // TODO: rewrite parser
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
