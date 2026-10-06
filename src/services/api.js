/**
 * AFRIKDEV API Client Service
 * Connects to Django REST Framework backend with offline fallback.
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const ApiService = {
  // Check backend health / status
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/stats/`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Get Projects from Django REST API
  async getProjects() {
    const res = await fetch(`${API_BASE_URL}/projects/`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    return data.results || data;
  },

  // Upvote project
  async upvoteProject(id) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/upvote/`, { method: 'POST' });
    return res.json();
  },

  // Star project
  async starProject(id) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/star/`, { method: 'POST' });
    return res.json();
  },

  // Get Developers
  async getDevelopers(filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE_URL}/developers/?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch developers');
    const data = await res.json();
    return data.results || data;
  },

  // Execute Matchmaker algorithm on backend
  async matchDevelopers(stack = []) {
    const res = await fetch(`${API_BASE_URL}/developers/match/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stack })
    });
    if (!res.ok) throw new Error('Failed to execute matchmaker');
    return res.json();
  },

  // Get Posts
  async getPosts() {
    const res = await fetch(`${API_BASE_URL}/posts/`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    const data = await res.json();
    return data.results || data;
  },

  // Like Post
  async likePost(id) {
    const res = await fetch(`${API_BASE_URL}/posts/${id}/like/`, { method: 'POST' });
    return res.json();
  },

  // Get Communities
  async getCommunities() {
    const res = await fetch(`${API_BASE_URL}/communities/`);
    if (!res.ok) throw new Error('Failed to fetch communities');
    const data = await res.json();
    return data.results || data;
  },

  // Get Opportunities
  async getOpportunities() {
    const res = await fetch(`${API_BASE_URL}/opportunities/`);
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    const data = await res.json();
    return data.results || data;
  },

  // Get Platform Stats
  async getStats() {
    const res = await fetch(`${API_BASE_URL}/stats/`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
