import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../styles/Sobre.module.css";

export default function Sobre() {
  return (
    <>
      <Header variant={true} />
      <main className={styles.mainSobre}>
        <div className={styles.textSobreWrapper}>
          <h1 className={styles.titleSobre}>Sobre a Kassif Imóveis</h1>
          <div className={styles.contentSobre}>
            <p>Na Kassif Imóveis, acreditamos que cada imóvel carrega um sonho, um projeto de vida. </p>
            <p>Atuamos no mercado imobiliário de Goiânia com transparência, compromisso e excelência, oferecendo soluções completas para compra, venda e locação. Nosso objetivo é conectar pessoas aos melhores imóveis, com atendimento personalizado e seguro, para que cada negociação seja uma experiência tranquila e satisfatória.</p>
          </div>
        </div>

        <div className={styles.bannerSobreWrapper}>
          <Image
            src="/assets/01.webp"
            alt="banner-pagina-sobre"
            width={1600}             // dimensão base para cálculo de proporção
            height={300}
            className={styles.bannerSobre}
            priority
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
