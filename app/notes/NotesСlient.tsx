"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import type { Note, PaginatedNotes } from "@/types/note";

interface NotesClientProps {
  notes: Note[];
  total: number;
  page: number;
  query: string;
}

export default function NotesClient({ notes: initialNotes, total: initialTotal, page, query }: NotesClientProps) {
  const [search, setSearch] = useState(query);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
    initialData: {
      notes: initialNotes,
      total: initialTotal,
      page,
      perPage: 12,
      totalPages: Math.ceil(initialTotal / 12)
    } as PaginatedNotes,
    placeholderData: { 
      notes: initialNotes,
      total: initialTotal,
      page,
      perPage: 12,
      totalPages: Math.ceil(initialTotal / 12)
    } as PaginatedNotes,
  });

  const notes = data?.notes || initialNotes;

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