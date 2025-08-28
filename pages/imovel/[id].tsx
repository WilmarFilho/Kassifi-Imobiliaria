import { useRouter } from 'next/router';

export default function Imovel() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Detalhes do imóvel {id}</h1>
      <p>Mais informações aqui...</p>
    </div>
  )
}
