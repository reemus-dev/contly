import React from "react";
import ContentWrapper from "@/components/ArticlePage";

export default async function Page() {
  const { default: Content } = await import("@/content/blog/test-blog.mdx");
  return (
    <ContentWrapper type="blog" slug="post-slug">
      <Content />
    </ContentWrapper>
  );
}
