"use client"
import React, { useState,useEffect } from 'react'
import 'react-quill-new/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { Controller, useForm } from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod"
import { journalSchema } from '@/app/lib/schema';
import { BarLoader } from 'react-spinners';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOODS , getMoodById } from '@/app/lib/moods';
import { Button } from '@/components/ui/button';
import { BookCheck, Brush, CloudUpload } from 'lucide-react';
import useFetch from '@/app/hooks/useFetch';
import { createJournalEntry, getDraft, getJournalEntry, saveDraft, updateJournalEntry } from '@/actions/journal';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { createCollection, getCollection } from '@/actions/collections';
import CollectionForm from '@/components/collection-form';
const ReactQuill = dynamic(()=> import("react-quill-new"),{ssr:false})


const JournalEntryPage = () => {

  const [isDialougeBoxOpen , setIsDialogBoxOpen] = useState(false)
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const [isEditMode , setIsEditMode] = useState(false)

  const {
    loading : entryLoading,
    data : existingEntry,
    fn : fetchEntry,
  } = useFetch(getJournalEntry)
 
  const {
    loading : draftLoading,
    data : draftData,
    fn : fetchDraft
  } = useFetch(getDraft)

  const {
    loading : savingLoading,
    fn : saveDraftFn,
    data : savedDraft
  } = useFetch(saveDraft)

  const {
  loading: collectionsLoading,
  data: collections,
  fn: fetchCollections
} = useFetch(async () => {
  const res = await fetch("/api/collections");
  return res.json();
});
  const {
  loading: createCollectionLoading,
  fn: createCollectionFn,
  data: createdCollection
} = useFetch(async (data) => {
  const res = await fetch("/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
});

  

  const {register,handleSubmit,control , formState:{errors , isDirty},getValues,watch,setValue , reset}=useForm(
    {
      resolver : zodResolver(journalSchema),
      defaultValues :{
        title : "",
        content: "",
        mood : "",
        collectionId : ""
      }
    }
  )
  
  const selectedMood = watch("mood")
   const {
    loading: createLoading,
    fn: createEntryFn,
    data: createdResult,
  } = useFetch(async (data) => {
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  });
//   const {
//   loading: createLoading,
//   fn: createEntryFn,
//   data: createdResult,
// } = useFetch(createJournalEntry);

const {
  loading: updateLoading,
  fn: updateEntryFn,
  data: updatedResult,
} = useFetch(updateJournalEntry);


  
//  useEffect(() => {
//   if (actionResult && !actionLoading) {
//     if(!isEditMode){
//       saveDraftFn({title : "" , content : "" , mood : ""})
//     }
//     toast.success(`Entry ${isEditMode ? "updated" : "created"} successfully !!`)
//     router.push("/dashboard");
//   }
// }, [actionResult, actionLoading]);
useEffect(() => {
  if (createdResult && !createLoading) {
    saveDraftFn({ title: "", content: "", mood: "" });
    toast.success("Entry created successfully!!");
    router.push("/dashboard");
  }
}, [createdResult, createLoading]);

useEffect(() => {
  if (updatedResult && !updateLoading) {
    toast.success("Entry updated successfully!!");
    router.push("/dashboard");
  }
}, [updatedResult, updateLoading]);


  const router = useRouter()
  
  const onSubmitHandler = handleSubmit((data)=>{
      const mood = getMoodById(data.mood)
      // actionfn({
      //   ...data,
      //   moodScore : mood.score,
      //   moodQuery : mood.pixabayQuery,
      //   ...(isEditMode && {id : editId}),
      // })
      const payload = {
  ...data,
  moodScore: mood.score,
  moodQuery: mood.pixabayQuery,
};

if (isEditMode) {
  updateEntryFn({ id: editId, ...payload });
} else {
  createEntryFn(payload);
}

      
  }) 
  const handleCreateCollection = async(data)=>{
      await createCollectionFn(data)
  }
  const formdata = watch()
  const handleSaveDraft = async()=>{
      if(!isDirty){
        toast.error("No changes to save")
        return
      }
      
      await saveDraftFn(formdata)
      
  }
  useEffect(()=>{
    if(savedDraft?.success && !savingLoading){
      toast.success("Draft Saved Successfully")
    }
  },[savingLoading , savedDraft])
  useEffect(() => {
    if (createdCollection) {
      setIsDialogBoxOpen(false);
      fetchCollections();
      setValue("collectionId", createdCollection.id);
      toast.success(`Collection ${createdCollection.name} created!`);
    }
  }, [createdCollection]);
  useEffect(()=>{
    fetchCollections()
    if(editId){
      setIsEditMode(true)
      fetchEntry(editId)
    }
    else{
      setIsEditMode(false)
      fetchDraft()
    }
  },[editId])


  useEffect(()=> {
    if(isEditMode && existingEntry){
      reset({
        title : existingEntry.title || "",
        content : existingEntry.content || "",
        mood : existingEntry.mood || "",
        collectionId : existingEntry.collectionId || "",
      })
    }
    else if(draftData?.success && draftData?.data){
        reset({
          title : draftData.data.title || "",
          content : draftData.data.content || ""
        })
      }
     else{
      reset({
        title : "",
        content : "",
        mood : "",
        collectionId : ""
      })
     } 
    
  } , [draftData,isEditMode,existingEntry])


  // const isLoading = actionLoading || collectionsLoading || entryLoading || draftLoading || savingLoading
  const isLoading =
  createLoading || updateLoading || collectionsLoading || entryLoading || draftLoading || savingLoading;

  return (
    <div className='py-8'>
      <form className='space-y-2 mx-auto' onSubmit={onSubmitHandler}>
        <h1 className='text-5xl font-black md:text-6xl text-yellow-300'>{isEditMode ? "Edit Entry" : "What's on your mind ?"}</h1>
        {isLoading && <BarLoader color='orange' width={"100%"}/>}

        <div className='py-6'>
          <label className='text-white text-sm font-medium'>Title:</label>
          <Input {...register("title")} placeholder="Give your entry a title..." className={`py-5 text-white md:text-md ${errors.title?"border-red-600":""}`}/>
          {errors.title && (
            <p className='text-red-500 text-sm'>{errors.title.message}</p>
          )}
        </div>
        <div className='space-y-2'>
          <label className='text-white text-sm font-medium'>How are you feeling ?</label>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={errors.mood ? "border-red-500 w-full text-white" : "w-full text-white"}>
                  <SelectValue placeholder="Select a mood..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MOODS).map((mood) => (
                    <SelectItem key={mood.id} value={mood.id}>
                      <span className="flex items-center gap-2 ">
                        {mood.emoji} {mood.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.mood && (
            <p className='text-red-500 text-sm'>{errors.mood.message}</p>
          )}
        </div>
          <div className="space-y-2 mx-auto pt-6">
          <label className="text-sm font-medium text-white">
            {getMoodById(selectedMood)?.prompt ?? "Write your thoughts..."}
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                className='quill-white text-white'
                readOnly={isLoading}
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>
          <div>
            <label className='text-white font-medium text-sm'>Add to Collections(optional)</label>
            <Controller
            name="collectionId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={(value)=>{
                if(value==="new"){
                  setIsDialogBoxOpen(true)
                }
                else{
                  field.onChange(value)
                }
              
              }} value={field.value}>
                <SelectTrigger className="w-full text-white">
                  <SelectValue placeholder="choose a collection..." />
                </SelectTrigger>
                <SelectContent>
                  {collections?.map((collection)=>{
                    return <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  })}
                  <SelectItem value="new">
                    <span>
                        + Create New Collection
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          </div>
          <div className='space-x-4 flex'>
            {!isEditMode && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={savingLoading || !isDirty}
            >
              {savingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save as Draft
            </Button>
          )}
            <Button variant={"journal"} type="submit" disabled={createLoading || updateLoading}>
                {isEditMode ? <span className='flex gap-2'>Update <CloudUpload/></span>: (<span className='flex gap-2'>Publish <BookCheck/> </span>)}
            </Button>
            {isEditMode && existingEntry && (
               <Button
              onClick={(e) => {
                e.preventDefault();
                router.push(`/journal/${existingEntry.id}`);
              }}
              variant="destructive"
            >
              Cancel
            </Button>
            )}
          </div>
      </form>
      <CollectionForm 
        loading = {createCollectionLoading}
        open = {isDialougeBoxOpen}
        setOpen = {setIsDialogBoxOpen}
        onSuccess = {handleCreateCollection}
      />
    </div>
  )
}

export default JournalEntryPage
