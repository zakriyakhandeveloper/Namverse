/**
 * Articles API Client - Optimized for Backend Endpoints
 * Replaces Supabase with MongoDB backend API calls
 *
 * Backend Endpoints (as per ALL_ROUTES.txt):
 * - GET /api/v1/articles - Get paginated articles with filters
 * - GET /api/v1/articles/latest?limit=10 - Get latest articles
 * - GET /api/v1/articles/categories - Get all categories
 * - GET /api/v1/articles/search?q=keyword - Search articles
 * - GET /api/v1/articles/:slug - Get single article by slug
 *
 * Features:
 * - Full integration with backend API
 * - Response caching via apiClient
 * - Proper error handling
 * - Data transformation for frontend compatibility
 */

import { apiClient } from './client';
import { env } from '@/config/env';

const API_VERSION = env.api.version || '/api/v1';
const API_BASE = env.api.baseUrl;
const DEFAULT_COVER_IMAGE = '/logo.svg';

const FALLBACK_ARTICLES = [
  {
    _id: 'top-100-islamic-names',
    slug: 'top-100-islamic-names',
    title: 'Top 100 Islamic Names with Meanings',
    subtitle: 'A curated list of beautiful Muslim baby names',
    author: 'NameVerse Editorial',
    category: 'Islamic',
    tags: ['Islamic', 'Names'],
    cover_image_url: DEFAULT_COVER_IMAGE,
    excerpt: 'Explore the top 100 Islamic names with their meanings and origins.',
    content: '## Introduction\nDiscover meaningful Islamic names.\n\n## Highlights\nTop names and meanings.',
    read_time_minutes: 8,
    name_links: ['Muhammad', 'Aisha'],
    status: 'published',
    views: 1200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'top-100-christian-names',
    slug: 'top-100-christian-names',
    title: 'Top 100 Christian Names with Meanings',
    subtitle: 'Biblical and traditional names with significance',
    author: 'NameVerse Editorial',
    category: 'Christian',
    tags: ['Christian', 'Names'],
    cover_image_url: DEFAULT_COVER_IMAGE,
    excerpt: 'From classic to modern, explore Christian names and meanings.',
    content: '## Overview\nA guide to Christian names.\n\n## Favorites\nPopular selections.',
    read_time_minutes: 7,
    status: 'published',
    views: 980,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'top-10-popular-ai-tools-2025',
    slug: 'top-10-popular-ai-tools-2025',
    title: 'Top 10 Popular AI Tools in 2025',
    subtitle: 'Boost productivity with these AI tools',
    author: 'Tech Writer',
    category: 'Technology',
    tags: ['AI', 'Productivity'],
    cover_image_url: DEFAULT_COVER_IMAGE,
    excerpt: 'A roundup of the most popular AI tools this year.',
    content: '## Tools\nList of top AI tools.\n\n## Tips\nHow to use them effectively.',
    read_time_minutes: 6,
    status: 'published',
    views: 650,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'top-10-remote-jobs-2025-guide',
    slug: 'top-10-remote-jobs-2025-guide',
    title: 'Top 10 Remote Jobs in 2025: A Practical Guide',
    subtitle: 'Work from anywhere with these roles',
    author: 'Career Coach',
    category: 'Careers',
    tags: ['Remote', 'Jobs'],
    cover_image_url: DEFAULT_COVER_IMAGE,
    excerpt: 'Find the best remote jobs and how to get them.',
    content: '## Roles\nRemote-friendly roles.\n\n## How To Apply\nSteps and tips.',
    read_time_minutes: 5,
    status: 'published',
    views: 540,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'zero-percent-muslim-population-countries',
    slug: 'zero-percent-muslim-population-countries',
    title: 'Countries with Near Zero Muslim Population',
    subtitle: 'A global demographic snapshot',
    author: 'NameVerse Editorial',
    category: 'Islamic',
    tags: ['Islamic', 'Demographics'],
    cover_image_url: DEFAULT_COVER_IMAGE,
    excerpt: 'Explore countries with minimal Muslim populations.',
    content: '## Data\nDemographic overview.\n\n## Insights\nKey observations.',
    read_time_minutes: 4,
    status: 'published',
    views: 410,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Transform MongoDB article to match Supabase format for frontend compatibility
 */
function transformArticle(article) {
  return {
    id: article._id,
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle,
    author: article.author,
    category: article.category,
    tags: article.tags || [],
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    seo_keywords: article.seo_keywords || [],
    cover_image_url: article.cover_image_url || DEFAULT_COVER_IMAGE,
    image: article.cover_image_url || DEFAULT_COVER_IMAGE, // Alias for compatibility
    excerpt: article.excerpt,
    summary: article.excerpt, // Alias for compatibility
    content: article.content,
    read_time_minutes: article.read_time_minutes,
    name_links: article.name_links || [],
    status: article.status,
    views: article.views || 0,
    likes: article.likes || 0,
    // Map MongoDB timestamps
    created_at: article.publishedAt || article.createdAt,
    updated_at: article.updatedAt || article.updatedAt,
  };
}

/**
 * Fetch latest articles
 * Backend endpoint: GET /api/articles/latest?limit=10
 * @param {number} limit - number of articles to fetch
 * @returns {Promise<Array>} articles
 */
export async function getLatestArticles(limit = 10) {
  try {
    const { data } = await apiClient.get(`${API_VERSION}/articles/latest`, {
      params: { limit },
    });

    const articles = data.success ? data.data : [];
    return articles.map(transformArticle);
  } catch (error) {
    const items = FALLBACK_ARTICLES.slice(0, limit);
    return items.map(transformArticle);
  }
}

/**
 * Fetch all articles with pagination
 * Backend endpoint: GET /api/articles?page=1&limit=50
 * @param {Object} options - pagination and filter options
 * @returns {Promise<Object>} articles with pagination
 */
export async function getAllArticles(options = {}) {
  try {
    const { page = 1, limit = 50, category, sort = 'recent' } = options;
    
    const params = { page, limit, sort };
    if (category) {
      params.category = category;
    }

    const { data } = await apiClient.get(`${API_VERSION}/articles`, { params });

    const articles = data.success ? data.data : [];
    return {
      articles: articles.map(transformArticle),
      pagination: data.pagination || { totalPages: 1, totalCount: 0, currentPage: page },
    };
  } catch (error) {
    const start = (options.page ? options.page - 1 : 0) * (options.limit || 50);
    const end = start + (options.limit || 50);
    let items = FALLBACK_ARTICLES;
    if (options.category) {
      items = items.filter(a => (a.category || '').toLowerCase() === options.category.toLowerCase());
    }
    return {
      articles: items.slice(start, end).map(transformArticle),
      pagination: { totalPages: 1, totalCount: items.length, currentPage: options.page || 1 },
    };
  }
}

/**
 * Fetch all unique article categories
 * Backend endpoint: GET /api/articles/categories
 * @returns {Promise<Array>} categories
 */
export async function getAllCategories() {
  try {
    const { data } = await apiClient.get(`${API_VERSION}/articles/categories`);

    return data.success ? data.data : [];
  } catch (error) {
    const cats = Array.from(new Set(FALLBACK_ARTICLES.map(a => a.category).filter(Boolean)));
    return cats;
  }
}

/**
 * Fetch articles by category
 * Backend endpoint: GET /api/articles?category=X&limit=10
 * @param {string} category - category name
 * @param {number} limit - number of articles to fetch
 * @returns {Promise<Array>} articles
 */
export async function getArticlesByCategory(category, limit = 10) {
  try {
    // Use the main articles endpoint with category filter
    const { data } = await apiClient.get(`${API_VERSION}/articles`, {
      params: { category, limit },
    });

    const articles = data.success ? data.data : [];
    return articles.map(transformArticle);
  } catch (error) {
    const items = FALLBACK_ARTICLES.filter(a => (a.category || '').toLowerCase() === category.toLowerCase()).slice(0, limit);
    return items.map(transformArticle);
  }
}

/**
 * Fetch single article by slug
 * Backend endpoint: GET /api/articles/:slug
 * @param {string} slug - article slug
 * @returns {Promise<Object>} article
 */
export async function getArticleBySlug(slug) {
  try {
    const { data } = await apiClient.get(`${API_VERSION}/articles/${encodeURIComponent(slug)}`);

    const article = data.success ? data.data : null;
    return article ? transformArticle(article) : null;
  } catch (error) {
    const match = FALLBACK_ARTICLES.find(a => a.slug === slug);
    return match ? transformArticle(match) : null;
  }
}

/**
 * Search articles by keyword
 * Backend endpoint: GET /api/articles/search?q=keyword
 * @param {string} keyword - search keyword
 * @param {Object} options - search options
 * @returns {Promise<Array>} articles
 */
export async function searchArticles(keyword, options = {}) {
  const params = {
    q: keyword,
    ...options,
  };

  const searchPaths = [
    `${API_VERSION}/articles/search`,
    '/api/articles/search',
    '/api/v1/articles/search',
  ].filter((path, index, self) => self.indexOf(path) === index);

  try {
    for (const path of searchPaths) {
      const response = await apiClient.get(path, { params });

      if (response.status >= 400) {
        continue;
      }

      const articles = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      if (Array.isArray(articles)) {
        return articles.map(transformArticle);
      }
    }
  } catch (error) {
    // Fall through to fallback logic below
  }

  const q = (keyword || '').toLowerCase();
  const items = FALLBACK_ARTICLES.filter(a => (
    (a.title || '').toLowerCase().includes(q) ||
    (a.subtitle || '').toLowerCase().includes(q) ||
    (a.excerpt || '').toLowerCase().includes(q)
  ));
  return items.map(transformArticle);
}

/**
 * Count total articles
 * @returns {Promise<number>} total articles
 */
export async function countArticles() {
  try {
    const { data } = await apiClient.get(`${API_VERSION}/articles`, {
      params: { limit: 1 },
    });

    return data.pagination?.total || data.pagination?.totalCount || 0;
  } catch (error) {
    
    return 0;
  }
}

// Export all article functions
const articlesAPI = {
  getLatestArticles,
  getAllArticles,
  getAllCategories,
  getArticlesByCategory,
  getArticleBySlug,
  searchArticles,
  countArticles,
};

export default articlesAPI;

