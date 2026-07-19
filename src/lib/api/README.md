# Nameverse API Client

Professional API client for the Nameverse backend with caching, retry logic, and comprehensive error handling.

📖 **[View Complete API Documentation](https://namverse-api.vercel.app/)** or see [backend/ROUTES.md](../../../../backend/ROUTES.md)

## 🚀 Quick Start

```javascript
import namesAPI from '@/lib/api/names';

// Fetch names
const result = await namesAPI.fetchNames({
  religion: 'islamic',
  page: 1,
  limit: 50,
});

// Search names
const searchResults = await namesAPI.searchNames('ali');

// Get single name
const name = await namesAPI.fetchNameDetail('islamic', 'ahmad');
```

## 📡 API Endpoints

### Base URL
- **Production**: `https://namverse-api.vercel.app`
- **Local**: `http://localhost:3000`

### API Path Prefix
All endpoints use `/api` prefix (e.g., `/api/names`)

### Endpoints

#### 1. Health Check
```
GET /health
```
Returns server health status and database connection.

#### 2. Filters
```
GET /api/filters/:religion
```
Get available filters (genders, origins, letters) for a religion.

**Parameters:**
- `religion` (required): `islamic`, `christian`, or `hindu`

**Response:**
```json
{
  "success": true,
  "totalNames": 5000,
  "filters": {
    "genders": ["male", "female"],
    "origins": ["Arabic", "Hebrew", ...],
    "letters": ["A", "B", "C", ...]
  }
}
```

#### 3. Names List
```
GET /api/names
```
Fetch names with pagination and filtering.

**Parameters:**
- `religion` (required): Religion category
- `page` (default: 1): Page number
- `limit` (default: 50): Items per page
- `gender`: Filter by gender
- `origin`: Filter by origin
- `startsWith`: Filter by starting letter
- `search`: Search query
- `sort`: Sort order (`asc` or `desc`)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5000,
    "totalPages": 100
  }
}
```

#### 4. Single Name Detail
```
GET /api/names/:religion/:slug
```
Get detailed information about a specific name.

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Ahmad",
    "slug": "ahmad",
    "gender": "male",
    "origin": "Arabic",
    "short_meaning": "Highly praised",
    ...
  }
}
```

#### 5. Search
```
GET /api/search?q=query
```
Search names across all religions or specific religion.

**Parameters:**
- `q` (required): Search query (min 2 characters)
- `religion` (optional): Filter by religion
- `limit` (default: 20): Results limit

**Response:**
```json
{
  "success": true,
  "query": "ali",
  "count": 50,
  "data": [...]
}
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
# Production API
NEXT_PUBLIC_API_BASE=https://namverse-api.vercel.app/api

# For local development, uncomment:
# NEXT_PUBLIC_API_BASE=http://localhost:3000/api

# API Timeout (milliseconds)
NEXT_PUBLIC_API_TIMEOUT=60000
```

## 📚 Usage Examples

### Fetch Names with Filters

```javascript
import { fetchNames } from '@/lib/api/names';

const result = await fetchNames({
  religion: 'islamic',
  page: 1,
  limit: 20,
  gender: 'male',
  startsWith: 'A',
});

console.log(result.data); // Array of names
console.log(result.pagination); // Pagination info
```

### Search Functionality

```javascript
import { searchNames } from '@/lib/api/names';

// Search all religions
const results = await searchNames('ali');

// Search specific religion
const islamicResults = await searchNames('ali', {
  religion: 'islamic',
  limit: 10,
});
```

### Get Name Details

```javascript
import { fetchNameDetail } from '@/lib/api/names';

const name = await fetchNameDetail('islamic', 'ahmad');

if (name) {
  console.log(name.name); // "Ahmad"
  console.log(name.short_meaning); // "Highly praised"
}
```

### Get Filters

