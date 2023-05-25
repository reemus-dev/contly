"use client";

import React from "react";
import Image from "next/image";
import {AsyncComponent} from "@/components/AsyncComponent";

// type Props = Omit<React.ComponentProps<"img">, "src"> & {src: string};
// type Props = {src: string; alt: string};
type Props = React.ComponentProps<"img">;

export const ResponsiveImage = AsyncComponent(async (props: Props) => {
  const src = props.src || "";
  const img = src.startsWith("/") ? await import(`../public${src}`) : src;
  return (
    <Image
      sizes="100vw"
      /*width={500}*/
      /*height={500}*/
      src={img}
      /*src={props.src || ""}*/
      alt={props.alt || ""}
      style={{width: "100%", height: "auto"}}
    />
  );
});
