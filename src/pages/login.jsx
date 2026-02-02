import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/dashboard");
  };
 
  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />

      <button type="submit">Login</button>

      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
}

export default Login;
