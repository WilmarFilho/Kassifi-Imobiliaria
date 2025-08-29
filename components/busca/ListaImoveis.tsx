// components/busca/ListaImoveis.tsx
import React from "react";
import type { Imovel } from "@/types/imovel";
import PropertyCard from "@/components/index/PropertyCard"; // ajuste o caminho se necessário
import styles from "./ListaImoveis.module.css";

type Props = {
  imoveis: Imovel[];
};

export default function ListaImoveis({ imoveis }: Props) {
  if (!imoveis || imoveis.length === 0) {
    return <div className={styles.wrapperListBusca}>Nenhum imóvel encontrado.</div>;
  }

  return (

    <div className={styles.wrapperListBusca}>

      <div className={styles.headerListBusca}>
        <h2>Busca de Imóveis</h2>
        <span>100 resultados</span>
      </div>

      <div className={styles.grid}>
        {imoveis.map((imovel) => (
          <PropertyCard
            key={imovel.id}
            busca={true}
            image="/assets/imovel/001.png"
            price={`R$ ${imovel.valor.toLocaleString("pt-BR")}`}
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
