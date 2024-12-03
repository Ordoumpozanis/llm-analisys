"use server";
import prisma from "@/lib/prisma";
import { trackSchema, TrackType } from "@/schemas/prisma";
import { Prisma } from "@prisma/client";

export default async function saveTrack(data: TrackType) {
  if (!data) {
    return { success: false, error: "No data provided" };
  }

  try {
    const parsedData = trackSchema.parse(data);

    await prisma.navigation.create({
      data: parsedData as Prisma.NavigationCreateInput,
    });

    return { success: true };
  } catch (error) {
    console.error("Error while saving track:", error);
    return { success: false, error: error };
  }
}
