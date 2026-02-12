import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
  updateDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";

function RepoDashboard() {
  const { repoId } = useParams();

  const [repo, setRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [folderFiles, setFolderFiles] = useState([]);

  useEffect(() => {
    fetchRepo();
    fetchFiles();
  }, [repoId]);

  const fetchRepo = async () => {
    const snap = await getDoc(doc(db, "repositories", repoId));
    if (snap.exists()) setRepo({ id: snap.id, ...snap.data() });
  };

  const fetchFiles = async () => {
    const q = query(collection(db, "files"), where("repoId", "==", repoId));
    const snap = await getDocs(q);
    setFiles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  // ---------------- Folder Upload ----------------

  const handleFolderPick = (e) => {
    setFolderFiles(Array.from(e.target.files));
  };

  const commitFolder = async () => {
    if (!folderFiles.length) return;

    const commitRef = await addDoc(collection(db, "commits"), {
      repoId,
      message: "Folder upload",
      authorId: auth.currentUser.uid,
      branch: "main",
      createdAt: serverTimestamp()
    });

    for (const file of folderFiles) {

      // Skip node_modules + builds
      if (
        file.webkitRelativePath.includes("node_modules") ||
        file.webkitRelativePath.includes("dist") ||
        file.webkitRelativePath.includes("build")
      ) continue;

      // Skip files larger than 800KB
      if (file.size > 800000) continue;

      const content = await readFile(file);

      await addDoc(collection(db, "files"), {
        repoId,
        path: file.webkitRelativePath,
        content,
        commitId: commitRef.id,
        createdAt: serverTimestamp()
      });
    }

    await updateDoc(doc(db, "repositories", repoId), {
      latestCommit: {
        id: commitRef.id,
        message: "Folder upload",
        timestamp: serverTimestamp()
      }
    });

    setFolderFiles([]);
    fetchFiles();
    fetchRepo();
  };

  const readFile = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onload = e => res(e.target.result);
      reader.readAsText(file);
    });

  if (!repo) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>

      <h2>{repo.name}</h2>

      {repo.latestCommit && (
        <p><strong>Latest commit:</strong> {repo.latestCommit.message}</p>
      )}

      <hr />

      {/* Upload Folder */}
      <h3>Upload Folder</h3>

      <input
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleFolderPick}
      />

      <br /><br />

      <button onClick={commitFolder}>Commit Folder</button>

      <hr />

      {/* Files */}
      <h3>Files</h3>

      <ul>
        {files.map(f => (
          <li
            key={f.id}
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => setSelectedFile(f)}
          >
            {f.path}
          </li>
        ))}
      </ul>

      {/* File Viewer */}
      {selectedFile && (
        <>
          <h4>{selectedFile.path}</h4>
          <pre style={{ background: "#eee", padding: 10 }}>
            {selectedFile.content}
          </pre>
        </>
      )}

      {/* README */}
      {files.filter(f => f.path.toLowerCase().includes("readme.md")).map(f => (
        <div key={f.id}>
          <h3>README</h3>
          <pre>{f.content}</pre>
        </div>
      ))}
    </div>
  );
}

export default RepoDashboard;
