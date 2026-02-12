function FileTree({ tree, onSelect }) {
  return (
    <ul>
      {Object.keys(tree).map((key) => (
        <li key={key}>
          {key}
          {Object.keys(tree[key]).length > 0 && (
            <FileTree tree={tree[key]} onSelect={onSelect} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default FileTree;
