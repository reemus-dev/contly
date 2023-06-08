import {GrayMatterFile} from "gray-matter";
import {CollectionSchemas, CollectionTypes} from "@contly/core:types";

/* Meta types */
export type FileNameInfo = {
  ext: string;
  base: string;
  full: string;
};

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
export type CollectionFileShape<K extends CollectionTypes> = {
  type: K;
  slug: string;
  meta: CollectionMetadata<K>;
  matter: CollectionMatter;
  file: {
    name: FileNameInfo;
    path: string;
  };
  headings: {
    tree: HeadingTreeNode[];
    flat: HeadingFlat[];
  };
};

export type CollectionFileComponent = (props: {slug: string}) => any;

export type {CollectionTypes, CollectionSchemas};
