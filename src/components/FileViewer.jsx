import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import { useEffect, useState } from "react";

function FileViewer({ repoId, path }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    async function loadFile() {
      const fileRef = ref(storage, `repos/${repoId}/${path}`);
      const url = await getDownloadURL(fileRef);
      const res = await fetch(url);
      setContent(await res.text());
    }

    loadFile();
  }, [repoId, path]);

  return <pre>{content}</pre>;
}

export default FileViewer;
