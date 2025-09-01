import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/FaleConosco.module.css";
import Image from "next/image";

export default function Fale() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    const form = e.currentTarget; // Captura o form **antes** do await
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.nome || !data.email || !data.mensagem) {
      setErrorMsg("Preencha todos os campos!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Erro ao enviar mensagem");

      setSuccessMsg(result.message);

      form.reset(); // ✅ Aqui funciona porque form já foi capturado
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Ocorreu um erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header variant={true} />
      <main className={styles.main}>
        <section className={styles.wrapper}>
          <div className={styles.grid}>
            <div className={styles.formCard}>
              <h2 className={styles.title}>Fale conosco</h2>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label htmlFor="nome">Nome</label>
                  <input id="nome" name="nome" placeholder="Seu nome" />
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">E-mail</label>
                  <input id="email" name="email" type="email" placeholder="Seu e-mail" />
                </div>

                <div className={styles.field}>
                  <label htmlFor="mensagem">Mensagem</label>
                  <textarea id="mensagem" name="mensagem" placeholder="Digite sua mensagem" />
                </div>

                {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
                {successMsg && <p className={styles.successMsg}>{successMsg}</p>}

                <button type="submit" className={styles.button} disabled={loading}>
                  {loading ? "Enviando..." : "Enviar"}
                </button>
              </form>
            </div>

            {/* Coluna direita – informações + mapa */}
            <aside className={styles.infoCard}>
              <ul className={styles.infoList}>
                <li className={styles.infoItem}>
                  <span className={styles.icon}><Image src='/assets/pincontato.svg' alt='pincontato-icon' width={22} height={22} /></span>
                  <p>
                    Av. T–15, 225, Setor Bueno, Goiânia, Goiás
                    <br /> (Galeria Sérén)
                  </p>
                </li>
                <li className={styles.infoItem}>
                  <span className={styles.icon}> <Image src='/assets/whatscontato.svg' alt='whatscontato-icon' width={22} height={22} /></span>
                  <p>(62) 99828-7740</p>
                </li>
                <li className={styles.infoItem}>
                  <span className={styles.icon}> <Image src='/assets/email.svg' alt='email-icon' width={22} height={22} /></span>
                  <p>email@gmail.com</p>
                </li>
              </ul>

              <div className={styles.mapBox}>
                {/* Substitua a imagem pelo seu mapa real, se quiser use um iframe */}
                <Image
                  src="/assets/maps.webp"
                  alt="Localização no mapa"
                  fill
                  className={styles.mapImg}
                />
                <a
                  className={styles.mapButton}
                  href="https://maps.google.com/?q=Av.+T-15,+225,+Setor+Bueno,+Goi%C3%A2nia"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image src='/assets/pin.svg' alt='pincontato-icon' width={22} height={22} />  Localização
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


