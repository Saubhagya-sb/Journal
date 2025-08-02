import { getJournalEntries } from "@/actions/journal";
import { getCollection } from "@/actions/collections";
import { JournalFilters } from "./_components/journal-filters";
import DeleteCollectionDialog from "./_components/delete-collection";

export default async function CollectionPage({ params }) {
  const { collectionid } = await params;
//   const entries = await getJournalEntries({ collectionid });
  const collections =
    collectionid !== "unorganized" ? await getCollection() : null;
  const collection = collections?.find((c) => c.id === collectionid);
  console.log(collection);
  const name = collection?.name
  console.log(collectionid);
  console.log(collection?.name);
  
  
 
  
  const entries = await getJournalEntries({ collectionName : name || "unorganized" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold gradient-title text-white">
            {collectionid === "unorganized" || collectionid==="Unorganized%20Entries"
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