import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../styles/Index.module.css";

export default function Fale() {
  return (
    <>
      <Header variant={true}/>
      <main className={styles.main}>
        <h1>Bem-vindo ao fale conosco</h1>
      </main>
      <Footer />
    </>
  );
}
