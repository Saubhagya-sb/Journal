import { getJournalEntries } from "@/actions/journal";
import { getCollection } from "@/actions/collections";
import { JournalFilters } from "./_components/journal-filters";
import DeleteCollectionDialog from "./_components/delete-collection";

export default async function CollectionPage({ params }) {
  const  {collectionId}  = params;
  const entries = await getJournalEntries({ collectionId });
  const collections =
    collectionId !== "unorganized" ? await getCollection() : null;
  const collection = collections?.find((c) => c.id === collectionId);
  console.log(collectionId);
  
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold gradient-title text-white">
            {collectionId === "unorganized"
              ? "Unorganized Entries"
              : collection?.name || "Collection"}
          </h1>
          {collection && (
            <DeleteCollectionDialog
              collection={collection}
              entriesCount={entries.data.entries.length}
            />
          )}
        </div>
        {collection?.description && (
          <h2 className="font-extralight pl-1">{collection?.description}</h2>
        )}
      </div>

      {/* Client-side Filters Component */}
      <JournalFilters entries={entries.data.entries} />
    </div>
  );
}