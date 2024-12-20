import { z } from "zod";

export const savedObjectSchema = z.object({
  messages: z.array(z.any()),
  globalStatistics: z.any(),
  sessionInfo: z.any(),
  userData: z.any(),
  type: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string",
  }),
  uuid: z.string(),
});

export type SavedObject = z.infer<typeof savedObjectSchema>;

export const trackSchema = z.object({
  uuid: z.string(),
  sessionId: z.string(),
  page: z.string(),
});
export type TrackType = z.infer<typeof trackSchema>;
