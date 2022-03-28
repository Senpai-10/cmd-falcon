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
  commands: Array<I_command>;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.commands = [];
  }

  public command(command_props: I_command) {
    this.commands.push(command_props);

    return this;
  }

  public parse() {}

  private help() {
    console.log(`${this.description}`);
  }
}
