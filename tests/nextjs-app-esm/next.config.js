import nextMDX from "@next/mdx";

const withMDX = nextMDX({
  options: {
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withMDX(nextConfig);
