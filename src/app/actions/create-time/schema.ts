import { z } from "zod";

const TAMANHO_MAXIMO_MB = 5;
const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"];

export const createTimeSchema = z.object({
  nome: z.string().min(2, "Nome muito curto").max(100),
  categoria: z.enum(["Sub-17", "Sub-20", "Profissional"]),
  cidade: z.string().min(2, "Cidade muito curta").max(100),
  estado: z.string().length(2, "Use a sigla do estado (ex: CE)"),
  escudo: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= TAMANHO_MAXIMO_MB * 1024 * 1024, {
      message: `A imagem deve ter no máximo ${TAMANHO_MAXIMO_MB}MB`,
    })
    .refine((file) => !file || TIPOS_ACEITOS.includes(file.type), {
      message: "Formato inválido. Use JPEG, PNG ou WEBP",
    }),
});

export type CreateTimeFormValues = z.infer<typeof createTimeSchema>;
