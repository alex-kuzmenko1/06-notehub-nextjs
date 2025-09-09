"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import type { PaginatedNotes } from "@/types/pagination";
import type { Note } from "@/types/note";


function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function NotesClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useQuery<PaginatedNotes, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, 12, debouncedSearch),
    staleTime: 1000 * 60,
  
    placeholderData: { notes: [], totalPages: 1, page: 1 },
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); 
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <div>
      {}
      <SearchBox value={search} onChange={handleSearchChange} />

      {}
      {isLoading && <p>Loading notes...</p>}
      {error && <p>Failed to load notes: {error.message}</p>}

      {}
      <NoteList notes={notes} />

      {}
      <Pagination
        pageCount={totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
      />

      {}
      <button onClick={() => setIsModalOpen(true)}>Create Note</button>

      {}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
