export type ReviewResponse = {
  id: number;
  isbn: string;
  user_id: number;
  content: string;
  rating: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};
