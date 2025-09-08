export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNotes {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}