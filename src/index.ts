import chalk from "chalk";

export class Cli {
  description: string;
  name: string;

  constructor(name: string, description: string) {
    this.description = description;
    this.name = name;
  }

  public command() {
    return this;
  }

  help() {
    console.log(`${this.description}`);
  }
}
