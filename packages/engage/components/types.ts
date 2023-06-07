import React from "react";

export type ReactCP<T = {}> = {
  children?: React.ReactNode;
} & T;
export type ReactSvgProps = React.SVGProps<SVGSVGElement>;
export type ReactElementProps<T> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>;
