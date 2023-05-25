const nextMDX = require("@next/mdx");

const withMDX = nextMDX({
  options: {
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withMDX(nextConfig);
