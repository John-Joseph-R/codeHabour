export function buildTree(files) {
  const tree = {};

  files.forEach((path) => {
    const parts = path.split("/");
    let current = tree;

    parts.forEach((part) => {
      current[part] = current[part] || {};
      current = current[part];
    });
  });

  return tree;
}
