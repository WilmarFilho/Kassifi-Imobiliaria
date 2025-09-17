import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Lightbox.module.css";

type Midia = {
  url: string;
  tipo: string; // "foto" | "video" | "capa"
};

type Props = {
  midias: Midia[];
  initialIndex: number;
  onClose: () => void;
  isOpen: boolean;
};

export default function Lightbox({ midias, initialIndex, onClose, isOpen }: Props) {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      if (initialIndex < 0 || initialIndex >= midias.length) {
        setCurrent(0);
      } else {
        setCurrent(initialIndex);
      }
    }
  }, [isOpen, initialIndex, midias.length]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [current, midias.length]);

  const prev = () => setCurrent((c) => (c === 0 ? midias.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === midias.length - 1 ? 0 : c + 1));

  if (!isOpen || midias.length === 0) return null;

  const midia = midias[current];
  if (!midia) return null;

  return (
    <div className={styles.overlay}>
      {/* Botão fechar */}
      <button onClick={onClose} className={styles.closeButton}>
        ✕
      </button>

      {/* Conteúdo */}
      <div className={styles.content}>
        {midia.tipo === "video" ? (
          <video src={midia.url} controls className={styles.video} />
        ) : (
          <Image
            src={midia.url}
            alt="midia"
            width={1000}
            height={700}
            className={styles.image}
          />
        )}
      </div>

      {/* Setas */}
      <button onClick={prev} className={`${styles.arrow} ${styles.arrowLeft}`}>
        &lt;
      </button>
      <button onClick={next} className={`${styles.arrow} ${styles.arrowRight}`}>
        &gt;
      </button>
    </div>
  );
}
