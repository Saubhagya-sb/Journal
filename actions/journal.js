"use server"

import { getMoodById, MOODS } from "@/app/lib/moods"
import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { getPixabayImage } from "./public"
import { revalidatePath } from "next/cache"
 import aj from "@/app/lib/arcjet"
import { success } from "zod"

export async function createJournalEntry(data) {
  try {
    console.log("📥 Received data:", data);

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const req = await request(); // ensure this is correctly imported!

    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      console.error("❌ Rate limit denied:", decision.reason);
      throw new Error("Too many requests. Please try again later.");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

   if (!data.mood) throw new Error("Mood is required");
const mood = MOODS[data.mood.toUpperCase()];
if (!mood) throw new Error(`Invalid mood: ${data.mood}`);


    let moodImageUrl = null;
    try {
      moodImageUrl = await getPixabayImage(data.moodQuery);
    } catch (e) {
      console.warn("⚠️ Failed to get image:", e.message);
    }

    const entry = await db.entry.create({
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        userId: user.id,
        collectionId: data.collectionId || null,
      },
    });

    await db.draft.deleteMany({
      where: { userId: user.id },
    });

    revalidatePath("/dashboard"); // ✅ Un-comment this
    console.log("✅ Entry created:", entry);
    return entry;

  } catch (error) {
    console.error("🚨 Error creating entry:", error);
    throw new Error(error.message);
  }
}

export async function getJournalEntriesPreview({collectionId , orderBy='desc'}={}) {
    try {
      const {userId} = await auth();
      if(!userId){
        throw new Error("Unauthorized")
      }
      const user = await db.user.findUnique({
        where:{clerkUserId : userId}
      })
      if(!user){
        throw new Error("User Not Found")
      }
      const entries = await db.entry.findMany({
        where:{
          userId : user.id,
          ...(collectionId === "unorganized" ? {collectionId : null} : collectionId?{collectionId}:{})
        },
        include:{
          collection:{
            select:{
              id:true,
              name: true
            }
          }
        },
        orderBy:{
          createdAt : orderBy
        }
      })

      const entriesWithMoodData = entries.map((entry)=>(
        {
          ...entry,
          moodData : getMoodById(entry.mood),
        }
      ))

      return {
        success : true,
        data:{
          entries : entriesWithMoodData,
        }
      }
    } catch (error) {
      return {success : false , error : error.message}
    }
}

export async function getJournalEntries({
  collectionId,
  collectionName,
  orderBy = 'desc',
} = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User Not Found");

    let resolvedCollectionId = null;

    if (collectionId === "unorganized" || collectionName === "unorganized") {
      resolvedCollectionId = null;
    } else if (collectionId) {
      resolvedCollectionId = collectionId;
    } else if (collectionName) {
      const collection = await db.collection.findFirst({
        where: {
          name: collectionName,
          userId: user.id,
        },
        select: { id: true },
      });

      if (!collection) throw new Error(`Collection "${collectionName}" not found`);
      resolvedCollectionId = collection.id;
    }

    const entries = await db.entry.findMany({
      where: {
        userId: user.id,
        collectionId: resolvedCollectionId, // This handles null and actual IDs cleanly
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
           
          },
        },
      },
      orderBy: {
        createdAt: orderBy,
      },
    });

    const entriesWithMoodData = entries.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt.toISOString(),  // ✅ serialize Date
      updatedAt: entry.updatedAt?.toISOString(),
      moodData: getMoodById(entry.mood),
    }));

    return {
      success: true,
      data: {
        entries: entriesWithMoodData,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
export async function getJournalEntry(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const entry = await db.entry.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!entry) throw new Error("Entry not found");

    return entry;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function deleteJournalEntry(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if entry exists and belongs to user
    const entry = await db.entry.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!entry) throw new Error("Entry not found");

    // Delete the entry
    await db.entry.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return entry;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateJournalEntry(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if entry exists and belongs to user
    const existingEntry = await db.entry.findFirst({
      where: {
        id: data.id,
        userId: user.id,
      },
    });

    if (!existingEntry) throw new Error("Entry not found");

    // Get mood data
    
const mood = MOODS[data.mood?.toUpperCase()] || {
    id: "proud",
    label: "Proud",
    emoji: "🦁",
    score: 9,
    color: "amber",
    prompt: "What achievement are you proud of?",
    pixabayQuery: "achievement+success+proud",
  };
if (!mood) throw new Error(`Invalid mood: ${data.mood}`);


    // Get new mood image if mood changed
    let moodImageUrl = existingEntry.moodImageUrl;
    if (existingEntry.mood !== mood.id) {
      moodImageUrl = await getPixabayImage(data.moodQuery);
    }

    // Update the entry
    const updatedEntry = await db.entry.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        collectionId: data.collectionId || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/journal/${data.id}`);
    return updatedEntry;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDraft() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const draft = await db.draft.findUnique({
      where: { userId: user.id },
    });

    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function saveDraft(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const draft = await db.draft.upsert({
      where: { userId: user.id },
      create: {
        title: data.title,
        content: data.content,
        mood: data.mood,
        userId: user.id,
      },
      update: {
        title: data.title,
        content: data.content,
        mood: data.mood,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error.message };
  }
}