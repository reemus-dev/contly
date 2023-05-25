import React from "react";
import {notFound} from "next/navigation";
import {AsyncComponent} from "@/components/AsyncComponent";
import {Collection} from "@contly/content";

export const ArticlePage = AsyncComponent(
  async (props: {type: "article"; slug: string; children: React.ReactNode}) => {
    const {type, slug, children} = props;

    const article = await Collection.get({type, slug});
    if (!article) {
      return notFound();
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>{article.meta.title}</h1>
        <p>{article.meta.date.toString()}</p>
        <p>{article.meta.description}</p>
        <article className="prose">{children}</article>
      </main>
    );
  }
);

export default ArticlePage;
