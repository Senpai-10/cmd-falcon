// Cli

export class Cli {
    private cmd_args: string[];

    constructor() {
        // get args from process and remove first 2 items
        this.cmd_args = process.argv.splice(2);
    }
    // TODO add methods to add options

    /**
     * Parse command line arguments
     */
    public parse(): void {
        //  Check if args array is empty
        //  if true print help and return void
        if (this.cmd_args.length == 0) {
            this.help();
            return;
        }

        /* 
            TODO: loop cmdargs 
            if item starts with '-'
                if length is equal to 2
                    take item and check if it's option
                    if true add to found options
                if length is more than 2 (2 because of the '-' char)
                    loop through string excluding the '-' char
                        check every char and if the char is found to be an option
                        add it and continue looping through string    
                
                if (item is not a flag take the next index as value and jump after it 
                    or check if item contans '=')
        */
    }

    /** Print help message */
    private help(): void {
        // TODO build help message from provided args and options
        // or build it in this.parse and append string to this.help message
        // and use this method only from printing help_message
        console.log("help message!");
    }
}
