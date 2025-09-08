import { fetchNotes } from "@/lib/api";
import NotesClient from "./NotesСlient";

interface NotesPageProps {
  searchParams: {
    page?: string;
    query?: string;
  };
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || "";

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