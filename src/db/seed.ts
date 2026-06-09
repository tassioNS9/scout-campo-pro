import { db } from "@/db"; // ajuste o caminho conforme seu projeto
import {
  times,
  jogadores,
  partidas,
  eventos,
  estatisticas,
} from "@/db/schema"; // ajuste o caminho conforme seu projeto

async function seed() {
  console.log("🌱 Iniciando seed...");

  // ----------------------------------------------------------------
  // 1. TIMES
  // ----------------------------------------------------------------
  const timesData = await db
    .insert(times)
    .values([
      {
        nome: "Grêmio Atlético Bahia",
        categoria: "Profissional",
        cidade: "Salvador",
        estado: "BA",
      },
      {
        nome: "Esporte Clube Nordeste",
        categoria: "Profissional",
        cidade: "Feira de Santana",
        estado: "BA",
      },
      {
        nome: "Academia Sub-17 Bahia",
        categoria: "Sub-17",
        cidade: "Salvador",
        estado: "BA",
      },
      {
        nome: "Centro Esportivo Sub-15",
        categoria: "Sub-15",
        cidade: "Lauro de Freitas",
        estado: "BA",
      },
      {
        nome: "Associação Jovem Sub-13",
        categoria: "Sub-13",
        cidade: "Camaçari",
        estado: "BA",
      },
    ])
    .returning();

  console.log(`✅ ${timesData.length} times inseridos`);

  const [timeA, timeB, timeSub17, timeSub15, timeSub13] = timesData;

  // ----------------------------------------------------------------
  // 2. JOGADORES
  // ----------------------------------------------------------------
  const jogadoresTimeA = [
    { nome: "Lucas Ferreira",     numero: 1,  posicao: "Goleiro",   idade: 25, idTime: timeA.id },
    { nome: "Rafael Souza",       numero: 4,  posicao: "Zagueiro",  idade: 27, idTime: timeA.id },
    { nome: "Thiago Oliveira",    numero: 5,  posicao: "Zagueiro",  idade: 24, idTime: timeA.id },
    { nome: "Carlos Lima",        numero: 2,  posicao: "Lateral",   idade: 22, idTime: timeA.id },
    { nome: "Diego Mendes",       numero: 6,  posicao: "Lateral",   idade: 23, idTime: timeA.id },
    { nome: "Felipe Santos",      numero: 8,  posicao: "Volante",   idade: 26, idTime: timeA.id },
    { nome: "Bruno Costa",        numero: 15, posicao: "Volante",   idade: 24, idTime: timeA.id },
    { nome: "Mateus Alves",       numero: 10, posicao: "Meia",      idade: 28, idTime: timeA.id },
    { nome: "Anderson Rocha",     numero: 7,  posicao: "Meia",      idade: 25, idTime: timeA.id },
    { nome: "Gabriel Nunes",      numero: 9,  posicao: "Atacante",  idade: 23, idTime: timeA.id },
    { nome: "Vinícius Carvalho",  numero: 11, posicao: "Atacante",  idade: 21, idTime: timeA.id },
  ] as const;

  const jogadoresTimeB = [
    { nome: "Pedro Henrique",     numero: 1,  posicao: "Goleiro",   idade: 26, idTime: timeB.id },
    { nome: "Marcos Pereira",     numero: 3,  posicao: "Zagueiro",  idade: 29, idTime: timeB.id },
    { nome: "Jonathan Silva",     numero: 5,  posicao: "Zagueiro",  idade: 25, idTime: timeB.id },
    { nome: "Eduardo Farias",     numero: 2,  posicao: "Lateral",   idade: 24, idTime: timeB.id },
    { nome: "Rodrigo Matos",      numero: 6,  posicao: "Lateral",   idade: 22, idTime: timeB.id },
    { nome: "Leandro Andrade",    numero: 8,  posicao: "Volante",   idade: 27, idTime: timeB.id },
    { nome: "Samuel Barbosa",     numero: 14, posicao: "Volante",   idade: 23, idTime: timeB.id },
    { nome: "Alexandre Gomes",    numero: 10, posicao: "Meia",      idade: 30, idTime: timeB.id },
    { nome: "Renato Campos",      numero: 7,  posicao: "Meia",      idade: 26, idTime: timeB.id },
    { nome: "Henrique Teixeira",  numero: 9,  posicao: "Atacante",  idade: 24, idTime: timeB.id },
    { nome: "Igor Nascimento",    numero: 11, posicao: "Atacante",  idade: 22, idTime: timeB.id },
  ] as const;

  const jogadoresSub17 = [
    { nome: "Kaique Moreira",     numero: 1,  posicao: "Goleiro",   idade: 16, idTime: timeSub17.id },
    { nome: "Davi Lopes",         numero: 4,  posicao: "Zagueiro",  idade: 17, idTime: timeSub17.id },
    { nome: "Nathan Freitas",     numero: 9,  posicao: "Atacante",  idade: 16, idTime: timeSub17.id },
    { nome: "Cauã Ribeiro",       numero: 10, posicao: "Meia",      idade: 17, idTime: timeSub17.id },
    { nome: "Yuri Batista",       numero: 7,  posicao: "Atacante",  idade: 16, idTime: timeSub17.id },
  ] as const;

  const jogadoresSub15 = [
    { nome: "Arthur Pinto",       numero: 1,  posicao: "Goleiro",   idade: 15, idTime: timeSub15.id },
    { nome: "Enzo Cavalcante",    numero: 8,  posicao: "Volante",   idade: 14, idTime: timeSub15.id },
    { nome: "Guilherme Ramos",    numero: 9,  posicao: "Atacante",  idade: 15, idTime: timeSub15.id },
  ] as const;

  const jogadoresSub13 = [
    { nome: "Miguel Torres",      numero: 1,  posicao: "Goleiro",   idade: 13, idTime: timeSub13.id },
    { nome: "Bernardo Paixão",    numero: 10, posicao: "Meia",      idade: 12, idTime: timeSub13.id },
    { nome: "Théo Vasconcelos",   numero: 9,  posicao: "Atacante",  idade: 13, idTime: timeSub13.id },
  ] as const;

  const jogadoresInseridos = await db
    .insert(jogadores)
    .values([
      ...jogadoresTimeA,
      ...jogadoresTimeB,
      ...jogadoresSub17,
      ...jogadoresSub15,
      ...jogadoresSub13,
    ])
    .returning();

  console.log(`✅ ${jogadoresInseridos.length} jogadores inseridos`);

  // Helpers para pegar jogadores por time
  const jA = jogadoresInseridos.filter((j) => j.idTime === timeA.id);
  const jB = jogadoresInseridos.filter((j) => j.idTime === timeB.id);
  const jS17 = jogadoresInseridos.filter((j) => j.idTime === timeSub17.id);

  // ----------------------------------------------------------------
  // 3. PARTIDAS
  // ----------------------------------------------------------------
  const partidasData = await db
    .insert(partidas)
    .values([
      {
        time: timeA.nome,
        timeAdversario: timeB.nome,
        data: new Date("2025-03-15T15:00:00"),
        campeonato: "Campeonato Baiano 2025",
        categoria: "Profissional",
        formacao: "4-3-3",
        placarTimeA: 2,
        placarTimeB: 1,
        status: "finalizada",
        resultado: "Vitória",
      },
      {
        time: timeA.nome,
        timeAdversario: "Vitória FC",
        data: new Date("2025-03-22T16:00:00"),
        campeonato: "Campeonato Baiano 2025",
        categoria: "Profissional",
        formacao: "4-4-2",
        placarTimeA: 0,
        placarTimeB: 0,
        status: "finalizada",
        resultado: "Empate",
      },
      {
        time: timeA.nome,
        timeAdversario: timeB.nome,
        data: new Date("2025-04-05T15:00:00"),
        campeonato: "Copa do Nordeste 2025",
        categoria: "Profissional",
        formacao: "4-3-3",
        placarTimeA: 1,
        placarTimeB: 3,
        status: "finalizada",
        resultado: "Derrota",
      },
      {
        time: timeSub17.nome,
        timeAdversario: "Atlético Sub-17",
        data: new Date("2025-04-10T10:00:00"),
        campeonato: "Torneio Regional Sub-17",
        categoria: "Sub-17",
        formacao: "4-3-3",
        placarTimeA: 3,
        placarTimeB: 0,
        status: "finalizada",
        resultado: "Vitória",
      },
      {
        time: timeSub15.nome,
        timeAdversario: "Cruzeiro Sub-15",
        data: new Date("2025-04-12T09:00:00"),
        campeonato: "Torneio Regional Sub-15",
        categoria: "Sub-15",
        formacao: "4-4-2",
        placarTimeA: 1,
        placarTimeB: 2,
        status: "finalizada",
        resultado: "Derrota",
      },
      {
        time: timeA.nome,
        timeAdversario: "Bahia FC",
        data: new Date("2025-05-01T19:00:00"),
        campeonato: "Campeonato Baiano 2025",
        categoria: "Profissional",
        formacao: "4-3-3",
        placarTimeA: 0,
        placarTimeB: 0,
        status: "em_andamento",
        resultado: "Sem Resultado",
      },
      {
        time: timeA.nome,
        timeAdversario: "Santos FC",
        data: new Date("2025-05-10T16:00:00"),
        campeonato: "Amistoso",
        categoria: "Profissional",
        formacao: "4-3-3",
        placarTimeA: 0,
        placarTimeB: 0,
        status: "planejada",
        resultado: "Sem Resultado",
      },
    ])
    .returning();

  console.log(`✅ ${partidasData.length} partidas inseridas`);

  const [p1, p2, p3, p4] = partidasData;

  // ----------------------------------------------------------------
  // 4. EVENTOS — Partida 1 (Vitória 2x1)
  // ----------------------------------------------------------------
  const eventosPartida1 = [
    // Gol de Gabriel Nunes (jA[9]) no 1T
    { idPartida: p1.id, idJogador: jA[9].id, tipoEvento: "Finalização Certa", minuto: 23, tempo: "1T", zona: "Ataque" },
    { idPartida: p1.id, idJogador: jA[9].id, tipoEvento: "Gol",               minuto: 23, tempo: "1T", zona: "Ataque" },
    // Assistência de Mateus Alves (jA[7])
    { idPartida: p1.id, idJogador: jA[7].id, tipoEvento: "Assistência",       minuto: 23, tempo: "1T", zona: "Ataque" },
    // Gol de Vinícius (jA[10]) no 2T
    { idPartida: p1.id, idJogador: jA[10].id, tipoEvento: "Finalização Certa", minuto: 67, tempo: "2T", zona: "Ataque" },
    { idPartida: p1.id, idJogador: jA[10].id, tipoEvento: "Gol",               minuto: 67, tempo: "2T", zona: "Ataque" },
    // Passe decisivo de Anderson Rocha (jA[8])
    { idPartida: p1.id, idJogador: jA[8].id, tipoEvento: "Passe Decisivo",    minuto: 67, tempo: "2T", zona: "Meio" },
    // Gol adversário (Henrique, jB[9])
    { idPartida: p1.id, idJogador: jB[9].id, tipoEvento: "Gol",               minuto: 78, tempo: "2T", zona: "Ataque" },
    // Desarmes e recuperações
    { idPartida: p1.id, idJogador: jA[5].id, tipoEvento: "Desarme",           minuto: 35, tempo: "1T", zona: "Meio" },
    { idPartida: p1.id, idJogador: jA[5].id, tipoEvento: "Ganho de Bola",     minuto: 55, tempo: "2T", zona: "Meio" },
    { idPartida: p1.id, idJogador: jA[3].id, tipoEvento: "Interceptação",     minuto: 42, tempo: "1T", zona: "Defesa" },
    // Finalizações erradas
    { idPartida: p1.id, idJogador: jA[9].id, tipoEvento: "Finalização Errada", minuto: 15, tempo: "1T", zona: "Ataque" },
    { idPartida: p1.id, idJogador: jA[10].id, tipoEvento: "Finalização Errada", minuto: 50, tempo: "2T", zona: "Ataque" },
    // Dribles
    { idPartida: p1.id, idJogador: jA[7].id, tipoEvento: "Drible Certo",      minuto: 20, tempo: "1T", zona: "Ataque" },
    { idPartida: p1.id, idJogador: jA[8].id, tipoEvento: "Drible Errado",     minuto: 60, tempo: "2T", zona: "Meio" },
    // Falta
    { idPartida: p1.id, idJogador: jA[6].id, tipoEvento: "Falta",             minuto: 30, tempo: "1T", zona: "Meio" },
  ] as const;

  // ----------------------------------------------------------------
  // 5. EVENTOS — Partida 2 (Empate 0x0)
  // ----------------------------------------------------------------
  const eventosPartida2 = [
    { idPartida: p2.id, idJogador: jA[9].id,  tipoEvento: "Finalização Errada", minuto: 12, tempo: "1T", zona: "Ataque" },
    { idPartida: p2.id, idJogador: jA[10].id, tipoEvento: "Finalização Errada", minuto: 37, tempo: "1T", zona: "Ataque" },
    { idPartida: p2.id, idJogador: jA[9].id,  tipoEvento: "Finalização Errada", minuto: 55, tempo: "2T", zona: "Ataque" },
    { idPartida: p2.id, idJogador: jA[7].id,  tipoEvento: "Passe Decisivo",     minuto: 44, tempo: "1T", zona: "Meio" },
    { idPartida: p2.id, idJogador: jA[5].id,  tipoEvento: "Desarme",            minuto: 20, tempo: "1T", zona: "Defesa" },
    { idPartida: p2.id, idJogador: jA[6].id,  tipoEvento: "Interceptação",      minuto: 65, tempo: "2T", zona: "Defesa" },
    { idPartida: p2.id, idJogador: jA[3].id,  tipoEvento: "Ganho de Bola",      minuto: 72, tempo: "2T", zona: "Defesa" },
    { idPartida: p2.id, idJogador: jA[4].id,  tipoEvento: "Cruzamento",         minuto: 80, tempo: "2T", zona: "Ataque" },
  ] as const;

  // ----------------------------------------------------------------
  // 6. EVENTOS — Partida 4 Sub-17 (Vitória 3x0)
  // ----------------------------------------------------------------
  const eventosPartida4 = [
    { idPartida: p4.id, idJogador: jS17[2].id, tipoEvento: "Gol",               minuto: 10, tempo: "1T", zona: "Ataque" },
    { idPartida: p4.id, idJogador: jS17[2].id, tipoEvento: "Finalização Certa", minuto: 10, tempo: "1T", zona: "Ataque" },
    { idPartida: p4.id, idJogador: jS17[3].id, tipoEvento: "Assistência",       minuto: 10, tempo: "1T", zona: "Ataque" },
    { idPartida: p4.id, idJogador: jS17[4].id, tipoEvento: "Gol",               minuto: 34, tempo: "1T", zona: "Ataque" },
    { idPartida: p4.id, idJogador: jS17[4].id, tipoEvento: "Finalização Certa", minuto: 34, tempo: "1T", zona: "Ataque" },
    { idPartida: p4.id, idJogador: jS17[2].id, tipoEvento: "Gol",               minuto: 58, tempo: "2T", zona: "Ataque" },
    { idPartida: p4.id, idJogador: jS17[2].id, tipoEvento: "Finalização Certa", minuto: 58, tempo: "2T", zona: "Ataque" },
    { idPartida: p4.id, idJogador: jS17[1].id, tipoEvento: "Desarme",           minuto: 45, tempo: "2T", zona: "Defesa" },
  ] as const;

  await db.insert(eventos).values([
    ...eventosPartida1,
    ...eventosPartida2,
    ...eventosPartida4,
  ]);

  console.log(`✅ Eventos inseridos`);

  // ----------------------------------------------------------------
  // 7. ESTATÍSTICAS — Partida 1
  // ----------------------------------------------------------------
  await db.insert(estatisticas).values([
    // Gabriel Nunes — destaque da partida
    {
      idJogador: jA[9].id, idPartida: p1.id,
      finalizacaoCerta: 1, finalizacaoErrada: 1, gols: 1,
      dribleCerto: 2, dribleErrado: 1, perdaBola: 1,
      nota: "8.5",
    },
    // Vinícius Carvalho
    {
      idJogador: jA[10].id, idPartida: p1.id,
      finalizacaoCerta: 1, finalizacaoErrada: 1, gols: 1,
      dribleCerto: 1, perdaBola: 2,
      nota: "7.5",
    },
    // Mateus Alves — meia criativo
    {
      idJogador: jA[7].id, idPartida: p1.id,
      assistencias: 1, finalizacaoErrada: 1,
      dribleCerto: 3, dribleErrado: 1,
      nota: "8.0",
    },
    // Anderson Rocha
    {
      idJogador: jA[8].id, idPartida: p1.id,
      assistencias: 1, dribleErrado: 1,
      nota: "7.0",
    },
    // Felipe Santos — volante defensivo
    {
      idJogador: jA[5].id, idPartida: p1.id,
      desarmes: 2, interceptacoes: 1, ganhoBola: 2, faltas: 1,
      nota: "7.5",
    },
    // Carlos Lima — lateral
    {
      idJogador: jA[3].id, idPartida: p1.id,
      cruzamentos: 3, interceptacoes: 1, faltas: 1,
      nota: "6.5",
    },
    // Rafael Souza — zagueiro
    {
      idJogador: jA[1].id, idPartida: p1.id,
      desarmes: 3, interceptacoes: 2,
      nota: "7.0",
    },
    // Goleiro Lucas Ferreira
    {
      idJogador: jA[0].id, idPartida: p1.id,
      nota: "7.0",
    },
    // Adversário — Henrique Teixeira (gol)
    {
      idJogador: jB[9].id, idPartida: p1.id,
      finalizacaoCerta: 1, gols: 1,
      nota: "7.0",
    },
  ]);

  // ----------------------------------------------------------------
  // 8. ESTATÍSTICAS — Partida 2 (Empate)
  // ----------------------------------------------------------------
  await db.insert(estatisticas).values([
    {
      idJogador: jA[9].id, idPartida: p2.id,
      finalizacaoErrada: 2, dribleCerto: 1,
      nota: "5.5",
    },
    {
      idJogador: jA[10].id, idPartida: p2.id,
      finalizacaoErrada: 1,
      nota: "5.0",
    },
    {
      idJogador: jA[7].id, idPartida: p2.id,
      assistencias: 0, dribleCerto: 2, perdaBola: 1,
      nota: "6.5",
    },
    {
      idJogador: jA[5].id, idPartida: p2.id,
      desarmes: 3, ganhoBola: 1, faltas: 2,
      nota: "7.0",
    },
    {
      idJogador: jA[6].id, idPartida: p2.id,
      interceptacoes: 2, desarmes: 1,
      nota: "6.5",
    },
  ]);

  // ----------------------------------------------------------------
  // 9. ESTATÍSTICAS — Partida Sub-17
  // ----------------------------------------------------------------
  await db.insert(estatisticas).values([
    {
      idJogador: jS17[2].id, idPartida: p4.id,
      finalizacaoCerta: 2, gols: 2, dribleCerto: 3,
      nota: "9.5",
    },
    {
      idJogador: jS17[4].id, idPartida: p4.id,
      finalizacaoCerta: 1, gols: 1, dribleCerto: 2,
      nota: "8.5",
    },
    {
      idJogador: jS17[3].id, idPartida: p4.id,
      assistencias: 1, dribleCerto: 2,
      nota: "8.0",
    },
    {
      idJogador: jS17[1].id, idPartida: p4.id,
      desarmes: 3, interceptacoes: 2,
      nota: "7.5",
    },
    {
      idJogador: jS17[0].id, idPartida: p4.id,
      nota: "8.0",
    },
  ]);

  console.log(`✅ Estatísticas inseridas`);
  console.log("🎉 Seed concluído com sucesso!");
}

seed().catch((err) => {
  console.error("❌ Erro durante o seed:", err);
  process.exit(1);
});
