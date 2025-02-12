import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  serial,
  primaryKey,
} from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";

export const cardTypeEnum = pgEnum("card_type", [
  "action",
  "penguin",
  "rod",
  "relic",
]);
export const cardColorEnum = pgEnum("card_color", [
  "blue",
  "red",
  "yellow",
  "green",
  "purple",
  "colorless",
]);
export const cardRarityEnum = pgEnum("card_rarity", [
  "common",
  "uncommon",
  "rare",
  "epic",
]);

//auth schema

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

//cards schema

export const cardsTable = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  type: cardTypeEnum("type").notNull(),
  color: cardColorEnum("color").notNull(),
  rarity: cardRarityEnum("rarity").notNull(),
  cost: integer().notNull(),
  img: text().notNull(),
});

//decks schema

export const decksTable = pgTable("decks", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isPublic: boolean("is_public").notNull().default(false),
});

export const deckCardsTable = pgTable(
  "deck_cards",
  {
    deckId: integer("deck_id")
      .notNull()
      .references(() => decksTable.id, { onDelete: "cascade" }),
    cardId: integer("card_id")
      .notNull()
      .references(() => cardsTable.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.deckId, t.cardId] }),
  })
);
