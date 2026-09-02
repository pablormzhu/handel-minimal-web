export function sentenceCase(value: string): string {
  const lowered = value.toLowerCase().trim();
  if (!lowered) return "";
  return lowered.charAt(0).toUpperCase() + lowered.slice(1);
}

export function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export function formatFeature(feature: string): { label: string; value: string } | null {
  const trimmed = feature.trim();
  if (!trimmed) return null;

  const separatorIndex = trimmed.indexOf(":");
  if (separatorIndex === -1) {
    return { label: "", value: sentenceCase(trimmed) };
  }

  const label = trimmed.slice(0, separatorIndex).trim();
  const value = trimmed.slice(separatorIndex + 1).trim();

  return {
    label: sentenceCase(label),
    value: sentenceCase(value),
  };
}
