import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const PAGE_SIZE = 12;

export default async function NotesPage() {
  const queryClient = new QueryClient();

  const page = 1;
  const query = "";

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, query],
    queryFn: () => fetchNotes(page, PAGE_SIZE, query),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient notes={notes} page={page} query={query} />
{/* ✅ передаємо пропси */}
    </HydrationBoundary>
  );
}
