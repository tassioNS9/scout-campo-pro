import z from "zod";

const TAMANHO_MAXIMO_MB = 5;
const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"];

export const createJogadorSchema = z.object({
  idTime: z.coerce
    .number("Selecione um time")
    .int()
    .positive()
    .min(1, "Selecione um time"),
  numero: z.coerce
    .number("Número da camisa é obrigatório")
    .int()
    .positive()
    .min(1, "Número da camisa é obrigatório")
    .refine((v) => Number(v) >= 1 && Number(v) <= 99, {
      message: "Número deve estar entre 1 e 99",
    }),
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(60, "Nome deve ter no máximo 60 caracteres"),
  idade: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "Idade é obrigatória")
    .refine((v) => v >= 10 && v <= 50, {
      message: "Idade deve estar entre 10 e 50 anos",
    }),

  posicao: z.enum([
    "Goleiro",
    "Zagueiro",
    "Lateral",
    "Volante",
    "Meia",
    "Atacante",
  ]),
  foto: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= TAMANHO_MAXIMO_MB * 1024 * 1024, {
      message: `A imagem deve ter no máximo ${TAMANHO_MAXIMO_MB}MB`,
    })
    .refine((file) => !file || TIPOS_ACEITOS.includes(file.type), {
      message: "Formato inválido. Use JPEG, PNG ou WEBP",
    }),
});

export type CreateJogadorFormValues = z.infer<typeof createJogadorSchema>;
export type CreateJogadorFormInput = z.input<typeof createJogadorSchema>;
