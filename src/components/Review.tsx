import { useState } from "react";
import {
  Star,
  Loader2,
  MessageSquareOff,
  AlertCircle,
  PenLine,
} from "lucide-react";
import {
  useGetBookReviewQuery,
  useCreateBookReviewMutation,
  useDeleteBookReviewMutation,
} from "@/api-service/reviews/review.api";
import type { BookReview } from "@/api-service/reviews/types";
import { MdDeleteOutline } from "react-icons/md";

type BookReviewsProps = {
  isbn: string;
  currentUserId: number;
};

export default function BookReviews({ isbn, currentUserId }: BookReviewsProps) {
  const {
    data: reviews,
    isLoading,
    isError,
    refetch,
  } = useGetBookReviewQuery(isbn);

  const [showForm, setShowForm] = useState(false);
  const existingReview = reviews?.find((r) => r.user_id === currentUserId);

  return (
    <section className="w-full flex flex-col items-start gap-8 pt-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#191C1D]">Reviews</h2>
        {!existingReview && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F3F4F5] border border-[#7F7662] rounded-xl text-[#191C1D] text-base hover:bg-[#EAEBEC] transition-colors"
          >
            <PenLine size={14} className="text-[#191C1D]" />
            {showForm ? "Cancel" : "Write a review"}
          </button>
        )}
      </div>

      {/* Average summary */}
      {!isLoading && !isError && reviews && reviews.length > 0 && (
        <RatingSummary reviews={reviews} />
      )}

      {/* Write / existing review */}
      {(showForm || existingReview) && (
        <ReviewForm
          isbn={isbn}
          existingReview={existingReview}
          onSubmitted={() => setShowForm(false)}
        />
      )}

      {/* Review list */}
      <div className="w-full flex flex-col gap-6">
        {isLoading && <ReviewsSkeleton />}

        {isError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
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
          <div className="flex flex-col items-center gap-2 text-center py-10 text-[#575E70]">
            <MessageSquareOff className="w-6 h-6" />
            <p className="text-sm">No reviews yet</p>
          </div>
        )}

        {!isLoading && !isError && reviews && reviews.length > 0 && (
          <ul className="flex flex-col gap-6">
            {[...reviews]
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
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

function RatingSummary({ reviews }: { reviews: BookReview[] }) {
  const total = reviews.length;
  const average = total
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
    : 0;

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="w-full flex items-center gap-8 p-0 bg-[#F3F4F5] rounded-xl">
      {/* Left: big number */}
      <div className="flex flex-col items-center gap-1 pr-8 border-r border-[#D0C6AE] shrink-0">
        <span className="text-5xl font-bold leading-none text-[#191C1D]">
          {average.toFixed(1)}
        </span>
        <StarRating
          value={Math.round(average)}
          readOnly
          size={20}
          color="#735C00"
        />
        <span className="text-xs font-semibold tracking-[0.6px] uppercase text-[#575E70] whitespace-nowrap">
          {total} review{total === 1 ? "" : "s"}
        </span>
      </div>

      {/* Right: distribution bars */}
      <div className="flex-1 flex flex-col gap-2">
        {counts.map(({ star, count }) => {
          const pct = total ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-4">
              <span className="w-4 text-xs font-semibold tracking-[0.6px] text-[#191C1D]">
                {star}
              </span>
              <div className="flex-1 h-2 bg-[#E7E8E9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#735C00] rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Individual review card ---------------- */

function ReviewItem({ review }: { review: BookReview }) {
  const date = new Date(review.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <li className="w-full flex flex-col gap-2 p-6 bg-white border border-[#D0C6AE]/50 rounded-xl">
      <div className="w-full flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#D0C6AE] bg-[#F3F4F5] text-sm font-semibold text-[#575E70] shrink-0">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#191C1D]">
              {review.name}
            </span>
          </div>
        </div>
        <time className="text-xs font-semibold tracking-[0.6px] text-[#575E70] whitespace-nowrap">
          {date}
        </time>
      </div>

      <StarRating value={review.rating} readOnly size={18} color="#735C00" />

      <p className="text-sm leading-[23px] text-[#4D4635] whitespace-pre-wrap">
        {review.content}
      </p>
    </li>
  );
}

/* ---------------- Form ---------------- */

function ReviewForm({
  isbn,
  existingReview,
  onSubmitted,
}: {
  isbn: string;
  existingReview?: BookReview;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [createBookReview, { isLoading }] = useCreateBookReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] =
    useDeleteBookReviewMutation();
  const [error, setError] = useState<string | null>(null);

  const canSubmit = rating > 0 && content.trim().length > 0 && !isLoading;

  const handleDelete = async () => {
    if (!existingReview) return;
    setError(null);
    try {
      await deleteReview({ reviewId: existingReview.id }).unwrap();
    } catch {
      setError("Couldn't delete your review. Please try again.");
    }
  };

  if (existingReview) {
    return (
      <div className="w-full flex flex-col gap-2 p-6 bg-[#F3F4F5] rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#191C1D]">
            Your review
          </span>
          <StarRating
            value={existingReview.rating}
            readOnly
            size={18}
            color="#735C00"
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-[#4D4635] whitespace-pre-wrap leading-[23px]">
            {existingReview.content}
          </p>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-[#7F7662] hover:text-red-600 disabled:opacity-50 shrink-0"
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
        <p className="text-xs text-[#575E70] pt-1">
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
      await createBookReview({
        isbn,
        rating,
        content: content.trim(),
      }).unwrap();
      setRating(0);
      setContent("");
      onSubmitted();
    } catch {
      setError("Couldn't submit your review. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-3 p-6 bg-[#F3F4F5] border border-[#D0C6AE]/50 rounded-xl"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#191C1D]">Your rating</span>
        <StarRating
          value={rating}
          onChange={setRating}
          size={22}
          color="#735C00"
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What did you think of this book?"
        rows={3}
        maxLength={2000}
        className="w-full resize-none rounded-md border border-[#D0C6AE] bg-white px-3 py-2 text-sm text-[#191C1D] placeholder:text-[#575E70] focus:outline-none focus:ring-2 focus:ring-[#7F7662]/20 focus:border-[#7F7662]"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#575E70]">{content.length}/2000</span>
        <div className="flex items-center gap-3">
          {error && <span className="text-xs text-red-600">{error}</span>}
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-[#191C1D] px-4 py-2 text-sm font-medium text-white hover:bg-[#33302A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
  color = "#735C00",
}: {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  color?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center gap-1">
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
            style={
              star <= display
                ? { fill: color, color }
                : { fill: "transparent", color: "#D0C6AE" }
            }
          />
        </button>
      ))}
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <ul className="flex flex-col gap-6 animate-pulse">
      {[0, 1].map((i) => (
        <li
          key={i}
          className="p-6 bg-white border border-[#D0C6AE]/50 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-[#E7E8E9] rounded" />
            <div className="h-3 w-16 bg-[#E7E8E9] rounded" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full bg-[#E7E8E9] rounded" />
            <div className="h-3 w-2/3 bg-[#E7E8E9] rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}
