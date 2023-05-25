import {GrayMatterFile} from "gray-matter";
import {CollectionSchemas, CollectionTypes} from "@conte/content:types";

/* File types */
export type HeadingDepth = {
  actual: number;
  normalized: number;
};
export type HeadingFlat = {
  slug: string;
  heading: string;
  depth: HeadingDepth;
};
export type HeadingTreeNode = HeadingFlat & {
  nodes?: HeadingTreeNode[];
};

/* Collection types */
// export type CollectionTypes = keyof CollectionSchemas;
export type CollectionMetadata<K extends CollectionTypes> = CollectionSchemas[K];
export type CollectionMatter = Omit<GrayMatterFile<string>, "data">;
export type CollectionFile<K extends CollectionTypes> = CollectionMatter & {
  type: K;
  slug: string;
  meta: CollectionMetadata<K>;
  file: {
    name: string;
    path: string;
  };
  headings: {
    tree: HeadingTreeNode[];
    flat: HeadingFlat[];
  };
};

export type CollectionFileComponent = (props: {slug: string}) => any;

export type {CollectionTypes, CollectionSchemas};
