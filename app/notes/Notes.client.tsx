"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import type { Note } from "@/types/note";

interface NotesClientProps {
  notes: Note[];
  page: number;
  query: string;
}

export default function NotesClient({ notes: initialNotes, page, query }: NotesClientProps) {
  const [search, setSearch] = useState(query);

  // Получаем свежие данные, если нужно
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
    initialData: initialNotes, // используем данные с сервера как начальные
    keepPreviousData: true,
  });

  const notes = data || [];

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
