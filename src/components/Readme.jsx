import FileViewer from "./FileViewer";

function Readme({ repoId }) {
  return <FileViewer repoId={repoId} path="README.md" />;
}

export default Readme;
