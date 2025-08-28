import { GetServerSideProps } from "next";
import Image from "next/image";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/Login.module.css";

// Página de login
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Email ou senha inválidos.");
        return;
      }

      if (res?.ok) {
        await router.push("/admin/dashboard");
      }
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <Image src="/assets/logo.svg" alt="Logo" width={210} height={120} />
        </div>

        <p className={styles.subtitle}>Faça login para acessar o dashboard</p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.formGroup}>
          <div>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              disabled={loading}
            />
          </div>

          <button onClick={handleLogin} className={styles.button} disabled={loading}>
            {loading && <span className={styles.spinner} />}
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Redireciona se já estiver autenticado
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      },
    };
  }

  return { props: {} };
};


