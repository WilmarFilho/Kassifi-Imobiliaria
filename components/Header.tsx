import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";
import Image from "next/image";

export default function Header({ variant = false }: { variant?: boolean }) {
  const router = useRouter();
  const headerClass = `${styles.header} ${variant ? styles.headerVariant : ""}`.trim();

  const logoSrc = variant ? "/assets/logovariant.svg" : "/assets/logo.svg";

  const links = [
    { href: "/", label: "Início" },
    { href: "/busca", label: "Buscar Imóveis" },
    { href: "/fale-conosco", label: "Fale Conosco" },
    { href: "/sobre", label: "Sobre" },
  ];

  return (
    <header className={headerClass}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src={logoSrc} alt="Logo" width={210} height={120} />
        </Link>
      </div>

      <nav className={styles.nav}>
        {links.map((l) => {
          const isActive = router.pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <button className={styles.buttonHeader}>
        <Link href="/">Fale Conosco <Image src="/assets/arrow.svg" alt="arrow-icon" width={18} height={18} /> </Link>
      </button>
    </header>
  );
}
