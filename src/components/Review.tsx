import { useState } from "react";
import { Star, Loader2, MessageSquareOff, AlertCircle } from "lucide-react";
import {
  useGetBookReviewQuery,
  useCreateBookReviewMutation,
  useDeleteBookReviewMutation,
} from "@/api-service/reviews/review.api";
import type { BookReview } from "@/api-service/reviews/types";
import { MdDeleteOutline } from "react-icons/md";


// NOTE: assumes BookReview has a `user_id: number` field so we can tell
// which review (if any) belongs to the current user. Add it to your
// BookReview / BookReviewResponse types if it isn't there yet.

type BookReviewsProps = {
  isbn: string;
  // id of the logged-in user, e.g. from useAppSelector(selectCurrentUserId) or your auth hook
  currentUserId: number;
};

export default function BookReviews({ isbn, currentUserId }: BookReviewsProps) {
  const {
    data: reviews,
    isLoading,
    isError,
    refetch,
  } = useGetBookReviewQuery(isbn);

  const existingReview = reviews?.find((r) => r.user_id === currentUserId);

  return (
    <section className="w-fullmx-auto space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
        <p className="text-sm text-gray-500">
          {reviews?.length
            ? `${reviews.length} review${reviews.length === 1 ? "" : "s"}`
            : "Be the first to share your thoughts on this book."}
        </p>
      </div>

      <ReviewForm isbn={isbn} existingReview={existingReview} />

      <div className="border-t border-gray-200 pt-6">
        {isLoading && <ReviewsSkeleton />}

        {isError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Couldn't load reviews.</span>
            <button
              onClick={() => refetch()}
              className="ml-auto font-medium underline underline-offset-2 hover:text-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && reviews?.length === 0 && (
          <div className="flex flex-col items-center gap-2 text-center py-10 text-gray-400">
            <MessageSquareOff className="w-6 h-6" />
            <p className="text-sm">No reviews yet</p>
          </div>
        )}

        {!isLoading && !isError && reviews && reviews.length > 0 && (
          <ul className="space-y-5">
            {[...reviews]
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ReviewItem({ review }: { review: BookReview }) {
  const date = new Date(review.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <li className="border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-700">{review.name}</p>
        <div className="flex items-center justify-between">
            
            <StarRating value={review.rating} readOnly size={16} />
            <time className="text-xs text-gray-400">{date}</time>
        </div>
        <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {review.content}
        </p>
    </li>
  );
}

function ReviewForm({
  isbn,
  existingReview,
}: {
  isbn: string;
  existingReview?: BookReview;
}) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [createBookReview, { isLoading }] = useCreateBookReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteBookReviewMutation();
  const [error, setError] = useState<string | null>(null);

  const canSubmit = rating > 0 && content.trim().length > 0 && !isLoading;

  const handleDelete = async () => {
    if (!existingReview) return;

    console.log("Deleting review with id:", existingReview);

    setError(null);
    try {
      await deleteReview({ reviewId: existingReview.id }).unwrap();
    } catch {
      setError("Couldn't delete your review. Please try again.");
    }
  }

  // Already reviewed this book — show it instead of the form, don't let a
  // second one get created.
  if (existingReview) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Your review
          </span>
          <StarRating value={existingReview.rating} readOnly size={18} />
        </div>
        
         <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {existingReview.content}
            </p>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                <MdDeleteOutline size={20}/>
            </button>
        </div>
        <p className="text-xs text-gray-400 pt-1">
          You can only review a book once.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    try {
      await createBookReview({ isbn, rating, content: content.trim() }).unwrap();
      setRating(0);
      setContent("");
    } catch {
      setError("Couldn't submit your review. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Your rating</span>
        <StarRating value={rating} onChange={setRating} size={22} />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What did you think of this book?"
        rows={3}
        maxLength={2000}
        className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{content.length}/2000</span>
        <div className="flex items-center gap-3">
          {error && <span className="text-xs text-red-600">{error}</span>}
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Post review
          </button>
        </div>
      </div>
    </form>
  );
}

function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 20,
}: {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(null)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
        >
          <Star
            width={size}
            height={size}
            className={
              star <= display
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <ul className="space-y-5 animate-pulse">
      {[0, 1].map((i) => (
        <li key={i} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}