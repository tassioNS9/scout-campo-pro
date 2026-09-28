import { eq, sql } from "drizzle-orm";

import { db } from "@/db"; // sua instância do Drizzle ORM (server)
import { auth } from "@/lib/auth"; // sua instância do Better Auth (server)

import {
  estatisticasTable,
  eventosTable,
  jogadoresTable,
  partidasTable,
  timesTable,
  user,
} from "./schema"; // <-- ajuste o caminho para o arquivo de schema enviado

async function limparBanco() {
  console.log("🧹 Limpando dados existentes...");

  // TRUNCATE ... CASCADE remove os dados respeitando a ordem das FKs
  // automaticamente, sem precisar deletar tabela por tabela na ordem certa.
  // RESTART IDENTITY zera os contadores de "serial" (id) de cada tabela.
  await db.execute(sql`
    TRUNCATE TABLE
      "eventos",
      "estatisticas",
      "relatorios",
      "partidas",
      "jogadores",
      "times",
      "session",
      "account",
      "verification",
      "user"
    RESTART IDENTITY CASCADE
  `);

  console.log("✅ Banco limpo.");
}

async function main() {
  console.log("🌱 Iniciando seed...");

  await limparBanco();

  // 1. Cria o usuário via Better Auth (gera user + account com senha hasheada)
  const { user: usuario } = await auth.api.signUpEmail({
    body: {
      email: "tassio.neves@example.com",
      password: "12345678",
      name: "Carlos Mendes",
    },
  });

  console.log("✅ Usuário criado via Better Auth:", usuario.email);

  // 2. (opcional) Atualiza campos extras que não fazem parte do signUp padrão
  //    ex: profileType, role, emailVerified
  await db
    .update(user)
    .set({ profileType: "Treinador", emailVerified: true })
    .where(eq(user.id, usuario.id));

  // 3. Agora segue o seed normalmente usando usuario.id
  const [timeA] = await db
    .insert(timesTable)
    .values({
      userId: usuario.id,
      nome: "Atlético Fortaleza FC",
      categoria: "Sub-17",
      cidade: "Fortaleza",
      estado: "CE",
    })
    .returning();

  const [timeB] = await db
    .insert(timesTable)
    .values({
      userId: usuario.id,
      nome: "Ceará Juniores",
      categoria: "Sub-20",
      cidade: "Fortaleza",
      estado: "CE",
    })
    .returning();

  // ──────────────────────────────────────────────
  // 3. JOGADORES
  // ──────────────────────────────────────────────
  const jogadoresTimeA = await db
    .insert(jogadoresTable)
    .values([
      {
        nome: "João Pedro Silva",
        numero: 1,
        posicao: "Goleiro",
        idade: 17,
        idTime: timeA.id,
      },
      {
        nome: "Lucas Andrade",
        numero: 4,
        posicao: "Zagueiro",
        idade: 16,
        idTime: timeA.id,
      },
      {
        nome: "Rafael Costa",
        numero: 2,
        posicao: "Lateral",
        idade: 17,
        idTime: timeA.id,
      },
      {
        nome: "Gabriel Souza",
        numero: 5,
        posicao: "Volante",
        idade: 17,
        idTime: timeA.id,
      },
      {
        nome: "Matheus Oliveira",
        numero: 10,
        posicao: "Meia",
        idade: 16,
        idTime: timeA.id,
      },
      {
        nome: "Pedro Henrique",
        numero: 9,
        posicao: "Atacante",
        idade: 17,
        idTime: timeA.id,
      },
    ])
    .returning();

  const jogadoresTimeB = await db
    .insert(jogadoresTable)
    .values([
      {
        nome: "Bruno Lima",
        numero: 1,
        posicao: "Goleiro",
        idade: 15,
        idTime: timeB.id,
      },
      {
        nome: "Felipe Rocha",
        numero: 3,
        posicao: "Zagueiro",
        idade: 14,
        idTime: timeB.id,
      },
      {
        nome: "Thiago Martins",
        numero: 7,
        posicao: "Atacante",
        idade: 15,
        idTime: timeB.id,
      },
    ])
    .returning();

  console.log(
    `✅ Jogadores criados: ${jogadoresTimeA.length} (Time A) + ${jogadoresTimeB.length} (Time B)`,
  );

  // ──────────────────────────────────────────────
  // 4. PARTIDAS
  // ──────────────────────────────────────────────
  const [partidaFinalizada] = await db
    .insert(partidasTable)
    .values({
      idTime: timeA.id,
      nomeTimeAdversario: "Ceará Juniores",
      data: new Date("2026-05-10T15:00:00Z"),
      campeonato: "Campeonato Cearense Sub-17",
      categoria: "Sub-17",
      casaOuFora: "casa",
      placarTime: 3,
      placarTimeAdversario: 1,
      status: "finalizada",
      resultado: "Vitoria",
    })
    .returning();

  const [partidaPlanejada] = await db
    .insert(partidasTable)
    .values({
      idTime: timeA.id,
      nomeTimeAdversario: "Fortaleza Estrelas FC",
      data: new Date("2026-07-15T19:00:00Z"),
      campeonato: "Campeonato Cearense Sub-17",
      categoria: "Sub-17",
      casaOuFora: "fora",
      status: "planejada",
    })
    .returning();

  console.log(
    "✅ Partidas criadas:",
    partidaFinalizada.nomeTimeAdversario,
    "/",
    partidaPlanejada.nomeTimeAdversario,
  );

  // ──────────────────────────────────────────────
  // 5. EVENTOS (partida finalizada)
  //    Somente valores presentes em tipoEventoEnum:
  //    "Finalização Certa" | "Finalização Errada" | "Assistência" |
  //    "Desarme" | "Interceptação" | "Falta Cometida" | "Falta Sofrida" | "Gol"
  //    Sem campo "zona" (não existe no schema atual).
  // ──────────────────────────────────────────────
  const atacante = jogadoresTimeA.find((j) => j.posicao === "Atacante")!;
  const meia = jogadoresTimeA.find((j) => j.posicao === "Meia")!;
  const zagueiro = jogadoresTimeA.find((j) => j.posicao === "Zagueiro")!;
  const goleiro = jogadoresTimeA.find((j) => j.posicao === "Goleiro")!;

  const eventosInseridos = await db
    .insert(eventosTable)
    .values([
      // 1º gol: finalização certa + gol do atacante, assistência do meia
      {
        idPartida: partidaFinalizada.id,
        idJogador: atacante.id,
        tipoEvento: "Gol",
        minuto: 12,
        tempo: "1T",
        detalhes: "Finalização de pé direito após cruzamento",
      },
      {
        idPartida: partidaFinalizada.id,
        idJogador: meia.id,
        tipoEvento: "Assistencia",
        minuto: 12,
        tempo: "1T",
        detalhes: "Passe decisivo para o gol",
      },
      {
        idPartida: partidaFinalizada.id,
        idJogador: atacante.id,
        tipoEvento: "Gol",
        minuto: 38,
        tempo: "1T",
      },
      {
        idPartida: partidaFinalizada.id,
        idJogador: meia.id,
        tipoEvento: "Gol",
        minuto: 67,
        tempo: "2T",
      },

      // ações defensivas do zagueiro
      {
        idPartida: partidaFinalizada.id,
        idJogador: zagueiro.id,
        tipoEvento: "Desarme",
        minuto: 18,
        tempo: "1T",
      },
      {
        idPartida: partidaFinalizada.id,
        idJogador: zagueiro.id,
        tipoEvento: "Desarme",
        minuto: 22,
        tempo: "1T",
      },
      {
        idPartida: partidaFinalizada.id,
        idJogador: zagueiro.id,
        tipoEvento: "FaltaCometida",
        minuto: 55,
        tempo: "2T",
      },

      // falta sofrida pelo meia
      {
        idPartida: partidaFinalizada.id,
        idJogador: meia.id,
        tipoEvento: "FaltaSofrida",
        minuto: 60,
        tempo: "2T",
      },

      // interceptação do goleiro (ação sem ser gol, já que "Duelo Ganho" não existe no enum)
    ])
    .returning();

  console.log(`✅ Eventos criados: ${eventosInseridos.length}`);

  // ──────────────────────────────────────────────
  // 6. ESTATÍSTICAS (agora só armazena a nota/avaliação do jogador
  //    na partida — contadores como gols, desarmes, finalizações etc.
  //    passaram a ser DERIVADOS da tabela "eventos", não persistidos aqui)
  // ──────────────────────────────────────────────
  const estatisticasInseridas = await db
    .insert(estatisticasTable)
    .values([
      {
        idJogador: atacante.id,
        idPartida: partidaFinalizada.id,
        nota: 8.7,
      },
      {
        idJogador: meia.id,
        idPartida: partidaFinalizada.id,
        nota: 8.4,
      },
      {
        idJogador: zagueiro.id,
        idPartida: partidaFinalizada.id,
        nota: 7.5,
      },
      {
        idJogador: goleiro.id,
        idPartida: partidaFinalizada.id,
        nota: 7.8,
      },
    ])
    .returning();

  console.log(
    `✅ Estatísticas (notas) criadas: ${estatisticasInseridas.length}`,
  );

  console.log("🌱 Seed finalizado com sucesso!");
}

main()
  .catch((err) => {
    console.error("❌ Erro ao executar o seed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
