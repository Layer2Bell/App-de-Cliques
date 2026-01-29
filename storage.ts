
import { db } from "./db";
import { clicks, type InsertClick, type Click } from "@shared/schema";
import { sql, gte, and } from "drizzle-orm";

export interface IStorage {
  addClick(click: InsertClick): Promise<Click>;
  getClicksToday(): Promise<Click[]>;
  getClickStats(): Promise<{ buttonLabel: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  async addClick(insertClick: InsertClick): Promise<Click> {
    // Calculate start of today (local server time logic, usually UTC in containers)
    // For simplicity in this env, we'll use Postgres `current_date` or JS dates.
    // Using JS date set to 00:00:00 UTC for the query.
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Get the current max sequence for today
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(clicks)
      .where(gte(clicks.createdAt, startOfDay));
    
    const nextSequence = Number(result.count) + 1;

    const [newClick] = await db
      .insert(clicks)
      .values({
        ...insertClick,
        dailySequence: nextSequence,
      })
      .returning();

    return newClick;
  }

  async getClicksToday(): Promise<Click[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return await db
      .select()
      .from(clicks)
      .where(gte(clicks.createdAt, startOfDay))
      .orderBy(sql`${clicks.createdAt} DESC`);
  }

  async getClickStats(): Promise<{ buttonLabel: string; count: number }[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const results = await db
      .select({
        buttonLabel: clicks.buttonLabel,
        count: sql<number>`count(*)::int`,
      })
      .from(clicks)
      .where(gte(clicks.createdAt, startOfDay))
      .groupBy(clicks.buttonLabel)
      .orderBy(clicks.buttonLabel);

    return results;
  }
}

export const storage = new DatabaseStorage();
