import { listPartidas } from "@/app/actions/list-partidas";

import RelatorioPartida from "./components/RelatorioPartida";

export default async function RegistrosPage() {
  const partidas = await listPartidas();

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-scout-bg to-scout-bg-alt">
      <RelatorioPartida partidas={partidas} />
    </div>
  );
}
