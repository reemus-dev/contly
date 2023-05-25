import GithubSlugger from "github-slugger";
import _ from "lodash";
import {HeadingFlat, HeadingTreeNode} from "../types.js";

const contentClean = (content: string) => {
  return content.replaceAll(/```(.|\n)*?```/g, "");
};

const contentMatchHeadings = (content: string) => {
  // Match heading tags with regex
  const match = Array.from(content.matchAll(/^#{1,6}.+(?=\n)/gm));
  // return matched headings
  return match.map((h) => h[0]);
};

const headingsAnalyzeDepth = (headings: string[]) => {
  let depthShallowest = Infinity;
  for (const heading of headings) {
    const depth = heading.match(/^#+/)?.[0]?.length || 0;
    depthShallowest = Math.min(depthShallowest, depth);
  }

  const depthTillStart = depthShallowest - 1;

  return {depthShallowest, depthTillStart};
};

const headingsFlat = (headings: string[], depthTillStart: number) => {
  const slugger = new GithubSlugger();
  function getSlug(heading: string) {
    const slug = slugger.slug(heading);
    return `heading-${slug}`;
  }

  return headings.map((h) => {
    const count = h.match(/^#+/);
    const depthActual = count?.[0]?.length || 0;
    const depthNormalized = depthActual - depthTillStart;
    const depth = {actual: depthActual, normalized: depthNormalized};
    const heading = h.replace(/^#+\s/, "");
    if (depth.actual === 0 || depth.normalized === 0) {
      throw new Error(`Heading "${h}" has depth 0`);
    }
    const slug = getSlug(heading);
    const node: HeadingFlat = {slug, heading, depth};
    return node;
  });
};

const headingsTree = (flat: HeadingTreeNode[]) => {
  // Clone to avoid mutating the original array
  flat = _.cloneDeep(flat);

  // The array holding root nodes
  const root: HeadingTreeNode[] = [];

  // Store references to the nodes by their depth
  const map: Record<number, HeadingTreeNode> = {};

  for (const node of flat) {
    map[node.depth.normalized] = node;
    const parent = map[node.depth.normalized - 1];
    if (parent) {
      parent.nodes ??= [];
      parent.nodes.push(node);
    } else {
      root.push(node);
    }
  }

  return root;
};

export const FileHeadings = {
  extract: (contentRaw: string) => {
    const content = contentClean(contentRaw);
    const headings = contentMatchHeadings(content);
    const {depthTillStart} = headingsAnalyzeDepth(headings);
    const flat = headingsFlat(headings, depthTillStart);
    const tree = headingsTree(flat);
    return {flat, tree};
  },
};
