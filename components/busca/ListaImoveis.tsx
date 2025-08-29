import React from "react";
import styles from "./ListaImoveis.module.css";
import PropertyCard from "../index/PropertyCard";

export type Imovel = {
  id: string;
  titulo: string;
  endereco: string;
  preco: number;
  quartos: number;
  suites: number;
  tamanho: number;
  imagem: string;
};

type Props = {
  imoveis: Imovel[];
};

const ListaImoveis: React.FC<Props> = ({ imoveis }) => {
  return (
   
      <div className={styles.wrapperListBusca}> 

        <div className={styles.headerListBusca}>
          <h2>Busca de Imóveis</h2>
          <span>100 resultados</span>
        </div>

        <div className={styles.grid}>
          {imoveis.map((imovel) => (
            <PropertyCard busca={true} key={imovel.id} image={"/assets/imovel/001.png"} price={imovel.preco} title={imovel.titulo} location={imovel.endereco} quartos={imovel.quartos} banheiros={0} area={""} />
          ))}
        </div>

      </div>


  );
};

export default ListaImoveis;