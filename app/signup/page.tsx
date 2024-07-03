"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      // Sign up the user
      const response = await axios.post("/api/auth/signup", { email, password });
      if (response.status === 201) {
        // Automatically sign in the user after successful signup
        const result = await signIn("credentials", { redirect: false, email, password });
        if (result?.error) {
          setError(result.error);
        } else {
          // Redirect to a protected page or the login page
          router.push("/signin");
        }
      }
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
