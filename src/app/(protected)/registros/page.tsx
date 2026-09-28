import { listPartidas } from "@/app/actions/list-partidas";
import { C } from "@/constants/Colors";

import RelatorioPartida from "./components/RelatorioPartida";

export default async function RegistrosPage() {
  const partidas = await listPartidas();

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bgAlt} 100%)`,
      }}
    >
      <RelatorioPartida partidas={partidas} />
    </div>
  );
}
