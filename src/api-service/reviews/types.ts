export type BookReview = {
  id: number;
  isbn: string;
  user_id: number;
  name: string;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
};

export type BookReviewPayload = {
  isbn: string;
  rating: number;
  content: string;
};

export type BookReviewResponse = {
  id: number;
  user_id: number;
  name: string;
  isbn: string;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
};
