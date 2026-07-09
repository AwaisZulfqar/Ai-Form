import { FormEvent, useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";

interface TopicFormProps {
  onSubmit: (topic: string) => Promise<boolean>;
  isGenerating: boolean;
}

const MIN = 3;
const MAX = 100;

// Client-side mirror of the server topic rules (PRD §12.1) for instant UX.
const validate = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return "Topic cannot be empty";
  if (trimmed.length < MIN) return `Topic must be at least ${MIN} characters`;
  if (trimmed.length > MAX) return `Topic must be at most ${MAX} characters`;
  return null;
};

const TopicForm = ({ onSubmit, isGenerating }: TopicFormProps) => {
  const [topic, setTopic] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validate(topic);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    const ok = await onSubmit(topic.trim());
    if (ok) setTopic(""); // keep input on failure so the user can retry (PRD §13)
  };

  return (
    <Card as="section">
      <h1 className="text-h2 text-on-surface">Start a Discussion</h1>
      <p className="mt-1 text-body-sm text-secondary">
        Enter a topic and let AI draft a discussion-starter post.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Input
            name="topic"
            placeholder="e.g. The future of remote work"
            value={topic}
            maxLength={MAX + 20}
            disabled={isGenerating}
            error={error ?? undefined}
            onChange={(event) => {
              setTopic(event.target.value);
              if (error) setError(null);
            }}
          />
        </div>
        <Button type="submit" loading={isGenerating}>
          ✦ Generate
        </Button>
      </form>
    </Card>
  );
};

export default TopicForm;
