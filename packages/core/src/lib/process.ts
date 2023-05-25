export const processExit = (isError: boolean, error: any) => {
  if (isError) {
    if (error) console.error(error);
    process.exit(1);
  }
  process.exit(0);
};
