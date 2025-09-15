import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../styles/Index.module.css";
import InfoCard from "@/components/index/InfoCard";
import Section from "@/components/index/Section";
import PropertyCard from "@/components/index/PropertyCard"
import Image from "next/image";
import Carousel from "@/components/index/Carousel";
import { prisma } from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { ImovelFront } from "@/types/imovel";
import CityCard from "@/components/index/CityCard";
import { useRouter } from "next/router";
import { useState } from "react";
import PartnerTicker from "@/components/index/PartnerTicker";

interface HomeProps {
  imoveisSerialized: ImovelFront[];
  countsByCity: Record<string, number>;
  countsByType: Record<string, number>;
}

export default function HomePage({ imoveisSerialized: imoveis, countsByCity, countsByType }: HomeProps) {
  const router = useRouter();

  const handleClickTipo = (tipo: string) => {
    router.push({ pathname: "/busca", query: { tipo } });
  };

  const handleClickCidade = (cidade: string) => {
    router.push({ pathname: "/busca", query: { cidade } });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const handleSearch = () => {
    router.push({
      pathname: "/busca",
      query: {
        q: searchQuery,
        tipo: selectedType,
      },
    });
  };


  // Filtrando imóveis para cada seção
  const naPlanta = imoveis.filter((i) => i.tipo === "Na Planta");
  const condominios = imoveis.filter((i) => i.tipo === "Condomínio");
  const apartamentos = imoveis.filter((i) => i.tipo === "Apartamento");
  const loteamentos = imoveis.filter((i) => i.tipo === "Loteamento");

  return (
    <>
      <Header variant={false} />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div>
            <h1>Escolha viver bem.</h1>
            <h2>Escolha Kassi.</h2>
          </div>

          {/* Barra de busca customizada */}
          <div className={styles.searchBar}>
            {/* Ícone à esquerda */}
            <div className={styles.searchIcon}>
              <Image src="/assets/search.svg" alt="Buscar" width={24} height={24} />
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Bairro ou endereço"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />

            {/* Ícone de filtro */}
            <div
              className={`${styles.filterIcon} ${selectedType ? styles.filterActive : ""}`}
              onClick={() => setShowFilter(!showFilter)}
            >
              <Image src="/assets/filter.svg" alt="Filtrar" width={24} height={24} />
            </div>



            {/* Botão de busca */}
            <button
              className={styles.searchButton}
              onClick={handleSearch}
            >
              <Image src="/assets/lupa.svg" alt="Buscar" width={20} height={20} />
            </button>
          </div>

          {/* Menu de filtros */}
          {showFilter && (
            <div className={styles.filterMenu}>
              {Object.keys(countsByType).map((tipo) => (
                <div
                  key={tipo}
                  onClick={() => {
                    setSelectedType(tipo);  // seleciona o tipo
                    setShowFilter(false);   // fecha o menu
                  }}
                  className={`${styles.filterItem} ${selectedType === tipo ? styles.selectedFilter : ""}`}
                >
                  {tipo}
                </div>
              ))}
            </div>
          )}
        </section>

        <Section title="Busca ágil e eficiente" subtitle="Apartamentos, casas, lotes, salas comerciais e outros." link="/busca">
          <div className={styles.CardsContainer}>
            <InfoCard icon="/assets/casas.svg" title="Casas" description={`${countsByType["Casa"] || 0} Propriedades`} onClick={() => handleClickTipo("Casa")} />
            <InfoCard icon="/assets/apart.svg" title="Apartamentos" description={`${countsByType["Apartamento"] || 0} Propriedades`} onClick={() => handleClickTipo("Apartamento")} />
            <InfoCard icon="/assets/condominio.svg" title="Condomínio" description={`${countsByType["Condomínio"] || 0} Propriedades`} onClick={() => handleClickTipo("Condomínio")} />
            <InfoCard icon="/assets/planta.svg" title="Na planta" description={`${countsByType["Na Planta"] || 0} Propriedades`} onClick={() => handleClickTipo("Na Planta")} />
            <InfoCard icon="/assets/loteamento.svg" title="Loteamento" description={`${countsByType["Loteamento"] || 0} Propriedades`} onClick={() => handleClickTipo("Loteamento")} />
            <InfoCard icon="/assets/comercial.svg" title="Salas Comerciais" description={`${countsByType["Sala Comercial"] || 0} Propriedades`} onClick={() => handleClickTipo("Sala Comercial")} />
          </div>
        </Section>

        {/* LANÇAMENTOS */}
        {naPlanta.length > 0 && (
          <Section title="Imóveis na planta" subtitle="Explore lançamentos exclusivos — sua chance de personalizar desde o início." link="/busca">
            <Carousel>
              {naPlanta.map((imovel) => (
                <PropertyCard
                  lancamento={imovel.lancamento}
                  key={imovel.id}
                  id={imovel.id}
                  image={imovel.midias?.find(m => m.tipo === "capa")?.url || ""}
                  price={`${imovel.valor.toLocaleString("pt-BR")}`}
                  title={imovel.nome}
                  location={`${imovel.endereco}, ${imovel.cidade} - ${imovel.estado}`}
                  quartos={imovel.quartos}
                  banheiros={imovel.banheiros}
                  area={`${imovel.metrosQuadrados} m²`}
                />
              ))}
            </Carousel>
          </Section>
        )}

        {/* CASAS EM CONDOMÍNIO */}
        {condominios.length > 0 && (
          <Section title="Casas em Condomínios" subtitle="Segurança, conforto e qualidade de vida em um só lugar." link="/busca">
            <Carousel>
              {condominios.map((imovel) => (
                <PropertyCard
                  lancamento={imovel.lancamento}
                  key={imovel.id}
                  id={imovel.id}
                  image={imovel.midias?.find(m => m.tipo === "capa")?.url || ""}
                  price={`${imovel.valor.toLocaleString("pt-BR")}`}
                  title={imovel.nome}
                  location={`${imovel.endereco}, ${imovel.cidade} - ${imovel.estado}`}
                  quartos={imovel.quartos}
                  banheiros={imovel.banheiros}
                  area={`${imovel.metrosQuadrados} m²`}
                />
              ))}
            </Carousel>
          </Section>
        )}

        {/* APARTAMENTOS */}
        {apartamentos.length > 0 && (
          <Section title="Apartamentos" subtitle="Já disponível, entre e comece a viver seu sonho hoje mesmo." link="/busca">
            <Carousel>
              {apartamentos.map((imovel) => (
                <PropertyCard
                  lancamento={imovel.lancamento}
                  key={imovel.id}
                  id={imovel.id}
                  image={imovel.midias?.find(m => m.tipo === "capa")?.url || ""}
                  price={`${imovel.valor.toLocaleString("pt-BR")}`}
                  title={imovel.nome}
                  location={`${imovel.endereco}, ${imovel.cidade} - ${imovel.estado}`}
                  quartos={imovel.quartos}
                  banheiros={imovel.banheiros}
                  area={`${imovel.metrosQuadrados} m²`}
                />
              ))}
            </Carousel>
          </Section>
        )}

        {/* LOTEAMENTOS */}
        {loteamentos.length > 0 && (
          <Section title="Loteamentos" subtitle="Terrenos com infraestrutura completa para construir seu futuro." link="/busca">
            <Carousel>
              {loteamentos.map((imovel) => (
                <PropertyCard
                  lancamento={imovel.lancamento}
                  key={imovel.id}
                  id={imovel.id}
                  image={imovel.midias?.find(m => m.tipo === "capa")?.url || ""}
                  price={`${imovel.valor.toLocaleString("pt-BR")}`}
                  title={imovel.nome}
                  location={`${imovel.endereco}, ${imovel.cidade} - ${imovel.estado}`}
                  quartos={imovel.quartos}
                  banheiros={imovel.banheiros}
                  area={`${imovel.metrosQuadrados} m²`}
                />
              ))}
            </Carousel>
          </Section>
        )}

        {/* Encontre imóveis por cidade */}

        <Section title="Encontre imóveis por cidade" subtitle="Selecione a cidade ideal e descubra imóveis que combinam com seu estilo de vida." link="/busca">
          <div className={styles.CardsContainer}>

            <CityCard
              image="/assets/goiania.webp"
              city="Goiânia"
              description={`${countsByCity["Goiânia"] ?? 0} Propriedades`}
              onClick={() => handleClickCidade("Goiânia")}
            />

            <CityCard
              image="/assets/apgoiania.webp"
              city="Ap. de Goiânia"
              description={`${countsByCity["Aparecida de Goiânia"] ?? 0} Propriedades`}
              onClick={() => handleClickCidade("Aparecida de Goiânia")}
            />

            <CityCard
              image="/assets/senador.webp"
              city="Senador Canedo"
              description={`${countsByCity["Senador Canedo"] ?? 0} Propriedades`}
              onClick={() => handleClickCidade("Senador Canedo")}
            />

            <CityCard
              image="/assets/goianira.webp"
              city="Goianira"
              description={`${countsByCity["Goianira"] ?? 0} Propriedades`}
              onClick={() => handleClickCidade("Goianira")}
            />

          </div>
        </Section>


        {/* Nossos parceiros */}
        <Section title="Nossos parceiros" subtitle="Contamos com a colaboração de grandes marcas para tornar seus sonhos realidade.">
          <PartnerTicker />
        </Section>
      </main>
      <Footer />
    </>
  );
}


// ------------------- getServerSideProps -------------------

export const getServerSideProps: GetServerSideProps = async () => {

  const imoveis = await prisma.imovel.findMany({
    include: { tags: { include: { tag: true } }, midias: true },
    orderBy: { criadoEm: "desc" },
    take: 50, // limite de performance
  });

  const imoveisSerialized: ImovelFront[] = imoveis.map((i) => ({
    id: i.id,
    tipo: i.tipo,
    nome: i.nome,
    lancamento: i.lancamento,
    valor: i.valor,
    cidade: i.cidade,
    estado: i.estado,
    endereco: i.endereco,
    quartos: i.quartos,
    banheiros: i.banheiros,
    vagas: i.vagas,
    metrosQuadrados: i.metrosQuadrados,
    descricao: i.descricao,
    criadoEm: i.criadoEm.toISOString(),
    tags: i.tags.map((t) => t.tag.id),
    midias: i.midias.map((m) => ({ url: m.url, tipo: m.tipo })),
  }));

  // 🔹 Contadores dinâmicos
  const countsByType: Record<string, number> = {};
  const countsByCity: Record<string, number> = {};

  for (const i of imoveisSerialized) {
    countsByType[i.tipo] = (countsByType[i.tipo] || 0) + 1;
    countsByCity[i.cidade] = (countsByCity[i.cidade] || 0) + 1;
  }

  return {
    props: {
      imoveisSerialized,
      countsByType,
      countsByCity,
    },
  };
};


