
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clicks = pgTable("clicks", {
  id: serial("id").primaryKey(),
  buttonLabel: text("button_label").notNull(), // e.g., "Botão 1"
  dailySequence: integer("daily_sequence").notNull(), // The counter that resets daily
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClickSchema = createInsertSchema(clicks).pick({
  buttonLabel: true,
});

export type Click = typeof clicks.$inferSelect;
export type InsertClick = z.infer<typeof insertClickSchema>;

// API types
export type CreateClickRequest = InsertClick;
export type ClickResponse = Click;
