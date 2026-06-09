import { getJogadorById } from "@/app/actions/get-jogador-by-id";

const JogadorDetails = async ({
  params,
}: {
  params: { id_jogador: number };
}) => {
  const { id_jogador } = await params;
  const jogador = await getJogadorById(id_jogador);

  if (!jogador) return null;
  console.log("Jogador encontrado:", jogador);
  return <div className="container mx-auto lg:px-36"></div>;
};

export default JogadorDetails;
