import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../../styles/Index.module.css";

const logos = [
  "/assets/opus.webp",
  "/assets/ebm.webp",
  "/assets/city.webp",
  "/assets/fgr.webp",
  "/assets/gpl.webp",
  "/assets/dinamica.webp",
];

export default function PartnerTicker() {
  return (
    <div className={styles.tickerWrapper}>
      <motion.div
        className={styles.tickerTrack}
        animate={{ x: ["0%", "-50%"] }} // só metade, pois duplicamos
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 16, // ajuste a velocidade
        }}
      >
        {/* dois blocos iguais, lado a lado */}
        {[0, 1].map((i) => (
          <div key={i} className={styles.tickerGroup}>
            {logos.map((logo, idx) => (
              <div key={idx} className={styles.logoItem}>
                <Image
                  src={logo}
                  alt={`Partner ${idx}`}
                  width={200}
                  height={80}
                  className={styles.partnerLogo}
                />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
