declare module "@conte/content:types" {
  type Schema = Record<string, unknown>;
  export type CollectionTypes = string;
  export type CollectionSchemas = Record<CollectionTypes, Schema>;
}
