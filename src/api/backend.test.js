import { apiFetch, getProduct, getProducts, login, postReview } from './backend';

function fakeResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  };
}

beforeEach(() => {
  global.fetch = jest.fn();
});

const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

test('GET has no body or Authorization and returns parsed JSON', async () => {
  fetch.mockResolvedValue(fakeResponse(200, { items: [{ id: 1 }] }));

  const data = await apiFetch('/api/equipment');

  expect(data).toEqual({ items: [{ id: 1 }] });
  const [url, options] = fetch.mock.calls[0];
  expect(url).toBe(`${API_URL}/api/equipment`);
  expect(options.method).toBe('GET');
  expect(options.body).toBeUndefined();
  expect(options.headers.Authorization).toBeUndefined();
});

test('equipment list and detail use the Go payload fields and product adapter', async () => {
  fetch
    .mockResolvedValueOnce(fakeResponse(200, {
      items: [{
        id: 13,
        title: 'GeForce RTX 4060',
        titleTh: 'NVIDIA',
        genre: 'การ์ดจอ',
        year: 2023,
        detail: 'รายละเอียด',
        poster: 'https://example.com/rtx.jpg',
      }],
    }))
    .mockResolvedValueOnce(fakeResponse(200, {
      id: 13,
      title: 'GeForce RTX 4060',
      titleTh: 'NVIDIA',
      genre: 'การ์ดจอ',
      myVote: 8,
      inWishlist: true,
    }));

  const [product] = await getProducts();
  const detail = await getProduct(13, 'abc123');

  expect(product).toMatchObject({
    name: 'GeForce RTX 4060',
    brand: 'NVIDIA',
    category: 'การ์ดจอ',
    releaseYear: 2023,
    description: 'รายละเอียด',
    imageUrl: 'https://example.com/rtx.jpg',
  });
  expect(detail.myVote).toBe(8);
  expect(detail.inWishlist).toBe(true);
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([
    `${API_URL}/api/equipment`,
    `${API_URL}/api/equipment/13`,
  ]);
  expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer abc123');
});

test('authenticated requests use Bearer authorization and JSON bodies', async () => {
  fetch.mockResolvedValue(fakeResponse(201, { id: 7 }));

  await postReview(13, 'อุปกรณ์ชิ้นนี้ใช้งานได้ดีมาก', 'abc123');

  const [url, options] = fetch.mock.calls[0];
  expect(url).toBe(`${API_URL}/api/equipment/13/reviews`);
  expect(options.method).toBe('POST');
  expect(options.headers.Authorization).toBe('Bearer abc123');
  expect(options.headers['Content-Type']).toBe('application/json');
  expect(options.body).toBe(JSON.stringify({ text: 'อุปกรณ์ชิ้นนี้ใช้งานได้ดีมาก' }));
});

test('204 returns null without reading a response body', async () => {
  const res = fakeResponse(204, null);
  res.json = jest.fn();
  fetch.mockResolvedValue(res);

  const data = await apiFetch('/api/me/wishlist/1', { method: 'DELETE', token: 'abc' });

  expect(data).toBeNull();
  expect(res.json).not.toHaveBeenCalled();
});

test('server errors expose the backend message, status, and error code', async () => {
  fetch.mockResolvedValue(fakeResponse(401, {
    error: { code: 'BAD_LOGIN', message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
  }));

  await expect(login('a@b.c', 'wrong')).rejects.toThrow('อีเมลหรือรหัสผ่านไม่ถูกต้อง');

  const error = await login('a@b.c', 'wrong').catch(value => value);
  expect(error.status).toBe(401);
  expect(error.code).toBe('BAD_LOGIN');
});

test('non-JSON responses produce a readable error', async () => {
  fetch.mockResolvedValue({
    ok: false,
    status: 404,
    json: () => Promise.reject(new SyntaxError('Unexpected token <')),
  });

  await expect(apiFetch('/api/equipment')).rejects.toThrow('server ไม่ได้ตอบเป็น JSON');
});
