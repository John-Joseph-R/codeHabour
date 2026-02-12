import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const CreateRepo = () => {
  const navigate = useNavigate();

  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if repo already exists for this user
  const repoExists = async (name, uid) => {
    const q = query(
      collection(db, "repositories"),
      where("name", "==", name),
      where("ownerId", "==", uid)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  };

  const handleCreateRepo = async (e) => {
    e.preventDefault();
    setError("");

    if (!repoName.trim()) {
      setError("Repository name is required");
      return;
    }

    if (!auth.currentUser) {
      setError("You must be logged in");
      return;
    }

    setLoading(true);

    try {
      const uid = auth.currentUser.uid;

      // Prevent duplicate repo names
      const exists = await repoExists(repoName, uid);
      if (exists) {
        setError("Repository already exists");
        setLoading(false);
        return;
      }

      // 1️⃣ Create repository
      const repoRef = await addDoc(collection(db, "repositories"), {
        name: repoName,
        description,
        ownerId: uid,
        visibility: "public",
        starsCount: 0,
        createdAt: serverTimestamp(),
      });

      // 2️⃣ Create initial commit
      const commitRef = await addDoc(collection(db, "commits"), {
        repoId: repoRef.id,
        message: "Initial commit",
        authorId: uid,
        branch: "main",
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Write latestCommit into repository
      await updateDoc(doc(db, "repositories", repoRef.id), {
        latestCommit: {
          id: commitRef.id,
          message: "Initial commit",
          authorId: uid,
          timestamp: serverTimestamp(),
        },
      });

      navigate(`/repo/${repoRef.id}`);
    } catch (err) {
      console.error("Create repo failed:", err);
      setError("Failed to create repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Create New Repository</h2>

      <form onSubmit={handleCreateRepo}>
        <div style={{ marginBottom: 16 }}>
          <label>Repository Name</label>
          <input
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: 12 }}>{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Repository"}
        </button>
      </form>
    </div>
  );
};

export default CreateRepo;
