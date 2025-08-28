import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../styles/Index.module.css";

export default function Busca() {
  return (
    <>
      <Header variant={true}/>
      <main className={styles.main}>
        <h1>Bem-vindo a busca</h1>
      </main>
      <Footer />
    </>
  );
}



