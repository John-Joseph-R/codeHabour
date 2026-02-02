import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function Repositories() {
  const { user } = useAuth();
  const [repos, setRepos] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");

  useEffect(() => {
    if (!user) return;

    const fetchRepos = async () => {
      const q = query(collection(db, "repositories"), where("ownerId", "==", user.uid));
      const snapshot = await getDocs(q);
      setRepos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchRepos();
  }, [user]);

  const handleCreate = async () => {
    if (!name) return;
    await addDoc(collection(db, "repositories"), {
      name,
      description,
      visibility,
      ownerId: user.uid,
      starsCount: 0,
      createdAt: serverTimestamp()
    });
    setName(""); setDescription(""); setVisibility("public");
    // Refresh list
    const q = query(collection(db, "repositories"), where("ownerId", "==", user.uid));
    const snapshot = await getDocs(q);
    setRepos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div>
      <h2>Create Repository</h2>
      <input placeholder="Repo Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
      <button onClick={handleCreate}>Create</button>

      <h2>Your Repositories</h2>
      <ul>
        {repos.map(repo => (
          <li key={repo.id}>{repo.name} ({repo.visibility})</li>
        ))}
      </ul>
    </div>
  );
}

export default Repositories;
