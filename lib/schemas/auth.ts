import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo no válido"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

export const registroSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(60, "Máximo 60 caracteres"),
  email: z.string().email("Correo no válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?\d{7,15}$/,"Número no válido")
    .optional()
    .or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegistroInput = z.infer<typeof registroSchema>;
