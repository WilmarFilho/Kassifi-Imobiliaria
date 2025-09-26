/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  // Ajusta o índice ao abrir
  useEffect(() => {
    if (isOpen) {
      if (initialIndex < 0 || initialIndex >= midias.length) {
        setCurrent(0);
      } else {
        setCurrent(initialIndex);
      }
    }
  }, [isOpen, initialIndex, midias.length]);

  // Keyboard navigation
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

  // Pré-carregar imagem anterior e próxima
  useEffect(() => {
    const preload = [
      midias[(current + 1) % midias.length],
      midias[(current - 1 + midias.length) % midias.length]
    ];
    preload.forEach((m) => {
      if (m?.tipo === "foto") {
        const img = new window.Image() as HTMLImageElement; // <- aqui
        img.src = m.url;
      }
    });
  }, [current, midias]);


  if (!isOpen || midias.length === 0) return null;

  const midia = midias[current];
  if (!midia) return null;

  return (
    <div className={styles.overlay}>
      <button onClick={onClose} className={styles.closeButton}>✕</button>

      <div className={styles.content}>
        {midia.tipo === "video" ? (
          <video src={midia.url} controls className={styles.video} />
        ) : (
          <>
            {isLoading && <div className={styles.loader}></div>}
            <img
              key={midia.url}
              src={midia.url}
              alt="midia"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
                display: isLoading ? "none" : "block"
              }}
              onLoad={() => setIsLoading(false)}
            />
          </>
        )}
      </div>

      <button onClick={prev} className={`${styles.arrow} ${styles.arrowLeft}`}>&lt;</button>
      <button onClick={next} className={`${styles.arrow} ${styles.arrowRight}`}>&gt;</button>
    </div>
  );
}
