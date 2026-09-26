import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);

      if (!stored) {
        return typeof initialValue === "function"
          ? initialValue()
          : initialValue;
      }

      return JSON.parse(stored);
    } catch (error) {
      console.warn(`Unable to read localStorage key: ${key}`, error);
      return typeof initialValue === "function"
        ? initialValue()
        : initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Unable to save localStorage key: ${key}`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
