import React, { useEffect, useState } from "react";
import type { Filtros } from "@/types/imovel";
import styles from "./Filtro.module.css";
import CustomCheckbox from "./CustomCheckbox";

interface Tag {
  id: string;
  nome: string;
}

type Props = {
  onFilterChange: (filtros: Filtros) => void;
  tags: Tag[];
};

export default function FiltroImoveis({ onFilterChange, tags }: Props) {
  const [filtros, setFiltros] = useState<Filtros>({
    valorMin: undefined,
    valorMax: undefined,
    metrosMin: undefined,
    metrosMax: undefined,
    tags: []
  });

  useEffect(() => {
    onFilterChange(filtros);
  }, [filtros, onFilterChange]);

  function setField<K extends keyof Filtros>(field: K, value: Filtros[K]) {
    setFiltros(prev => ({ ...prev, [field]: value }));
  }

  function toggleTag(tag: string) {
    setFiltros(prev => {
      const tags = prev.tags ?? [];
      const exists = tags.some(t => t.toLowerCase() === tag.toLowerCase());
      return {
        ...prev,
        tags: exists
          ? tags.filter(t => t.toLowerCase() !== tag.toLowerCase())
          : [...tags, tag]
      };
    });
  }

  function limpar() {
    setFiltros({
      tipo: undefined,
      nome: undefined,
      endereco: undefined,
      cidade: undefined,
      estado: undefined,
      valorMin: undefined,
      valorMax: undefined,
      quartos: undefined,
      banheiros: undefined,
      vagas: undefined,
      metrosMin: undefined,
      metrosMax: undefined,
      lancamento: undefined,
      tags: []
    });
  }

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Filtros</h3>

      <label className={styles.field}>
        <select
          className={styles.input}
          value={filtros.tipo ?? ""}
          onChange={e => setField("tipo", e.target.value || undefined)}
        >
          <option value="">Tipo de Imóvel</option>
          <option value="Apartamento">Apartamento</option>
          <option value="Casa">Casa</option>
          <option value="Sala Comercial">Sala Comercial</option>
        </select>
      </label>

      <label className={styles.field}>
        Título / Nome
        <input
          className={styles.input}
          placeholder="Ex: Residencial Bela Vista"
          value={filtros.nome ?? ""}
          onChange={e => setField("nome", e.target.value || undefined)}
        />
      </label>

      <label className={styles.field}>
        Endereço / Bairro
        <input
          className={styles.input}
          placeholder="Rua, bairro..."
          value={filtros.endereco ?? ""}
          onChange={e => setField("endereco", e.target.value || undefined)}
        />
      </label>

      <label className={styles.field}>
        Cidade
        <input
          className={styles.input}
          value={filtros.cidade ?? ""}
          onChange={e => setField("cidade", e.target.value || undefined)}
          placeholder="Cidade"
        />
      </label>

      <label className={styles.field}>
        Estado (UF)
        <input
          className={styles.input}
          value={filtros.estado ?? ""}
          onChange={e => setField("estado", e.target.value || undefined)}
          placeholder="SP, GO..."
        />
      </label>

      <label className={styles.field}>
        Valor mínimo
        <input
          className={styles.input}
          type="number"
          value={filtros.valorMin ?? ""}
          onChange={e =>
            setField(
              "valorMin",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
        />
      </label>

      <label className={styles.field}>
        Valor máximo
        <input
          className={styles.input}
          type="number"
          value={filtros.valorMax ?? ""}
          onChange={e =>
            setField(
              "valorMax",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
        />
      </label>

      <label className={styles.field}>
        Quartos (mín)
        <input
          className={styles.input}
          type="number"
          min={0}
          value={filtros.quartos ?? ""}
          onChange={e =>
            setField(
              "quartos",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
        />
      </label>

      <label className={styles.field}>
        Banheiros (mín)
        <input
          className={styles.input}
          type="number"
          min={0}
          value={filtros.banheiros ?? ""}
          onChange={e =>
            setField(
              "banheiros",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
        />
      </label>

      <label className={styles.field}>
        Vagas (mín)
        <input
          className={styles.input}
          type="number"
          min={0}
          value={filtros.vagas ?? ""}
          onChange={e =>
            setField(
              "vagas",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
        />
      </label>

      <label className={styles.field}>
        Mín m²
        <input
          className={styles.input}
          type="number"
          value={filtros.metrosMin ?? ""}
          onChange={e =>
            setField(
              "metrosMin",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
        />
      </label>

      <label className={styles.field}>
        Máx m²
        <input
          className={styles.input}
          type="number"
          value={filtros.metrosMax ?? ""}
          onChange={e =>
            setField(
              "metrosMax",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
        />
      </label>

      {/* Custom Checkbox: Apenas lançamentos */}
      <CustomCheckbox
        checked={filtros.lancamento === true}
        onChange={() =>
          setField("lancamento", filtros.lancamento ? undefined : true)
        }
        label="Apenas lançamentos"
      />

      <div className={styles.tagsBox}>
        <p className={styles.tagsTitle}>Comodidades / Tags</p>
        <div className={styles.tagsGrid}>
          {(tags ?? []).map(tag => {
            const checked = (filtros.tags ?? []).includes(tag.id);
            return (
              <CustomCheckbox
                key={tag.id}
                checked={checked}
                onChange={() => toggleTag(tag.id)}
                label={tag.nome}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={limpar} className={styles.clearBtn}>
          Limpar filtros
        </button>
      </div>
    </aside>
  );
}