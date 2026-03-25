import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/login?username=${username}`
      );

      console.log(res.data);

      // 🔥 Save token
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      // 🔥 Redirect
      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/employee";
      }

    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}