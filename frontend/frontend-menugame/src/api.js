const API_BASE = '/api';

const handleJson = async (res) => {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
};

export async function getGames() {
  return fetch(`${API_BASE}/games`).then(handleJson);
}

export async function getCategories() {
  return fetch(`${API_BASE}/categories`).then(handleJson);
}

export async function searchGames({ name, categoryId, type }) {
  const params = new URLSearchParams();
  if (name) params.set('name', name);
  if (categoryId != null) params.set('categoryId', String(categoryId));
  if (type) params.set('type', type);
  const qs = params.toString();
  return fetch(`${API_BASE}/games/search${qs ? `?${qs}` : ''}`).then(handleJson);
}

export async function createGame(game) {
  return fetch(`${API_BASE}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game),
  }).then(handleJson);
}

export async function updateGame(id, game) {
  return fetch(`${API_BASE}/games/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game),
  }).then(handleJson);
}

export async function deleteGame(id) {
  return fetch(`${API_BASE}/games/${id}`, { method: 'DELETE' }).then((res) => {
    if (!res.ok) throw new Error(`Delete failed ${res.status}`);
  });
}

export async function createCategory(category) {
  return fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  }).then(handleJson);
}

export async function updateCategory(id, category) {
  return fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  }).then(handleJson);
}

export async function deleteCategory(id) {
  return fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' }).then((res) => {
    if (!res.ok) throw new Error(`Delete failed ${res.status}`);
  });
}
