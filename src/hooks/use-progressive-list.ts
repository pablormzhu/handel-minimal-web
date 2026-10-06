import { useEffect, useRef, useState } from "react";

const BATCH = 24;
// How many items each list had revealed, so returning with "back" restores the same
// length and scroll position. Kept in memory only: a full reload starts at one batch.
const revealed = new Map<string, number>();

/**
 * Renders a long list in batches: the server and first paint get one batch, and the
 * next batch is appended each time the (zero-size) sentinel nears the viewport.
 * `key` identifies the list and its filters; changing it starts again from one batch.
 */
export function useProgressiveList<T>(items: readonly T[], key: string) {
  const [state, setState] = useState(() => ({ key, count: revealed.get(key) ?? BATCH }));
  const count = state.key === key ? state.count : (revealed.get(key) ?? BATCH);
  if (state.key !== key) setState({ key, count });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = count < items.length;

  useEffect(() => {
    revealed.set(key, count);
  }, [key, count]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!hasMore || !sentinel) return;
    // Re-observing after every batch fires again while the sentinel is still near
    // the viewport, so batches keep coming until it is out of range.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState((s) => (s.key === key ? { key, count: s.count + BATCH } : s));
        }
      },
      { rootMargin: "0px 0px 1200px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [key, count, hasMore]);

  return { visible: items.slice(0, count), hasMore, sentinelRef };
}
