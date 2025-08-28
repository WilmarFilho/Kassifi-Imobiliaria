import { getSession } from "next-auth/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard do Admin</h1>
      <p>Aqui você cadastra novos imóveis.</p>
    </div>
  );
}

// Protege a rota
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  return { props: { session } };
};
