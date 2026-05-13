const TMDB_KEY = process.env.VITE_TMDB_API_KEY || 'd95d937e9a07bd2f0cfa6816b9f2d4fd';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const handler = async (event) => {
  const path = event.path.replace('/.netlify/functions/api', '');
  const qs = event.queryStringParameters || {};

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    // Image proxy
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

    // TMDB proxy
    if (path.startsWith('/tmdb/') || path.startsWith('/movies/') || path.startsWith('/search') || path.startsWith('/person')) {
      let tmdbPath = path.startsWith('/tmdb/') ? path.replace('/tmdb', '') : path;
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
    }

    // Ping
    if (path === '/ping') {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Pong! ${Date.now()}` }),
      };
    }

    return {
      statusCode: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
