const BASE = process.env.NODE_ENV === 'development'
  ? ''
  : (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 204) return null;

  let data;
  try {
    data = await res.json();
  } catch {
    const error = new Error('server ไม่ได้ตอบเป็น JSON');
    error.status = res.status;
    throw error;
  }

  if (!res.ok) {
    const message = data.error?.message ?? data.error ?? `server ตอบกลับ ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.code = data.error?.code;
    throw error;
  }

  return data;
}

function toProduct(equipment) {
  return {
    ...equipment,
    name: equipment.title,
    brand: equipment.titleTh,
    category: equipment.genre,
    releaseYear: equipment.year,
    description: equipment.detail,
    imageUrl: equipment.poster,
  };
}

function getItems(data, endpoint) {
  if (!Array.isArray(data.items)) {
    throw new Error(`server ตอบกลับ ${endpoint} โดยไม่มีรายการ items`);
  }
  return data.items;
}

async function addMemberRating(product, token) {
  const details = await getProduct(product.id, token);
  return {
    ...product,
    memberRating: details.memberRating,
    memberVoteCount: details.memberVoteCount,
  };
}

export function register(email, password, displayName) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { email, password, displayName },
  });
}

export function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function getMe(token) {
  return apiFetch('/api/me', { token });
}

export function getReviews(equipmentId) {
  return apiFetch(`/api/equipment/${equipmentId}/reviews`)
    .then(data => ({ ...data, items: getItems(data, 'รีวิว') }));
}

export function postReview(equipmentId, text, token) {
  return apiFetch(`/api/equipment/${equipmentId}/reviews`, {
    method: 'POST',
    body: { text },
    token,
  });
}

export function putVote(equipmentId, score, token) {
  return apiFetch(`/api/equipment/${equipmentId}/vote`, {
    method: 'PUT',
    body: { score },
    token,
  });
}

export function deleteVote(equipmentId, token) {
  return apiFetch(`/api/equipment/${equipmentId}/vote`, {
    method: 'DELETE',
    token,
  });
}

export async function getWishlist(token, { includeMemberRatings = false } = {}) {
  const data = await apiFetch('/api/me/wishlist', { token });
  const items = getItems(data, 'wishlist').map(toProduct);
  return {
    ...data,
    items: includeMemberRatings
      ? await Promise.all(items.map(item => addMemberRating(item, token)))
      : items,
  };
}

export function addToWishlist(equipmentId, token, note) {
  return apiFetch(`/api/me/wishlist/${equipmentId}`, {
    method: 'PUT',
    body: note === undefined ? undefined : { note },
    token,
  });
}

export function removeFromWishlist(equipmentId, token) {
  return apiFetch(`/api/me/wishlist/${equipmentId}`, {
    method: 'DELETE',
    token,
  });
}

export async function getProducts(options = {}) {
  const params = new URLSearchParams();
  if (options.q) params.set('q', options.q);
  if (options.categoryId) params.set('category', options.categoryId);
  const query = params.toString();
  const data = await apiFetch(`/api/equipment${query ? `?${query}` : ''}`);
  const items = getItems(data, 'อุปกรณ์').map(toProduct);
  return Promise.all(items.map(item => addMemberRating(item)));
}

export async function getProduct(id, token) {
  const equipment = await apiFetch(`/api/equipment/${id}`, { token });
  return toProduct(equipment);
}

export async function getCategories() {
  const data = await apiFetch('/api/categories');
  return getItems(data, 'หมวดอุปกรณ์');
}

export function getAdminStats(token) {
  return apiFetch('/api/admin/stats', { token });
}

export async function getAdminMembers(token) {
  const data = await apiFetch('/api/admin/members', { token });
  return getItems(data, 'สมาชิก');
}

export function setMemberRole(memberId, role, token) {
  return apiFetch(`/api/admin/members/${memberId}/role`, {
    method: 'PUT',
    body: { role },
    token,
  });
}

export async function getAdminProducts(token) {
  const data = await apiFetch('/api/equipment', { token });
  return getItems(data, 'อุปกรณ์');
}

export function getAdminProduct(id, token) {
  return apiFetch(`/api/admin/equipment/${id}`, { token });
}

export function createProduct(fields, token) {
  return apiFetch('/api/admin/equipment', { method: 'POST', body: fields, token });
}

export function updateProduct(id, fields, token) {
  return apiFetch(`/api/admin/equipment/${id}`, { method: 'PUT', body: fields, token });
}

export function deleteProduct(id, token) {
  return apiFetch(`/api/admin/equipment/${id}`, { method: 'DELETE', token });
}
