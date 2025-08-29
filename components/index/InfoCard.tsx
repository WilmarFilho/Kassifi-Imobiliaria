import Image from "next/image";
import styles from "./InfoCard.module.css";

interface InfoCardProps {
    icon: string;
    title: string;
    description: string;
}

export default function InfoCard({ icon, title, description }: InfoCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.iconWrapper}>
                <Image src={icon} alt={title} width={40} height={40} />
            </div>
            <div className={styles.textContent}> 
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>

        </div>
    );
}
