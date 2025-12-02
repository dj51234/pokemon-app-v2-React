const PROXY_URL = 'http://localhost:3001/api';

export const pokemonProxy = {
  set: {
    all: async () => {
      const response = await fetch(`${PROXY_URL}/sets`);
      const data = await response.json();
      return data.data;
    },
    find: async (id) => {
      const response = await fetch(`${PROXY_URL}/sets/${id}`);
      const data = await response.json();
      return data.data;
    }
  },
  card: {
    find: async (id) => {
      const response = await fetch(`${PROXY_URL}/cards/${id}`);
      const data = await response.json();
      return data.data;
    },
    where: async (params) => {
      const q = params.q || '';
      const pageSize = params.pageSize || 250;
      const response = await fetch(`${PROXY_URL}/cards?q=${encodeURIComponent(q)}&pageSize=${pageSize}`);
      return response.json();
    }
  },
  rarity: {
    all: async () => {
      const response = await fetch(`${PROXY_URL}/rarities`);
      const data = await response.json();
      return data.data;
    }
  }
};