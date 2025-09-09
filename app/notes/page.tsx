import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
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

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["notes", page, query],
      queryFn: () => fetchNotes(page, 12, query),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient page={page} query={query} />
      </HydrationBoundary>
    );
  } catch (error) {
    console.error("Failed to prefetch notes:", error);

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient page={page} query={query} />
      </HydrationBoundary>
    );
  }
}
