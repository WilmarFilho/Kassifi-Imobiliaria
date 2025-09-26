import React from "react";
import type { ImovelFront } from "@/types/imovel";
import PropertyCard from "@/components/index/PropertyCard";
import styles from "./ListaImoveis.module.css";

type Props = {
  imoveis: ImovelFront[];
};

export default function ListaImoveis({ imoveis }: Props) {
  if (!imoveis || imoveis.length === 0) {
    return <div className={styles.wrapperListBusca}>Nenhum imóvel encontrado.</div>;
  }

  return (

    <div className={styles.wrapperListBusca}>

      <div className={styles.headerListBusca}>
        <h2>Busca de Imóveis</h2>
        <span>{imoveis.length} resultados</span>
      </div>

      <div className={styles.grid}>
        {imoveis.map((imovel) => (
          <PropertyCard
            id={imovel.id}
            lancamento={imovel.lancamento}
            key={imovel.id}
            busca={true}
            image={imovel.midias?.find(m => m.tipo === "capa")?.url || ""}
            price={`R$ ${imovel.valor}`}
            title={imovel.nome}
            location={`${imovel.endereco}, ${imovel.cidade} - ${imovel.estado}`}
            quartos={imovel.quartos}
            banheiros={imovel.banheiros}
            area={`${imovel.metrosQuadrados} m²`}
          />
        ))}
      </div>

    </div>

  );
}