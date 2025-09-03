import Link from "next/link";
import Image from "next/image";
import styles from "./Section.module.css";

interface SectionProps {
    title: string;
    subtitle?: string;
    link?: string;
    children: React.ReactNode;
}

export default function Section({ title, subtitle, link, children }: SectionProps) {
    return (
        <section className={styles.section}>

            <div className={styles.header}>
                <div className={styles.texts}>
                    <h2 className={styles.title}>{title}</h2>
                    {subtitle && <p className={styles.description}>{subtitle}</p>}
                </div>
                {link && (
                    <div className={styles.button}>
                        <Link href={link}>Todos <Image src="/assets/arrow.svg" alt="arrow-icon" width={18} height={18} /> </Link>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                {children}
            </div>

        </section>
    );
}
