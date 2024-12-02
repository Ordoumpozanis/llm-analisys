"use server";
import prisma from "@/lib/prisma";
import { savedObjectSchema } from "@/schemas/prisma";
import { Prisma } from "@prisma/client";

export default async function sabeChat(toSave: string) {
  if (!toSave) {
    return { success: false, error: "No data provided" };
  }

  try {
    const document = JSON.parse(toSave);
    const parsedData = savedObjectSchema.parse(document);

    const data = await prisma.chat.create({
      data: parsedData as Prisma.ChatCreateInput,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error while saving chat:", error);
    return { success: false, error: error };
  }
}
