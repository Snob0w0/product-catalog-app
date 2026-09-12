import { useCallback, useEffect, useState } from 'react';
import { fetchProductById } from '../api/productsApi';

export function useProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'success'
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await fetchProductById(productId);
      setProduct(data);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  return { product, status, error, retry: load };
}
