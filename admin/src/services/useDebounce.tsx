import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  // État pour stocker la valeur décalée dans le temps
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Déclencher un timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Effacer le timer lors du nettoyage ou si `value` ou `delay` change
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
