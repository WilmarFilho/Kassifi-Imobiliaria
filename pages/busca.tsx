import { useState, useCallback } from "react"; // Importe useCallback
import FiltroImoveis, { Filtros } from "@/components/busca/Filtro";
import ListaImoveis, { Imovel } from "@/components/busca/ListaImoveis";
import styles from "@/styles/Busca.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MOCK_IMOVEIS: Imovel[] = [
  { id: "1", titulo: "Opus Zoom", endereco: "Setor Marista - Goiânia/GO", preco: 2400000, quartos: 4, suites: 2, tamanho: 215, imagem: "/assets/imovel1.jpg" },
  { id: "2", titulo: "Infinity Towers", endereco: "Setor Bueno - Goiânia/GO", preco: 1800000, quartos: 3, suites: 2, tamanho: 180, imagem: "/assets/imovel2.jpg" },
  { id: "3", titulo: "Residencial Bela Vista", endereco: "Aparecida de Goiânia/GO", preco: 900000, quartos: 2, suites: 1, tamanho: 90, imagem: "/assets/imovel3.jpg" },
  { id: "4", titulo: "Residencial Bela Vista 2", endereco: "Aparecida de Goiânia/GO", preco: 950000, quartos: 2, suites: 1, tamanho: 95, imagem: "/assets/imovel3.jpg" },
  { id: "5", titulo: "Opus One", endereco: "Setor Oeste - Goiânia/GO", preco: 3000000, quartos: 4, suites: 3, tamanho: 250, imagem: "/assets/imovel1.jpg" },
  { id: "6", titulo: "Luxor Residence", endereco: "Setor Marista - Goiânia/GO", preco: 2000000, quartos: 3, suites: 2, tamanho: 190, imagem: "/assets/imovel2.jpg" },
  { id: "7", titulo: "City Living", endereco: "Aparecida de Goiânia/GO", preco: 850000, quartos: 2, suites: 1, tamanho: 85, imagem: "/assets/imovel3.jpg" },
  { id: "8", titulo: "Grand View", endereco: "Setor Bueno - Goiânia/GO", preco: 1500000, quartos: 3, suites: 2, tamanho: 170, imagem: "/assets/imovel1.jpg" },
  { id: "9", titulo: "Harmony Place", endereco: "Setor Oeste - Goiânia/GO", preco: 2800000, quartos: 4, suites: 3, tamanho: 230, imagem: "/assets/imovel2.jpg" },
  { id: "10", titulo: "Green Park", endereco: "Aparecida de Goiânia/GO", preco: 700000, quartos: 2, suites: 1, tamanho: 75, imagem: "/assets/imovel3.jpg" },
  { id: "11", titulo: "Metropolitan", endereco: "Setor Marista - Goiânia/GO", preco: 2600000, quartos: 4, suites: 2, tamanho: 220, imagem: "/assets/imovel1.jpg" },
  { id: "12", titulo: "Evolve Towers", endereco: "Setor Bueno - Goiânia/GO", preco: 1950000, quartos: 3, suites: 2, tamanho: 185, imagem: "/assets/imovel2.jpg" },
];

export default function BuscaPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>(MOCK_IMOVEIS);

  // Memorize a função filtrarImoveis com useCallback
  const filtrarImoveis = useCallback((filtros: Filtros) => {
    console.log("Filtros aplicados:", filtros);
    let lista = [...MOCK_IMOVEIS];

    if (filtros.endereco) {
        const enderecoLower = filtros.endereco.toLowerCase();
        lista = lista.filter(
            (i) =>
                i.endereco.toLowerCase().includes(enderecoLower) ||
                i.titulo.toLowerCase().includes(enderecoLower) ||
                i.id.toLowerCase().includes(enderecoLower)
        );
    }
    if (filtros.empreendimento) {
      lista = lista.filter((i) => i.titulo === filtros.empreendimento);
    }
    if (filtros.cidade) {
      lista = lista.filter((i) => i.endereco.includes(filtros.cidade!));
    }
    if (filtros.valorMax !== undefined && filtros.valorMax > 0) { // Verifica undefined também
      lista = lista.filter((i) => i.preco <= Number(filtros.valorMax));
    }
    if (filtros.valorMin !== undefined && filtros.valorMin > 0) { // Verifica undefined também
        lista = lista.filter((i) => i.preco >= Number(filtros.valorMin));
    }
    if (filtros.quartos) {
      lista = lista.filter((i) => i.quartos === Number(filtros.quartos));
    }
    if (filtros.suites) {
        lista = lista.filter((i) => i.suites === Number(filtros.suites));
    }
    if (filtros.tamanho) {
        lista = lista.filter((i) => i.tamanho >= Number(filtros.tamanho));
    }

    setImoveis(lista);
  }, []); // As dependências estão vazias porque MOCK_IMOVEIS é uma constante e setImoveis é estável.

  return (
    <>
      <Header variant={true} />
      <main className={styles.content}>
        <FiltroImoveis onFilter={filtrarImoveis} />
        <ListaImoveis imoveis={imoveis} />
      </main>
      <Footer />
    </>
  );
}