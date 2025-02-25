"use server";

import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { decksTable, deckCardsTable } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

const DeckSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  cards: z.array(
    z.object({
      cardId: z.number(),
      quantity: z.number().min(1).max(4),
    }),
  ),
});

export type DeckFormData = z.infer<typeof DeckSchema>;

export async function saveDeck(formData: DeckFormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("You must be logged in to save a deck");
  }

  const userId = session.user.id;
  const validatedData = DeckSchema.parse(formData);

  try {
    let deckId: number;

    if (validatedData.id) {
      const existingDeck = await db
        .select()
        .from(decksTable)
        .where(
          and(
            eq(decksTable.id, validatedData.id),
            eq(decksTable.userId, userId),
          ),
        )
        .limit(1);

      if (!existingDeck.length) {
        throw new Error(
          "Deck not found or you don't have permission to edit it",
        );
      }

      await db
        .update(decksTable)
        .set({
          name: validatedData.name,
          description: validatedData.description,
          isPublic: validatedData.isPublic,
          updatedAt: new Date(),
        })
        .where(eq(decksTable.id, validatedData.id));

      deckId = validatedData.id;

      await db.delete(deckCardsTable).where(eq(deckCardsTable.deckId, deckId));
    } else {
      const result = await db
        .insert(decksTable)
        .values({
          name: validatedData.name,
          description: validatedData.description,
          userId,
          isPublic: validatedData.isPublic,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: decksTable.id });

      deckId = result[0].id;
    }

    if (validatedData.cards.length > 0) {
      await db.insert(deckCardsTable).values(
        validatedData.cards.map((card) => ({
          deckId,
          cardId: card.cardId,
          quantity: card.quantity,
        })),
      );
    }

    return { success: true, deckId };
  } catch (error) {
    console.error("Error saving deck:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  } finally {
    revalidatePath("/decks");
  }
}

export async function deleteDeck(deckId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return {
      success: false,
      error: "You must be logged in to delete a deck",
    };
  }

  const userId = session.user.id;

  try {
    const existingDeck = await db
      .select()
      .from(decksTable)
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .limit(1);

    if (!existingDeck.length) {
      return {
        success: false,
        error: "Deck not found or you don't have permission to delete it",
      };
    }

    await db.delete(deckCardsTable).where(eq(deckCardsTable.deckId, deckId));

    await db.delete(decksTable).where(eq(decksTable.id, deckId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting deck:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  } finally {
    revalidatePath("/decks");
    revalidatePath("/my-decks");
  }
}
