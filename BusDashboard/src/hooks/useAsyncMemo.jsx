import { useEffect, useState } from 'react';

export default function useAsyncMemo(fn, deps = []) {
  const [value, setValue] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fn()
      .then(setValue)
      .then(() => setLoading(false));
  }, deps);

  return [value, loading];
}
