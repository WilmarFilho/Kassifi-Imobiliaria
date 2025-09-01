// components/Header.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import { signOut } from "next-auth/react";

type HeaderProps = {
  variant?: boolean;
  admin?: boolean;
  onAddImovel?: () => void;
};

export default function Header({ variant = false, admin = false, onAddImovel }: HeaderProps) {
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
          <Image priority src={logoSrc} alt="Logo" width={210} height={120} />
        </Link>
      </div>

      {admin ? (
        <div className={styles.adminActions}>
          <button onClick={() => { signOut(); router.push("/"); }}>Encerrar Sessão</button>
          <button onClick={() => router.push("/")}>Voltar para Home</button>
          <button onClick={onAddImovel}>+ Adicionar Imóvel</button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </header>
  );
}
