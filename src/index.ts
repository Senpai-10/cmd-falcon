interface I_command {
  name: string;
  help: string;
  args?: [
    {
      name: string;
      help: string;
      required: boolean;
    }
  ];
  options?: [
    {
      name: `--${string}`;
      alias?: `-${string}`;
      help: string;
      is_flag: boolean;
    }
  ];
  callback: (options: Map<string, string>) => void;
}

export class Cli {
  private name: string;
  private description: string;
  private args: Array<string>;
  private commands: Map<string, I_command>;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.args = process.argv.slice(2);
    this.commands = new Map();
  }

  public command(command_props: I_command) {
    this.commands.set(command_props.name, command_props);

    return this;
  }

  public parse() {
    const command = this.commands.get(this.args[0]);
    if (command) {
      this.args = this.args.slice(1);
      for (let i = 0; i < this.args.length; i++) {
        // find and args options
        const options = new Map<string, string>();

        if (command.options) {
          const option = command.options.find(
            (option) => this.args[i].split("=")[0] == option.name
          );
          if (option) {
            const value = this.args[i].split("=")[1];

            if (value == undefined && !option.is_flag) {
              // TODO: better error message!
              console.log(`ERORR please provide ${option.name} value`);
              return;
            }

            options.set(option.name, value);
            /**
             * TODO: remove option from this.args array
             * and put all args into arguments map
             * and send as a property to command.callback
             */
          }

          command.callback(options);
        }
      }
    } else {
      this.help();
    }
  }

  private help() {
    console.log(`${this.description}`);
  }
}
