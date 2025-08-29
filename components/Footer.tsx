import styles from "../styles/Footer.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.topSection}>

        <div className={styles.columnTopSection}>
          <div>
            <Link href="/">
              <Image src="/assets/logovariantfooter.svg" alt="Logo" width={210} height={120} />
            </Link>
          </div>

         <div className={styles.columnTopSection}>
            <ul className={styles.list}>
              <li> <Image src="/assets/pin.svg" alt="pin-icon" width={20} height={20} />  Av. T-15, 225, Setor Bueno, Goiânia, Goiás (Galeria Séren)</li>
              <li> <Image src="/assets/whats.svg" alt="pin-icon" width={18} height={18} /> (62) 99828-7740</li>
            </ul>
          </div>
        </div>


        <div className={styles.columnSmallTopSection}>
          <span>Siga nossas redes</span>
        </div>

      </section>

      <section className={styles.bottomSection}>

        <p>
          © 2025 Todos os direitos reservados. Desenvolvido por Conexão Soluções Corporativas
        </p>

        <Link href="/">
          Política de privacidade
        </Link>

        <Link href="/">
          Termos de uso
        </Link>

        <p>
          Kassif Imóveis CRECI-GO 0000
        </p>

      </section>
    </footer>
  );
}
