// global.d.ts

// declare type TBaseContext = Record<string, any>;

// declare type TParent = Record<string, any>;

// declare type SupabaseClient = SupabaseClient<any, "public", any>

export declare global {
    namespace globalThis{
        var SupabaseClient: SupabaseClient<any, "public", any>
        type TBaseContext = Record<string, any>;
        type TParent = Record<string, any>;
    }
    
  }