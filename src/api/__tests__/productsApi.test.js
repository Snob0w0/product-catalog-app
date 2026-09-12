import { fetchProducts, fetchProductById, searchProducts } from '../productsApi';

function mockFetchOnce(body, { ok = true, status = 200 } = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
}

describe('productsApi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetchProducts requests the list endpoint with the given limit and skip', async () => {
    mockFetchOnce({ products: [], total: 0 });

    await fetchProducts({ limit: 20, skip: 40 });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=20&skip=40'
    );
  });

  it('fetchProducts defaults to limit=20 and skip=0', async () => {
    mockFetchOnce({ products: [], total: 0 });

    await fetchProducts();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=20&skip=0'
    );
  });

  it('fetchProductById requests the detail endpoint for the given id', async () => {
    mockFetchOnce({ id: 7, title: 'Some product' });

    const result = await fetchProductById(7);

    expect(global.fetch).toHaveBeenCalledWith('https://dummyjson.com/products/7');
    expect(result.title).toBe('Some product');
  });

  it('searchProducts URL-encodes the query', async () => {
    mockFetchOnce({ products: [], total: 0 });

    await searchProducts('red shoes');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products/search?q=red%20shoes&limit=20'
    );
  });

  it('throws a readable error when the response is not ok', async () => {
    mockFetchOnce({}, { ok: false, status: 404 });

    await expect(fetchProductById(999)).rejects.toThrow('Request failed (404)');
  });
});
