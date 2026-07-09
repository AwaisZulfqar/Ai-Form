interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Avatar = ({ name, src, size = 32 }: AvatarProps) => {
  const dimension = { width: size, height: size };

  if (src) {
    return (
      <img src={src} alt={name} style={dimension} className="shrink-0 rounded-full object-cover" />
    );
  }

  return (
    <span
      style={dimension}
      aria-label={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-pink-700 text-caption font-semibold text-on-primary"
    >
      {initials(name) || "?"}
    </span>
  );
};

export default Avatar;
