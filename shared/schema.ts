import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrls: text("imageUrls").array().notNull(),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products)
  .omit({ id: true, archived: true, createdAt: true })
  .extend({
    price: z.string().regex(/^\d+$/, "Цена должна быть указана в рублях"),
    imageUrls: z.array(z.string().url("Должен быть действительный URL")).min(1, "Добавьте хотя бы одно изображение"),
  });

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;