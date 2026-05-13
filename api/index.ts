export const config = { runtime: 'edge' };

const TMDB_KEY = process.env.VITE_TMDB_API_KEY || 'd95d937e9a07bd2f0cfa6816b9f2d4fd';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: cors });
  }

  const url = new URL(req.url);
  let path = url.pathname.replace(/^\/api/, '');
  const qs = url.searchParams;

  // Ping
  if (path === '/ping' || path === '') {
    return Response.json({ pong: true }, { headers: cors });
  }

  // Image proxy
  if (path.startsWith('/img/')) {
    const imgPath = path.replace('/img', '');
    const res = await fetch(`${IMAGE_BASE}${imgPath}`);
    const buffer = await res.arrayBuffer();
    return new Response(buffer, {
      headers: {
        ...cors,
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // TMDB proxy
  let tmdbPath = path.startsWith('/tmdb') ? path.replace('/tmdb', '') : path;
  const tmdbUrl = new URL(`${TMDB_BASE}${tmdbPath}`);
  tmdbUrl.searchParams.set('api_key', TMDB_KEY);
  qs.forEach((v, k) => { if (k !== 'api_key') tmdbUrl.searchParams.set(k, v); });

  const res = await fetch(tmdbUrl.toString());
  const data = await res.json();
  return Response.json(data, { status: res.status, headers: cors });
}
