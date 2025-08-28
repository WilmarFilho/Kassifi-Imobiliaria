import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../styles/Index.module.css";

export default function Sobre() {
  return (
    <>
      <Header variant={false}/>
      <main className={styles.main}>
        <h1>Bem-vindo a pagina sobre</h1>
      </main>
      <Footer />
    </>
  );
}
