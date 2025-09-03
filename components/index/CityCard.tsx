import Image from "next/image";
import styles from "./CityCard.module.css";

interface CityCardProps {
  image: string;
  city: string;
  description: string;
  onClick: () => void;
}

export default function CityCard({ image, city, description, onClick }: CityCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <Image src={image} alt={city} width={540} height={250} className={styles.bgImage} />
      <div className={styles.overlay}>
        <h3>{city}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
