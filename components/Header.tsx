import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState } from "react";

type HeaderProps = {
  variant?: boolean;
  admin?: boolean;
  onAddImovel?: () => void;
};

export default function Header({ variant = false, admin = false, onAddImovel }: HeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Image priority src={logoSrc} alt="Logo" width={210} height={120} />
        </Link>
      </div>

      {admin ? (
        <div className={styles.adminActions}>
          <button
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            Encerrar Sessão
          </button>
          <button onClick={() => router.push("/")}>Voltar para Home</button>
          <button onClick={onAddImovel}>+ Adicionar Imóvel</button>
        </div>
      ) : (
        <>
          {/* NAV DESKTOP */}
          <nav className={styles.navDesktop}>
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

          {/* BOTÃO HEADER DESKTOP */}
          <button className={styles.buttonHeader}>
            <Link href="/fale-conosco">
              Fale Conosco {!variant && <Image src="/assets/arrow.svg" alt="arrow-icon" width={18} height={18} />}
            </Link>
          </button>

          {/* HAMBURGER MOBILE */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <Image src="/assets/list.svg" alt="Menu" width={24} height={24} />
          </button>

          {/* NAV MOBILE */}
          <nav
            className={`${styles.navMobile} ${variant ? styles.navMobileVariant : ""} ${
              menuOpen ? styles.show : ""
            }`}
          >
            {links.map((l) => {
              const isActive = router.pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`${styles.link} ${isActive ? styles.active : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </header>
  );
}


