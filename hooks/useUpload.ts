import { useState } from "react";

export function useUploadMidias() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function upload(files: File[]): Promise<{ url: string; tipo: "foto" | "video" }[]> {
    if (!files || files.length === 0) return [];

    setLoading(true);
    setErro(null);

    const uploaded: { url: string; tipo: "foto" | "video" }[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://127.0.0.1:8000/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`Erro ao enviar ${file.name}`);

        const data = await res.json(); // { url: string }
        const tipo: "foto" | "video" = file.type.startsWith("video/") ? "video" : "foto";

        uploaded.push({ url: data.path, tipo });
      }
    } catch (e) {
      
    } finally {
      setLoading(false);
    }

    return uploaded;
  }

  return { upload, loading, erro };
}
