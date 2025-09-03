import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./PropertyCard.module.css";

interface PropertyCardProps {
    image: string;
    price: string | number;
    title: string;
    location: string;
    quartos: number;
    banheiros: number;
    lancamento?: boolean;
    area: string;
    id?: string;
    busca?: boolean;
    isAdmin?: boolean;
    onGoClick?: (id?: string) => void;
    onDeleteClick?: (id?: string) => void;
}

export default function PropertyCard({
    image,
    price,
    title,
    location,
    quartos,
    banheiros,
    area,
    id,
    lancamento = false,
    busca = false,
    isAdmin = false,
    onGoClick,
    onDeleteClick,
}: PropertyCardProps) {
    const router = useRouter();

    const handleGoClick = (e?: React.MouseEvent) => {

        e?.stopPropagation();

        if (onGoClick) {
            onGoClick(id);
        } else if (id) {
            router.push(`/imovel/${id}`);
        }
    };

    return (
        <div
            className={`${busca ? styles.cardBusca : styles.card} ${isAdmin ? styles.admin : ""
                }`}
            onClick={() => handleGoClick()}
        >
            <div className={styles.imageWrapper}>
                <Image
                    src={image}
                    priority
                    alt={title}
                    width={450}
                    height={50}
                    className={styles.imgImovel}
                />

                {lancamento && (
                    <span className={styles.tag}>
                        <Image src="/assets/raio.svg" alt="raio-icon" width={22} height={22} />
                        Lançamento
                    </span>
                )}

                <p className={styles.price}>{price} R$</p>
            </div>
            <div className={styles.info}>
                <div className={styles.titleLocation}>
                    <h3>{title}</h3>
                    <p className={styles.location}>{location}</p>
                </div>
                <div className={styles.features}>
                    <p>
                        <Image src="/assets/quarto.svg" alt="quarto-icon" width={22} height={22} />
                        {quartos} Quartos
                    </p>
                    <p>
                        <Image
                            src="/assets/banheiro.svg"
                            alt="banheiro-icon"
                            width={22}
                            height={22}
                        />
                        {banheiros} Banheiros
                    </p>
                    <p>
                        <Image src="/assets/metros.svg" alt="metros-icon" width={22} height={22} />
                        {area}
                    </p>
                </div>

                <div className={styles.footer}>
                    <p>{id?.slice(0, 8)}</p>

                    <div className={styles.actions}>
                        <Image
                            src="/assets/go.svg"
                            alt="go-icon"
                            width={22}
                            height={22}
                            className={styles.iconButton}
                            onClick={handleGoClick}
                        />

                        {isAdmin && (
                            <Image
                                src="/assets/trash.svg"
                                alt="delete-icon"
                                width={27}
                                height={27}
                                className={styles.iconButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteClick?.(id);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
