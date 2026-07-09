import { FormEvent, useState } from "react";
import Button from "../common/Button";

interface CommentFormProps {
  onSubmit: (text: string) => Promise<unknown>;
}

const MAX = 500;

const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Comment cannot be empty");
      return;
    }
    if (trimmed.length > MAX) {
      setError(`Comment must be at most ${MAX} characters`);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          if (error) setError(null);
        }}
        placeholder="Add a comment…"
        rows={3}
        maxLength={MAX + 50}
        disabled={submitting}
        aria-invalid={error ? true : undefined}
        className={`w-full resize-y rounded-lg border bg-surface px-3 py-2 text-body-sm text-on-surface placeholder:text-secondary ${
          error ? "border-error" : "border-border"
        }`}
      />
      <div className="flex items-center justify-between gap-3">
        {error ? (
          <span className="text-body-sm text-error">{error}</span>
        ) : (
          <span className="text-caption text-secondary">
            {text.trim().length}/{MAX}
          </span>
        )}
        <Button type="submit" size="sm" loading={submitting}>
          Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
