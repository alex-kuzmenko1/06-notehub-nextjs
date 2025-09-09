"use client";

import * as React from "react"; 
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import type { PaginatedNotes } from "@/types/pagination";


function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

interface NotesClientProps {
  page: number;
  query: string;
}

export default function NotesClient({ page: initialPage, query }: NotesClientProps) {
  const [search, setSearch] = useState(query);
  const [page, setPage] = useState(initialPage);
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useQuery<PaginatedNotes, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, 12, debouncedSearch),
    staleTime: 1000 * 60,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
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
      {error && <p>Failed to load notes: {error.message}</p>}

      <NoteList notes={notes} />

      {/* Пагінація */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
        <button onClick={handlePrevPage} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
