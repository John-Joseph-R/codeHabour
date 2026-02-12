import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function RepoDashboard() {
  const { repoId } = useParams();
  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDesc, setIssueDesc] = useState("");

  useEffect(() => {
    const fetchRepo = async () => {
      const docRef = doc(db, "repositories", repoId);
      const snap = await getDoc(docRef);
      if (snap.exists()) setRepo({ id: snap.id, ...snap.data() });
    };

    const fetchIssues = async () => {
      const qSnap = await getDocs(collection(db, "issues"));
      setIssues(qSnap.docs.filter(d => d.data().repoId === repoId).map(d => ({ id: d.id, ...d.data() })));
    };

    fetchRepo();
    fetchIssues();
  }, [repoId]);

  const addIssue = async () => {
    if (!issueTitle) return;
    await addDoc(collection(db, "issues"), {
      repoId,
      title: issueTitle,
      description: issueDesc,
      status: "open",
      createdAt: serverTimestamp()
    });
    setIssueTitle(""); setIssueDesc("");
    // Refresh issues
    const qSnap = await getDocs(collection(db, "issues"));
    setIssues(qSnap.docs.filter(d => d.data().repoId === repoId).map(d => ({ id: d.id, ...d.data() })));
  };

  if (!repo) return <p>Loading repo...</p>;

  return (
    <div>
      <h2>{repo.name} ({repo.visibility})</h2>
      <p>{repo.description}</p>

      <h3>Add Issue</h3>
      <input placeholder="Title" value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} />
      <textarea placeholder="Description" value={issueDesc} onChange={(e) => setIssueDesc(e.target.value)} />
      <button onClick={addIssue}>Add Issue</button>

      <h3>Issues</h3>
      <ul>
        {issues.map(issue => (
          <li key={issue.id}>{issue.title} ({issue.status})</li>
        ))}
      </ul>
    </div>
  );
}

export default RepoDashboard;
