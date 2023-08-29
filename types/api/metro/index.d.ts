import type { Filter } from './filters';

export type InternalOptions = {
	bulk?: boolean;
	lazy?: boolean;
};

export type SearchOptions = {
	esModules?: boolean;
	interop?: boolean;
	initial?: any[];
	cache?: boolean;
	lazy?: boolean;
	raw?: boolean;
	all?: boolean;
};

export interface StoreOptions extends SearchOptions {
	short?: boolean;
}

export interface BulkItem extends Omit<SearchOptions, 'all' | 'initial' | 'cache'> {
	filter: Filter;
}

export type StringFindWithOptions<T extends string, Options = SearchOptions> = [...T[], Options];
export type BulkFind<T extends string> = [...AnyProps<{ params: T[] }>[], AnyProps<{ bulk: true }>];
export type AllValues<T extends Record<string, any>, U extends unknown> = T extends { all: true } ? U[] : U;

export type SingleModuleByProperty<T extends any[]> = T extends [...any, infer O extends SearchOptions]
    ? AllValues<O, AnyProps<{ [k in Exclude<T[number], Record<string, any>>]: any }>>
    : AnyProps<{ [k in Exclude<T[number], Record<string, any>>]: any }>

export type SingleModuleByName<T extends any[]> = T extends [...any, infer O extends SearchOptions]
    ? AllValues<O, O extends { interop: false } 
        ? { default: Fn } 
        : Fn>
    : Fn

export type BulkModuleByProperty<T extends any[]> = { 
    [K in keyof T]: AnyProps<{ 
        [P in T[K]["params"][number]]: any 
    }> 
};

export type BulkModuleByName<T extends any[]> = { 
    [K in keyof T]: T[K] extends { interop: false } 
        ? { default: Fn } 
        : Fn 
}

export type PropertyRecordOrArray<
    T extends any[], 
    U extends string
> = T extends BulkFind<U>
    ? BulkModuleByProperty<T>
    : SingleModuleByProperty<T>

export type FunctionSignatureOrArray<
    T extends any[], 
    U extends string
> = T extends BulkFind<U>
    ? BulkModuleByName<T>
    : SingleModuleByName<T>