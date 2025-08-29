import Image from "next/image";
import styles from "./PropertyCard.module.css";

interface PropertyCardProps {
    image: string;
    price: string | number;
    title: string;
    location: string;
    quartos: number;
    banheiros: number;
    area: string;
    id?: string;
    busca?: boolean;
}

export default function PropertyCard({ image, price, title, location, quartos, banheiros, area, id, busca = false }: PropertyCardProps) {
    return (
        <div className={ busca ? styles.cardBusca : styles.card}>
            <div className={styles.imageWrapper}>
                <Image src={image} alt={title} width={450} height={50} className={styles.imgImovel}/>
                <span className={styles.tag}> <Image src='/assets/raio.svg' alt='raio-icon' width={22} height={22} />  Lançamento</span>
                <p className={styles.price}>{price}</p>
            </div>
            <div className={styles.info}>
                <div className={styles.titleLocation}>
                    <h3>{title}</h3>
                    <p className={styles.location}>{location}</p>
                </div>
                <div className={styles.features}>
                    <p> <Image src='/assets/quarto.svg' alt='quarto-icon' width={22} height={22} />  {quartos} Quartos</p>
                    <p> <Image src='/assets/banheiro.svg' alt='banheiro-icon' width={22} height={22} />{banheiros} Banheiros</p>
                    <p> <Image src='/assets/metros.svg' alt='metros-icon' width={22} height={22} />{area}</p>
                </div>

                <div className={styles.footer}>
                    <p>{id}</p>

                    <Image src='/assets/go.svg' alt='go-icon' width={22} height={22} />
                </div>

            </div>
        </div>
    );
}
