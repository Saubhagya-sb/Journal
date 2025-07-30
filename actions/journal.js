"use server"

import { getMoodById, MOODS } from "@/app/lib/moods"
import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { getPixabayImage } from "./public"
import { revalidatePath } from "next/cache"
 import aj from "@/app/lib/arcjet"
import { success } from "zod"
// export async function createJournalEntry(data) {
//     try {
//         const {userId} = await auth()
//         if(!userId) throw new Error("Unauthorized")
//          const req = await request();

//     // Check rate limit
//     const decision = await aj.protect(req, {
//       userId,
//       requested: 1, // Specify how many tokens to consume
//     });

//     if (decision.isDenied()) {
//       if (decision.reason.isRateLimit()) {
//         const { remaining, reset } = decision.reason;
//         console.error({
//           code: "RATE_LIMIT_EXCEEDED",
//           details: {
//             remaining,
//             resetInSeconds: reset,
//           },
//         });

//         throw new Error("Too many requests. Please try again later.");
//       }

//       throw new Error("Request blocked");
//     }
        
//         const user = await db.user.findUnique({
//             where:{
//                 clerkUserId : userId,

//             }
//         })
//         if(!user){
//             throw new Error("User not found")
//         }
//         const mood = MOODS[data.mood.toUpperCase()]
//         if(!mood) throw new Error("Invalid mood")

//         const moodImageUrl = await getPixabayImage(data.moodQuery)

//         const entry = await db.entry.create({
//             data:{
//                 title : data.title,
//                 content: data.content,
//                 mood : mood.id,
//                 moodScore : mood.score,
//                 moodImageUrl,
//                 userId : user.id,
//                 collectionId : data.collectionId || null
//             }
//         })
//         await db.draft.deleteMany({
//             where :{userId : user.id}
//         })

//         // revalidatePath("/dashboard")
//         return entry
//     } catch (error) {
//         throw new Error(error.message)
//     }
// }
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

    const mood = MOODS[data.mood?.toUpperCase()];
    if (!mood) throw new Error("Invalid mood");

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


export async function getJournalEntries({collectionId , orderBy='desc'}={}) {
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