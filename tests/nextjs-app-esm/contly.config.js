/** @type {import('@contly/nextjs').NextPluginConfigFn} */
export default async (z) => ({
  collections: {
    article: {
      component: "@/components/ArticlePage",
      contentPath: "content/article",
      outputPath: "app/article",
      schema: z.object({
        slug: z.string(),
        date: z.date(),
        title: z.string(),
        description: z.string().optional(),
      }),
    },
    blog: {
      component: "@/components/ArticlePage",
      contentPath: "content/blog",
      outputPath: "app/blog",
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        categories: z.array(z.string()).optional(),
      }),
    },
  },
});
