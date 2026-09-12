import { apiGet } from './client';

export function fetchProducts({ limit = 20, skip = 0 } = {}) {
  return apiGet(`/products?limit=${limit}&skip=${skip}`);
}

export function fetchProductById(id) {
  return apiGet(`/products/${id}`);
}

export function searchProducts(query, { limit = 20 } = {}) {
  return apiGet(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}
