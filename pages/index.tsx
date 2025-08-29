import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../styles/Index.module.css";
import InfoCard from "@/components/index/InfoCard";
import Image from "next/image";
import Section from "@/components/index/Section";
import CityCard from "@/components/index/CityCard";
import PropertyCard from "@/components/index/PropertyCard";
import Carousel from "@/components/index/Carousel";

export default function HomePage() {
  return (
    <>
      <Header variant={false} />
      <main className={styles.main}>

        <section className={styles.heroSection}>

          <h1>Escolha viver bem.</h1>
          <h2>Escolha Kassi.</h2>

        </section>

        <Section title={"Busca ágil e eficiente"} subtitle={"Apartamentos, casas, lotes, salas comerciais e outros."} link={"/busca"}  >
          <div className={styles.CardsContainer}>
            <InfoCard icon={"/assets/casas.svg"} title={"Casas"} description={"+50 Propriedades"} />
            <InfoCard icon={"/assets/apart.svg"} title={"Apartamentos"} description={"+50 Propriedades"} />
            <InfoCard icon={"/assets/condominio.svg"} title={"Condomínio"} description={"+50 Propriedades"} />
            <InfoCard icon={"/assets/planta.svg"} title={"Na planta"} description={"+50 Propriedades"} />
            <InfoCard icon={"/assets/loteamento.svg"} title={"Loteamento"} description={"+50 Propriedades"} />
            <InfoCard icon={"/assets/comercial.svg"} title={"Salas Comerciais"} description={"+50 Propriedades"} />
          </div>
        </Section>

        <Section title={"Imóveis na planta"} subtitle={"Explore lançamentos exclusivos — sua chance de personalizar desde o início."} link={"/busca"}  >
          <Carousel>
            <PropertyCard image="/assets/imovel/001.png" price="R$ 350.000,00" title="Apartamento no Setor Bueno" location="Setor Bueno, Goiânia - GO" quartos={3} banheiros={2} area="85m²" id="KF0000-0" />
            <PropertyCard image="/assets/imovel/002.png" price="R$ 420.000,00" title="Apartamento no Marista" location="Setor Marista, Goiânia - GO" quartos={4} banheiros={3} area="120m²" id="KF0000-1" />
            <PropertyCard image="/assets/imovel/003.png" price="R$ 280.000,00" title="Apartamento no Oeste" location="Setor Oeste, Goiânia - GO" quartos={2} banheiros={1} area="70m²" id="KF0000-2" />
            <PropertyCard image="/assets/imovel/004.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
            <PropertyCard image="/assets/imovel/005.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
            <PropertyCard image="/assets/imovel/001.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
          </Carousel>
        </Section>

        <Section title={"Casas em Condomínios"} subtitle={"Segurança, conforto e qualidade de vida em um só lugar."} link={"/busca"}  >
          <Carousel>
            <PropertyCard image="/assets/imovel/001.png" price="R$ 350.000,00" title="Apartamento no Setor Bueno" location="Setor Bueno, Goiânia - GO" quartos={3} banheiros={2} area="85m²" id="KF0000-0" />
            <PropertyCard image="/assets/imovel/002.png" price="R$ 420.000,00" title="Apartamento no Marista" location="Setor Marista, Goiânia - GO" quartos={4} banheiros={3} area="120m²" id="KF0000-1" />
            <PropertyCard image="/assets/imovel/003.png" price="R$ 280.000,00" title="Apartamento no Oeste" location="Setor Oeste, Goiânia - GO" quartos={2} banheiros={1} area="70m²" id="KF0000-2" />
            <PropertyCard image="/assets/imovel/004.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
            <PropertyCard image="/assets/imovel/005.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
            <PropertyCard image="/assets/imovel/001.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
          </Carousel>
        </Section>

        <Section title={"Apartamentos"} subtitle={"Já disponível, entre e comece a viver seu sonho hoje mesmo."} link={"/busca"}  >
          <Carousel>
            <PropertyCard image="/assets/imovel/001.png" price="R$ 350.000,00" title="Apartamento no Setor Bueno" location="Setor Bueno, Goiânia - GO" quartos={3} banheiros={2} area="85m²" id="KF0000-0" />
            <PropertyCard image="/assets/imovel/002.png" price="R$ 420.000,00" title="Apartamento no Marista" location="Setor Marista, Goiânia - GO" quartos={4} banheiros={3} area="120m²" id="KF0000-1" />
            <PropertyCard image="/assets/imovel/003.png" price="R$ 280.000,00" title="Apartamento no Oeste" location="Setor Oeste, Goiânia - GO" quartos={2} banheiros={1} area="70m²" id="KF0000-2" />
            <PropertyCard image="/assets/imovel/004.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
            <PropertyCard image="/assets/imovel/005.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
            <PropertyCard image="/assets/imovel/001.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
          </Carousel>
        </Section>

        <Section title={"Loteamentos"} subtitle={"Terrenos com infraestrutura completa para construir seu futuro."} link={"/busca"}  >
          <Carousel>
            <PropertyCard image="/assets/imovel/001.png" price="R$ 350.000,00" title="Apartamento no Setor Bueno" location="Setor Bueno, Goiânia - GO" quartos={3} banheiros={2} area="85m²" id="KF0000-0" />
            <PropertyCard image="/assets/imovel/002.png" price="R$ 420.000,00" title="Apartamento no Marista" location="Setor Marista, Goiânia - GO" quartos={4} banheiros={3} area="120m²" id="KF0000-1" />
            <PropertyCard image="/assets/imovel/003.png" price="R$ 280.000,00" title="Apartamento no Oeste" location="Setor Oeste, Goiânia - GO" quartos={2} banheiros={1} area="70m²" id="KF0000-2" />
            <PropertyCard image="/assets/imovel/004.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
            <PropertyCard image="/assets/imovel/005.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
            <PropertyCard image="/assets/imovel/001.png" price="R$ 500.000,00" title="Cobertura no Bueno" location="Setor Bueno, Goiânia - GO" quartos={4} banheiros={3} area="150m²" id="KF0000-3" />
          </Carousel>
        </Section>

        <Section title={"Encontre imóveis por cidade"} subtitle={"Selecione a cidade ideal e descubra imóveis que combinam com seu estilo de vida."} link="/busca">
          <div className={styles.CardsContainer}>
            <CityCard image={"/assets/goiania.webp"} city={"Goiânia"} description={"+100 Propriedades"} />
            <CityCard image={"/assets/apgoiania.webp"} city={"Ap. de Goiânia"} description={"+100 Propriedades"} />
            <CityCard image={"/assets/senador.webp"} city={"Senador Canedo"} description={"+100 Propriedades"} />
            <CityCard image={"/assets/goianira.webp"} city={"Goianira"} description={"+50 Propriedades"} />
          </div>
        </Section>

        <Section title={"Nossos parceiros"} subtitle={"Contamos com a colaboração de grandes marcas para tornar seus sonhos realidade."}>
          <div className={styles.CardsContainer}>
            <Image src="/assets/opus.webp" alt="Partner 1" width={150} height={80} className={styles.partnerLogo} />
            <Image src="/assets/ebm.webp" alt="Partner 2" width={150} height={80} className={styles.partnerLogo} />
            <Image src="/assets/city.webp" alt="Partner 3" width={150} height={80} className={styles.partnerLogo} />
            <Image src="/assets/fgr.webp" alt="Partner 4" width={150} height={80} className={styles.partnerLogo} />
            <Image src="/assets/gpl.webp" alt="Partner 5" width={150} height={80} className={styles.partnerLogo} />
            <Image src="/assets/dinamica.webp" alt="Partner 6" width={150} height={80} className={styles.partnerLogo} />
          </div>
        </Section>

      </main>
      <Footer />
    </>
  );
}


