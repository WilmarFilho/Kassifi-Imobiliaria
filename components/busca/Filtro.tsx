import React, { useState, useEffect } from "react";
import styles from "./Filtro.module.css";

export type Filtros = {
  endereco?: string;
  empreendimento?: string;
  cidade?: string;
  valorMin?: number;
  valorMax?: number;
  quartos?: number;
  suites?: number;
  tamanho?: number;
};

type Props = {
  onFilter: (filtros: Filtros) => void;
};

const FiltroImoveis: React.FC<Props> = ({ onFilter }) => {
  const [filtros, setFiltros] = useState<Filtros>({
    valorMin: 0,
    valorMax: 5000000,
  });

  // Usamos useEffect para chamar onFilter sempre que os filtros mudarem
  useEffect(() => {
    onFilter(filtros);
  }, [filtros, onFilter]); // onFilter é uma dependência para garantir que a função seja a mais recente

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      [name]: value,
    }));
  };

  const limparFiltros = () => {
    setFiltros({ valorMin: 0, valorMax: 5000000 });
    // onFilter será chamado automaticamente pelo useEffect após a atualização de filtros
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Filtros</h3>
      <input
        name="endereco"
        placeholder="Código, bairro ou endereço"
        value={filtros.endereco || ""}
        onChange={handleChange}
        className={styles.input}
      />
      <select name="empreendimento" onChange={handleChange} value={filtros.empreendimento || ""}>
        <option value="">Empreendimento</option>
        <option value="Opus Zoom">Opus Zoom</option>
        <option value="Infinity">Infinity</option>
      </select>
      <select name="cidade" onChange={handleChange} value={filtros.cidade || ""}>
        <option value="">Selecione a cidade</option>
        <option value="Goiânia">Goiânia</option>
        <option value="Aparecida">Aparecida</option>
      </select>
      <label className={styles.label}>Valor até</label>
      <input
        type="range"
        min="0"
        max="5000000"
        step="100000"
        name="valorMax"
        value={filtros.valorMax}
        onChange={handleChange}
      />
      <span className={styles.rangeValue}>R$ {Number(filtros.valorMax).toLocaleString()}</span>
      <select name="quartos" onChange={handleChange} value={filtros.quartos || ""}>
        <option value="">Quartos</option>
        <option value="2">2 quartos</option>
        <option value="3">3 quartos</option>
        <option value="4">4 quartos</option>
      </select>
      <select name="suites" onChange={handleChange} value={filtros.suites || ""}>
        <option value="">Suítes</option>
        <option value="1">1 suíte</option>
        <option value="2">2 suítes</option>
        <option value="3">3 suítes</option>
      </select>
      <div className={styles.buttons}>
        <button onClick={limparFiltros} className={styles.clearBtn}>
          Limpar filtros
        </button>
      </div>
    </aside>
  );
};

export default FiltroImoveis;