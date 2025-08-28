import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../styles/Index.module.css";

export default function HomePage() {
  return (
    <>
      <Header variant={false}/>
      <main className={styles.main}>
        <h1>Bem-vindo ao site</h1>
      </main>
      <Footer />
    </>
  );
}
