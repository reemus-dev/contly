export const getModuleType = () => {
  return typeof module !== "undefined" && module.parent !== undefined ? "cjs" : "esm";
};
