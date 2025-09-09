"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import type { Note } from "@/types/note";
import type { PaginatedNotes } from "@/types/pagination";

interface NotesClientProps {
  notes: Note[];
  page: number;
  query: string;
  totalPages: number;
}

export default function NotesClient({
  notes: initialNotes,
  page,
  query,
  totalPages,
}: NotesClientProps) {
  const [search, setSearch] = useState(query);

  const { data, isLoading, error } = useQuery<PaginatedNotes>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
    initialData: {
      notes: initialNotes,
      page,
      totalPages,
    },
    placeholderData: {
      notes: initialNotes,
      page,
      totalPages,
    },
  });

  const notes = data?.notes ?? initialNotes;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        placeholder="Search notes..."
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      {isLoading && <p>Loading notes...</p>}
      {error && <p>Failed to load notes.</p>}

      <NoteList notes={notes} page={page} query={search} />
    </div>
  );
}
