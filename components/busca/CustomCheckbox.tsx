
import React from "react";
import styles from "./Filtro.module.css";

type Props = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  id?: string;
};

export default function CustomCheckbox({
  checked,
  onChange,
  label = "",
  id,
}: Props) {
  return (
    <label className={styles.chk}>
      {/* input VISÍVEL no fluxo (opacity:0) — importantíssimo para evitar scroll jump */}
      <input
        id={id}
        type="checkbox"
        className={styles.chkInput}
        checked={checked}
        onChange={() => onChange()}
      />

      <span className={styles.chkBox} aria-hidden="true">
        <svg
          className={styles.chkIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>

      <span className={styles.chkLabel}>{label}</span>
    </label>
  );
}
