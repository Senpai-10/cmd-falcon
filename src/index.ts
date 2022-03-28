import chalk from "chalk";

export class Cli {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  public command() {
    return this;
  }

  help() {
    console.log(`${this.description}`);
  }
}
