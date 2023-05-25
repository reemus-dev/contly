import React from "react";
import type {MDXComponents} from "mdx/types";
import {ResponsiveImage} from "@/components/ResponsiveImage";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    img: ResponsiveImage,
  };
}
