import { char } from './types';

export interface Option {
    name: {
        /** @example '--test' */
        long: `--${string}`;
        /** @example '-t' */
        short?: `-${char}` | undefined;
    };
    required?: boolean;
    /** Default value for options if value is not found */
    default?: string;
    /** Add a short help description for your option/flag */
    help: string;
}

export interface Flag {
    /** Flag name */
    name: {
        /** @example '--test' */
        long: `--${string}`;
        /** @example '-t' */
        short?: `-${char}` | undefined;
    };
    type?: FlagType | undefined
    /** Add a short help description for your option/flag */
    help: string;
}

export enum FlagType {
    /** Flag return a number */
    Counter,
    /** Default flag behaviour */
    Bool
}

