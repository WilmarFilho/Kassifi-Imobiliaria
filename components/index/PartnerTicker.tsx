import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../../styles/Index.module.css";

const logos = [
  "/assets/city.webp",
  "/assets/dinamica.webp",
  "/assets/ebm.webp",
  "/assets/fgr.webp",
  "/assets/gpl.webp",
  "/assets/opus.webp",
];

export default function PartnerTicker() {
  return (
    <div className={styles.tickerWrapper}>
      <motion.div
        className={styles.tickerTrack}
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
