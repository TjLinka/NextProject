import { z } from "zod";

export const createMessageSchema = z.object({
  text: z.string().min(5, "Тело сообщения минимум 5 символа").max(200),
});

export type CreateMessage = z.infer<typeof createMessageSchema>;
