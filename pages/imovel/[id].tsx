import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Carousel from '@/components/index/Carousel';
import PropertyCard from '@/components/index/PropertyCard';
import Section from '@/components/index/Section';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { prisma } from '../../lib/prisma';
import styles from '@/styles/Imovel.module.css'
import { ImovelFront } from '@/types/imovel';

type Props = {
  imoveisSerialized: ImovelFront[];
  countsByType: Record<string, number>;
  countsByCity: Record<string, number>;
};

export default function Imovel({ imoveisSerialized }: Props) {
  const router = useRouter();
  const { id } = router.query;

  // Busca imóvel atual pelo ID
  const imovel = imoveisSerialized.find((i) => i.id === id);

  if (!imovel) {
    return <p>Imóvel não encontrado.</p>;
  }

  // Defina relacionados
  const relacionados = imoveisSerialized.filter(
    (i) => i.tipo === imovel.tipo && i.id !== imovel.id
  );

  return (
    <>

      <Header />

      {/* Hero com capa + galeria */}
      <section className={styles.hero}>
        {imovel.midias.filter((m) => m.tipo !== "capa").length >= 6 ? (
          <>
            <div className={styles.capa}>
              <Image
                src={imovel.midias.find((m) => m.tipo === "capa")?.url || "/assets/fallback.jpg"}
                alt={imovel.nome}
                width={800}
                height={500}
                className={styles.imgCapa}
              />
            </div>
            <div className={styles.galeria}>
              {imovel.midias
                .filter((m) => m.tipo !== "capa")
                .slice(0, 6) // garante no máximo 6
                .map((m, idx) => (
                  <div key={idx} className={styles.thumbWrapper}>
                    <Image
                      src={m.url}
                      alt={`midia-${idx}`}
                      width={250}
                      height={150}
                      className={styles.imgThumb}
                    />
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className={styles.capaFull}>
            <Image
              src={imovel.midias.find((m) => m.tipo === "capa")?.url || "/assets/fallback.jpg"}
              alt={imovel.nome}
              width={1200}
              height={600}
              className={styles.imgCapa}
            />
          </div>
        )}
      </section>


      <main className={styles.mainInternaImovel}>

        <div className={styles.content}>

          <div className={styles.boxLateral}>

            <div className={styles.rowCTA}>
              <h2>{imovel.nome}</h2>
              <button>
                Agende sua visita
                <Image
                  src="/assets/whats.svg"
                  alt="icon de whatsapp"
                  width={22}
                  height={22}
                />
              </button>
              <p>Para saber mais, temos corretores 24 horas de plantão prontos para te atender. </p>
            </div>

            <div className={styles.rowMapa}>
              <Image
                src="/assets/maps.webp"
                alt="Localização no mapa"
                width={400}
                height={200}
                className={styles.mapImg}
              />
              <a
                className={styles.mapButton}
                href="https://maps.google.com/?q=Av.+T-15,+225,+Setor+Bueno,+Goi%C3%A2nia"
                target="_blank"
                rel="noreferrer"
              >
                <Image src='/assets/pin.svg' alt='pincontato-icon' width={22} height={22} />  Localização
              </a>
            </div>


          </div>

          {/* Botões de ações */}
          <div className={styles.actions}>
            <button> <Image src="/assets/image.svg" alt="image-icon" width={22} height={22} /> Fotos</button>
            <button> <Image src="/assets/play.svg" alt="play-icon" width={22} height={22} /> Vídeos</button>
            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${encodeURIComponent(
                    `${imovel.endereco}, ${imovel.cidade} - ${imovel.estado}`
                  )}`,
                  '_blank'
                )
              }
            >
              <Image src="/assets/pin.svg" alt="quarto-icon" width={22} height={22} /> Localização
            </button>
          </div>

          {/* Infos básicas */}
          <div className={styles.info}>
            <h1>{imovel.nome}</h1>
            <p>{`${imovel.endereco}, ${imovel.cidade} - ${imovel.estado}`}</p>
            <small>
              Publicado em {new Date(imovel.criadoEm).toLocaleDateString()} | ID: {imovel.id.slice(0, 8)}
            </small>
          </div>

          <div className={styles.features}>
            <p>
              <Image src="/assets/quarto.svg" alt="quarto-icon" width={22} height={22} />
              {imovel.quartos} Quartos
            </p>
            <p>
              <Image src="/assets/banheiro.svg" alt="banheiro-icon" width={22} height={22} />
              {imovel.banheiros} Banheiros
            </p>
            <p>
              <Image src="/assets/metros.svg" alt="metros-icon" width={22} height={22} />
              {imovel.metrosQuadrados} m²
            </p>
            <p>
              <Image src="/assets/garage.svg" alt="garage-icon" width={32} height={32} />
              {imovel.vagas} Vagas
            </p>
          </div>

          {/* Descrição */}
          <div className={styles.descricao}>
            <h2>Descrição do imóvel</h2>
            <p>{imovel.descricao}</p>
          </div>

          {/* Tags */}
          <div className={styles.tags}>
            <h2>Informações adicionais</h2>
            <div className={styles.wrapperTags}>
              {imovel.tags.map((tag) => (
                <button key={tag} className={styles.tagButton}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lançamentos */}
        <Section title={'Imóveis recentes'} subtitle={''} link={'/busca'}>
          <Carousel>
            {imoveisSerialized
              .filter((i) => i.lancamento)
              .map((imovel) => (
                <PropertyCard
                  lancamento={imovel.lancamento}
                  key={imovel.id}
                  id={imovel.id}
                  image={imovel.midias?.find((m) => m.tipo === 'capa')?.url || ''}
                  price={`${imovel.valor.toLocaleString('pt-BR')}`}
                  title={imovel.nome}
                  location={`${imovel.endereco}, ${imovel.cidade} - ${imovel.estado}`}
                  quartos={imovel.quartos}
                  banheiros={imovel.banheiros}
                  area={`${imovel.metrosQuadrados} m²`}
                />
              ))}
          </Carousel>
        </Section>

        {/* Relacionados */}
        {relacionados.length > 0 && (
          <Section title={'Imóveis relacionados'} subtitle={''} link={'/busca'}>
            <Carousel>
              {relacionados.map((imovel) => (
                <PropertyCard
                  lancamento={imovel.lancamento}
                  key={imovel.id}
                  id={imovel.id}
                  image={imovel.midias?.find((m) => m.tipo === 'capa')?.url || ''}
                  price={`${imovel.valor.toLocaleString('pt-BR')}`}
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

      </main>

      <Footer />

    </>
  );
}

// ------------------- getServerSideProps -------------------

export const getServerSideProps: GetServerSideProps = async () => {
  const imoveis = await prisma.imovel.findMany({
    include: { tags: { include: { tag: true } }, midias: true },
    orderBy: { criadoEm: 'desc' },
    take: 50,
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
    tags: i.tags.map((t) => t.tag.nome), // aqui já mando o nome direto
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