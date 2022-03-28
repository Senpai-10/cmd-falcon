import chalk from "chalk";

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
  callback: Function;
}

export class Cli {
  name: string;
  description: string;
  args: Array<string>;
  commands: Map<string, I_command>;

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
        const options = new Map<string, I_command["options"]>();

        if (command.options) {
          if (command.options.find((option) => this.args[i] == option.name)) {
            console.log(`${this.args[i]} is an option!`);
            const option = this.args[i].split("=");
            const value = this.args[i].split("=");

            console.log(option);
            console.log(value);
          }
        }

        console.log(this.args[i]);
      }
    } else {
      this.help();
    }

    // for (let i = 0; i < this.args.length; i++) {
    //   for (let j = 0; j < this.commands.length; j++) {
    //     const command = this.commands[j];
    //     const arg = this.args[i];
    //     if (this.args[0] == command.name) {
    //       // find options and get value after '=' save options to Map<{name: string, etc...}>
    //       console.log(arg);

    //       command.callback();
    //     } else {
    //       this.help();
    //     }
    //   }
    // }
  }

  private help() {
    console.log(`${this.description}`);
  }
}
