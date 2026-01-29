
import { z } from "zod";
import { insertClickSchema, clicks } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  clicks: {
    create: {
      method: "POST" as const,
      path: "/api/clicks",
      input: insertClickSchema,
      responses: {
        201: z.custom<typeof clicks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    listToday: {
      method: "GET" as const,
      path: "/api/clicks/today",
      responses: {
        200: z.array(z.custom<typeof clicks.$inferSelect>()),
      },
    },
    downloadToday: {
      method: "GET" as const,
      path: "/api/clicks/today/download",
      responses: {
        200: z.string(),
      },
    },
    stats: {
      method: "GET" as const,
      path: "/api/clicks/stats",
      responses: {
        200: z.array(z.object({
          buttonLabel: z.string(),
          count: z.number(),
        })),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
