import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import DeleteDialog from "./_components/delete-dialog";
import EditButton from "./_components/edit-button";
import { getMoodById } from "@/app/lib/moods";
import { getJournalEntry } from "@/actions/journal";
import { ArrowLeftFromLine } from "lucide-react";

export default async function JournalEntryPage({ params }) {
  const { id } = await params;
  const entry = await getJournalEntry(id);
  const mood = getMoodById(entry.mood);
  

  return (
    <>
        <div >
         <Link href={`/collection/${entry.collection?.id || `Unorganized Entries`}`} className="text-sm text-orange-400 hover:text-orange-600 cursor-pointer">
                <div className="flex gap-2"><ArrowLeftFromLine/>
                    <span className="mt-0.5">Back to {entry.collection?.name || "Unorganized Entries"}</span>  
                </div>
         </Link>
        </div>
      {/* Header with Mood Image */}
      {entry.moodImageUrl && (
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src={entry.moodImageUrl}
            alt="Mood visualization"
            className="object-contain"
            fill
            priority
          />
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-5xl font-bold gradient-title text-white">
                  {entry.title}
                </h1>
              </div>
              <p className="text-yellow-400">
                Created {format(new Date(entry.createdAt), "PPP")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <EditButton entryId={id} />
              <DeleteDialog entryId={id} />
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2">
            {entry.collection && (
              <Link href={`/collection/${entry.collection.id}`}>
                <Badge>Collection: {entry.collection.name}</Badge>
              </Link>
            )}
            <Badge
              variant="outline"
              className="text-white"
              
            >
              Feeling {mood?.label}
            </Badge>
          </div>
        </div>

        <hr />

        {/* Content Section */}
        <div className="ql-snow">
          <div
            className="ql-editor text-white"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </div>

        {/* Footer */}
        <div className="text-sm text-yellow-400 pt-4 border-t">
          Last updated {format(new Date(entry.updatedAt), "PPP 'at' p")}
        </div>
      </div>
    </>
  );
}