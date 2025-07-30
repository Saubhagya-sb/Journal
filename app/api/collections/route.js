// app/api/collections/route.ts
import { NextResponse } from "next/server";
import { createCollection, getCollection } from "@/actions/collections";

export async function GET() {
  const collections = await getCollection();
  return NextResponse.json(collections);
}

export async function POST(req) {
  const body = await req.json();
  const collection = await createCollection(body);
  return NextResponse.json(collection);
}
