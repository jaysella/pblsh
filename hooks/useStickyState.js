import { useState, useEffect } from "react";
import { useHasMounted } from "./useHasMounted";

export function useStickyState(defaultValue, key) {
  const hasMounted = useHasMounted();

  // if (!hasMounted) return null;

  const [value, setValue] = useState(() => {
    const stickyValue = localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