```javascript
import { fetchFilters } from '@/lib/api/names';

const filters = await fetchFilters('islamic');

console.log(filters.genders); // ['male', 'female']
console.log(filters.origins); // ['Arabic', 'Hebrew', ...]
console.log(filters.letters); // ['A', 'B', 'C', ...]
console.log(filters.totalNames); // 5000
```

## 🧪 Testing

### Browser Testing

```javascript
import { testAllEndpoints, quickTest } from '@/lib/api/test-browser';

// Run all tests
const results = await testAllEndpoints({ verbose: true });

// Quick test
await quickTest();

// Test specific endpoint
import { testEndpoint } from '@/lib/api/test-browser';
await testEndpoint('search', { query: 'ali' });
```

### Console Testing

Open browser console and run:

```javascript
// Quick test
await window.testAPI.quick();

// Full test suite
await window.testAPI.testAll();

// Test specific endpoint
await window.testAPI.test('names', { religion: 'islamic', limit: 10 });

// Check cache stats
window.testAPI.getCacheStats();

// Clear cache
window.testAPI.clearCache();
```

## ⚡ Performance Features

### 1. Request Caching
- Automatic caching of GET requests
- 5-minute TTL (Time To Live)
- In-memory cache with timestamps

### 2. Request Deduplication
- Prevents duplicate concurrent requests
- Returns same promise for identical requests

### 3. Automatic Retry
- Retries failed requests up to 3 times
- Exponential backoff with jitter
- Smart retry for network errors

### 4. Compression
- Automatic gzip/deflate compression
- Reduces bandwidth usage

### 5. Request Cancellation
- Cancel all active requests
- Cancel specific request by ID

```javascript
import { cancelAllRequests, clearCache } from '@/lib/api/client';

// Cancel all pending requests
cancelAllRequests();

// Clear cache
clearCache();
```

## 🔍 Error Handling

All API functions return safe defaults on error:

```javascript
// Names - returns empty array
const result = await fetchNames({ religion: 'invalid' });
// result = { data: [], pagination: {...}, success: false }

// Single name - returns null
const name = await fetchNameDetail('islamic', 'nonexistent');
// name = null

// Search - returns empty results
const results = await searchNames('');
// results = { data: [], count: 0, success: false }
```

## 📊 Rate Limiting

The backend implements rate limiting:
- **50 requests per day** per IP address
- **Unlimited** for nameverse.site domain
- Rate limit resets every 24 hours

## 🔐 Legacy Endpoints

For backward compatibility, legacy endpoints are supported:

```javascript
import { fetchNamesLegacy, fetchFiltersLegacy } from '@/lib/api/names';

// Legacy names endpoint
const names = await fetchNamesLegacy({ religion: 'islamic' });

// Legacy filters endpoint
const filters = await fetchFiltersLegacy('islamic');
```

**Legacy endpoints:**
- `GET /api/religion/:religion`
- `GET /api/religion/:religion/filters`
- `GET /api/names/:religion/:slug`

## 🐛 Debugging

Enable development mode for detailed logging:

```javascript
// In .env.local
NODE_ENV=development
```

Logs will show:
- Request details (method, URL, params)
- Cache hits/misses
- Request deduplication
- Response times
- Errors with full context

## 🤝 Contributing

When adding new API endpoints:

1. Add function to `names.js`
2. Update this README
3. Add tests to `test-browser.js`
4. Test with both production and local API

## 📝 Notes

- All timestamps are in ISO 8601 format
- All responses include `success` boolean
- Slugs are lowercase with hyphens
- Religion values: `islamic`, `christian`, `hindu`
- Minimum search query length: 2 characters

## 🔗 Related Files

- `client.js` - Axios client with interceptors
- `names.js` - Names API functions
- `test-browser.js` - Browser testing utilities
- `test-api.js` - Node.js testing utilities

## 📞 Support

For issues or questions:
- Backend API: https://namverse-api.vercel.app
- Frontend: https://nameverse.site
