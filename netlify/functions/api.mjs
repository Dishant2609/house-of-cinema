const TMDB_KEY = process.env.VITE_TMDB_API_KEY || 'd95d937e9a07bd2f0cfa6816b9f2d4fd';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  // Strip any leading prefix — normalize to just the meaningful path
  // event.path could be: /api/tmdb/... or /tmdb/... or /.netlify/functions/api/tmdb/...
  let path = event.path || '';
  // Remove known prefixes
  path = path.replace(/^\/.netlify\/functions\/api/, '');
  path = path.replace(/^\/api/, '');

  const qs = event.queryStringParameters || {};

  try {
    // Debug endpoint
    if (path === '/ping' || path === '') {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ pong: true, rawPath: event.path, normalizedPath: path }),
      };
    }

    // Image proxy: /img/w500/...
    if (path.startsWith('/img/')) {
      const imgPath = path.replace('/img', '');
      const url = `${IMAGE_BASE}${imgPath}`;
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      const contentType = res.headers.get('content-type') || 'image/jpeg';
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
        },
        body: Buffer.from(buffer).toString('base64'),
        isBase64Encoded: true,
      };
    }

    // TMDB proxy: /tmdb/... → strip /tmdb prefix and forward to TMDB
    let tmdbPath = path;
    if (tmdbPath.startsWith('/tmdb')) {
      tmdbPath = tmdbPath.replace('/tmdb', '');
    }

    const url = new URL(`${TMDB_BASE}${tmdbPath}`);
    url.searchParams.set('api_key', TMDB_KEY);
    Object.entries(qs).forEach(([k, v]) => {
      if (k !== 'api_key') url.searchParams.set(k, v);
    });

    const res = await fetch(url.toString());
    const data = await res.json();
    return {
      statusCode: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message, path, rawPath: event.path }),
    };
  }
};
