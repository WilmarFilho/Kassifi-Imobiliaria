import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../../styles/Index.module.css";

const logos = [
  "/assets/bambui.webp",
  "/assets/binc.webp",
  "/assets/brasal.webp",
  "/assets/city.webp",
  "/assets/cmo.webp",
];

const logosRow = [
  "/assets/consciente.webp",
  "/assets/dinamica.webp",
  "/assets/ebm.webp",
  "/assets/euro.webp",
  "/assets/fgr.webp",
];

const logosRow2 = [
  "/assets/flamboyant.webp",
  "/assets/fr.webp",
  "/assets/gpl.webp",
  "/assets/mzn.webp",
  "/assets/om.webp",
];

const logosRow3 = [
  "/assets/opus.webp",
  "/assets/palme.webp",
  "/assets/partini.webp",
  "/assets/somos.webp",
  "/assets/seren.webp",
  "/assets/sim.webp",
];

const logosRow4 = [
  "/assets/souza.webp",
  "/assets/tapajos.webp",
  "/assets/terral.webp",
  "/assets/wv.webp",
];

export default function PartnerTicker() {
  return (<>
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

    <div className={styles.tickerWrapper}>
      <motion.div
        className={styles.tickerTrack}
      >
        {/* dois blocos iguais, lado a lado */}
        {[0, 1].map((i) => (
          <div key={i} className={styles.tickerGroup}>
            {logosRow.map((logo, idx) => (
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

    <div className={styles.tickerWrapper}>
      <motion.div
        className={styles.tickerTrack}
      >
        {/* dois blocos iguais, lado a lado */}
        {[0, 1].map((i) => (
          <div key={i} className={styles.tickerGroup}>
            {logosRow2.map((logo, idx) => (
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

    <div className={styles.tickerWrapper}>
      <motion.div
        className={styles.tickerTrack}
      >
        {/* dois blocos iguais, lado a lado */}
        {[0, 1].map((i) => (
          <div key={i} className={styles.tickerGroup}>
            {logosRow3.map((logo, idx) => (
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

    <div className={styles.tickerWrapper}>
      <motion.div
        className={styles.tickerTrack}
      >
        {/* dois blocos iguais, lado a lado */}
        {[0, 1].map((i) => (
          <div key={i} className={styles.tickerGroup}>
            {logosRow4.map((logo, idx) => (
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
  </>
  );
}
