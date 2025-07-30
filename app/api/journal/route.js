// app/api/journal/route.js or route.ts
import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { getMoodById, MOODS } from "@/app/lib/moods"
import { getPixabayImage } from "@/actions/public"

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const data = await req.json();

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid mood");

    const moodImageUrl = await getPixabayImage(data.moodQuery);

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

    return Response.json(entry);
  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
