import React from "react";

type AsyncRenderer<Props> = (props: Props) => Promise<ReturnType<React.FC<Props>>>;

export function AsyncComponent<Props>(component: AsyncRenderer<Props>): React.FC<Props> {
  return component as any;
}
