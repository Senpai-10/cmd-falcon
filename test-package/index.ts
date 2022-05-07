import { Cli } from "cmd-parser";

const cli = new Cli("test cli", "just a test", "1.0.0", {
    verbose_parsing: true,
});

// cli.add_option("--test", true, "test flag");
// cli.add_option("--test2", false, "test option");
cli.add_option({
    name: { long: "--test", short: "-t" },
    is_flag: true,
    description: "test option",
});

cli.add_option({
    name: { long: "--verbose", short: "-v" },
    is_flag: true,
    description: "test option",
});

cli.add_option({
    name: { long: "--name", short: "-n" },
    is_flag: false,
    description: "test option",
});

let parser = cli.parse();

console.log(parser);
