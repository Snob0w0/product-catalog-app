import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProducts, searchProducts } from '../api/productsApi';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;

export function useProducts() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'success'
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isSearching = query.trim().length > 0;

  // Bumped on every new request so a slow, superseded response can recognize
  // it lost the race and quietly drop itself instead of overwriting fresher data.
  const requestId = useRef(0);

  const loadFirstPage = useCallback(async (searchTerm, { silent = false } = {}) => {
    const thisRequest = ++requestId.current;
    if (!silent) {
      setStatus('loading');
      setError(null);
    }

    try {
      const data = searchTerm
        ? await searchProducts(searchTerm)
        : await fetchProducts({ limit: PAGE_SIZE, skip: 0 });

      if (thisRequest !== requestId.current) return;

      setItems(data.products);
      setTotal(data.total);
      setSkip(data.products.length);
      setStatus('success');
    } catch (err) {
      if (thisRequest !== requestId.current) return;
      if (!silent) {
        setError(err.message);
        setStatus('error');
      }
    }
  }, []);

  // Debounced search: every keystroke resets the timer, so a network request
  // only fires once the user pauses typing for SEARCH_DEBOUNCE_MS.
  useEffect(() => {
    const trimmed = query.trim();
    const timer = setTimeout(() => {
      loadFirstPage(trimmed);
    }, trimmed ? SEARCH_DEBOUNCE_MS : 0);

    return () => clearTimeout(timer);
  }, [query, loadFirstPage]);

  const loadMore = useCallback(async () => {
    if (isSearching || status !== 'success' || loadingMore || skip >= total) return;

    const thisRequest = requestId.current;
    setLoadingMore(true);
    try {
      const data = await fetchProducts({ limit: PAGE_SIZE, skip });
      if (thisRequest !== requestId.current) return;
      setItems((prev) => [...prev, ...data.products]);
      setSkip((prev) => prev + data.products.length);
    } catch (err) {
      // Pagination failures stay silent: the list the user already has keeps
      // working, they just stop scrolling further. A toast is the natural
      // next step here (see README TODOs).
    } finally {
      setLoadingMore(false);
    }
  }, [isSearching, status, loadingMore, skip, total]);

  const retry = useCallback(() => {
    loadFirstPage(query.trim());
  }, [loadFirstPage, query]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadFirstPage(query.trim(), { silent: true });
    setRefreshing(false);
  }, [loadFirstPage, query]);

  return {
    items,
    status,
    error,
    query,
    setQuery,
    isSearching,
    hasMore: !isSearching && skip < total,
    loadMore,
    loadingMore,
    retry,
    refreshing,
    refresh,
  };
}
