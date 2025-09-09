import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface NotesPageProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.query || "";

  try {
    const result = await fetchNotes(page, 12, query);

    return (
      <NotesClient
        notes={result.notes}
        page={page}
        query={query}
        totalPages={result.totalPages}
      />
    );
  } catch (error) {
    console.error("Failed to fetch notes:", error);

    return (
      <NotesClient
        notes={[]}
        page={page}
        query={query}
        totalPages={0}
      />
    );
  }
}
