import Image from "next/image";
import { useRef } from "react";
import styles from "./Carousel.module.css";

interface CarouselProps {
  children: React.ReactNode;
}

export default function Carousel({ children }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 500; // pixels
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.carouselWrapper}>
      <button className={styles.arrowLeft} onClick={() => scroll("left")}>
        <Image src="/assets/Chevron.svg" alt="Left Arrow" width={20} height={20} />
      </button>
      <div className={styles.carousel} ref={containerRef}>
        {children}
      </div>
      <button className={styles.arrowRight} onClick={() => scroll("right")}>
        <Image src="/assets/Chevron.svg" alt="Left Arrow" width={20} height={20} />
      </button>
    </div>
  );
}
