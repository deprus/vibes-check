"use server";

import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const NameUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type NameUpdateData = z.infer<typeof NameUpdateSchema>;

export async function updateName(formData: NameUpdateData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return {
      error: "You must be logged in to update your name",
    };
  }

  try {
    const validatedData = NameUpdateSchema.parse(formData);

    await db
      .update(user)
      .set({ name: validatedData.name })
      .where(eq(user.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error updating name:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  } finally {
    revalidatePath("/profile");
  }
}
