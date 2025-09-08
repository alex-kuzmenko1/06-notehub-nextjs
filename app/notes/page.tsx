import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface NotesPageProps {
  searchParams: Promise<{ 
    page?: string;
    query?: string;
  }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  // await searchParams
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.query || "";

  try {
    const result = await fetchNotes(page, 12, query);

    return (
      <NotesClient 
        notes={result.notes} 
        total={result.total} 
        page={page} 
        query={query} 
      />
    );
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    
    return (
      <NotesClient 
        notes={[]} 
        total={0} 
        page={page} 
        query={query} 
      />
    );
  }
}