import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ username: "", bio: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleUpdate = async () => {
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, { username: profile.username, bio: profile.bio });
    alert("Profile updated!");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <label>Username:</label>
      <input
        value={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />
      <label>Bio:</label>
      <textarea
        value={profile.bio}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
      />
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
}

export default Profile;
