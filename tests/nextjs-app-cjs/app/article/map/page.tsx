import React from "react";
import ContentWrapper from "@/components/ArticlePage";

export default async function Page() {
  const { default: Content } = await import("@/content/article/test-map.mdx");
  return (
    <ContentWrapper type="article" slug="map">
      <Content />
    </ContentWrapper>
  );
}
