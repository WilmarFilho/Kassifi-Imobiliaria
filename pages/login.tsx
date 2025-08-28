import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {

    console.log(password)
   
    const res = await signIn("credentials", {
      redirect: false, 
      email,
      password
    });

    console.log(res);

    if (res?.error) {
      setError("Email ou senha inválidos");
      return;
    }

    if (res?.ok) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}