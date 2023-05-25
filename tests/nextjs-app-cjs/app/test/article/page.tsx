import Content from "@/content/article/test-article.mdx";
import {Collection, CollectionSchemas, CollectionTypes} from "@contly/content";

// import {Asshole, CollectionSchemas, CollectionTypes} from "@contly/content:types";

type T = CollectionTypes;
type B = CollectionSchemas["article"];
// type B = Asshole;

// const ab: CollectionSchemas["article"] = {
// date: "",
// description: null,
// };

async function t() {
  const b = await Collection.get({
    type: "article",
    slug: "",
  });
  const b1 = b?.meta.slug;
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <article className="prose">
        <Content />
      </article>
    </main>
  );
}
