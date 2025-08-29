import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../styles/Index.module.css";
import InfoCard from "@/components/index/InfoCard";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <Header variant={false} />
      <main className={styles.main}>
        <section className={styles.heroSection}>

          <h1>Escolha viver bem.</h1>
          <h2>Escolha Kassi.</h2>

        </section>

        <section className={styles.buscaSection}>

          <div className={styles.buscaContent}>
            <div className={styles.textBusca}>
              <h2 className={styles.titleBusca}>Busca ágil e eficiente</h2>
              <p className={styles.descriptionBusca}>Apartamentos, casas, lotes, salas comerciais e outros.</p>
            </div>
            <div className={styles.buttonBusca}>
              <Link href="/">Todos <Image src="/assets/arrow.svg" alt="arrow-icon" width={18} height={18} /> </Link>
            </div>
          </div>

          <div className={styles.infoCardContainer}>
            <InfoCard icon={"/assets/casas.svg"} title={"Casas"} description={"+50 Propriedades"} />
            <InfoCard icon={"/assets/apart.svg"} title={"Apartamentos"} description={"+50 Propriedades"} />
            <InfoCard icon={"/assets/condominio.svg"} title={"Condomínio"} description={"+50 Propriedades"} />
            <InfoCard icon={"/assets/planta.svg"} title={"Na planta"} description={"+50 Propriedades"} />
            <InfoCard icon={"/assets/loteamento.svg"} title={"Loteamento"} description={"+50 Propriedades"} />
            <InfoCard icon={"/assets/comercial.svg"} title={"Salas Comerciais"} description={"+50 Propriedades"} />
          </div>

        </section>

         <section className={styles.buscaSection}>

          <div className={styles.buscaContent}>
            <div className={styles.textBusca}>
              <h2 className={styles.titleBusca}>Nossos parceiros</h2>
              <p className={styles.descriptionBusca}>Contamos com a colaboração de grandes marcas para tornar seus sonhos realidade.</p>
            </div>
            
          </div>

          <div className={styles.parceirosCardContainer}>
            <Image src="/assets/opus.webp" alt="Partner 1" width={150} height={80}  className={styles.partnerLogo} />
            <Image src="/assets/ebm.webp" alt="Partner 2" width={150} height={80}  className={styles.partnerLogo} />
            <Image src="/assets/city.webp" alt="Partner 3" width={150} height={80}  className={styles.partnerLogo} />
            <Image src="/assets/fgr.webp" alt="Partner 4" width={150} height={80}  className={styles.partnerLogo} />
            <Image src="/assets/gpl.webp" alt="Partner 5" width={150} height={80}   className={styles.partnerLogo}/>
            <Image src="/assets/dinamica.webp" alt="Partner 6" width={150} height={80}  className={styles.partnerLogo} />
          </div>

        </section>

      </main>
      <Footer />
    </>
  );
}


