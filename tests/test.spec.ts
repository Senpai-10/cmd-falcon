import 'jest';
import { Cli } from '../src/index';

describe('cli', () => {
    it('Cli init', () => {
        const cli = new Cli({
            program: 'cli-test',
            description: 'just a test',
            version: '0.1.0',
            args: ['-t'],
        });

        expect(cli).toBeInstanceOf(Cli);
    });

    it('Add options', () => {
        const cli = new Cli({
            program: 'cli-test',
            description: 'just a test',
            version: '0.1.0',
            args: ['-t'],
        });

        cli.add_option({
            name: { long: '--test', short: '-t' },
            is_flag: true,
            description: 'test option',
        })
            .add_option({
                name: { long: '--verbose' },
                is_flag: true,
                description: 'test option',
            })
            .add_option({
                name: { long: '--name', short: '-n' },
                is_flag: false,
                default: 'senpai-10',
                description: 'get username',
            });
    });

    it('parse command line arguments', () => {
        const cli = new Cli({
            program: 'cli-test',
            description: 'just a test',
            version: '0.1.0',
            args: ['-n=testname', '-t', '--verbose'],
        });

        cli.add_option({
            name: { long: '--test', short: '-t' },
            is_flag: true,
            description: 'test option',
        })
            .add_option({
                name: { long: '--verbose' },
                is_flag: true,
                description: 'verbose option',
            })
            .add_option({
                name: { long: '--file-name', short: '-f' },
                is_flag: false,
                description: 'file-name option',
            })
            .add_option({
                name: { long: '--name', short: '-n' },
                is_flag: false,
                default: 'senpai-10',
                description: 'get username',
            });

        cli.parse();

        interface parsed {
            test: string;
            verbose: string;
            name: string;
        }
        let opts: parsed = cli.opts;

        expect(opts.name).toBe('testname');
        expect(opts.test).toBeTruthy();
        expect(opts.verbose).toBeTruthy();
    });
});
