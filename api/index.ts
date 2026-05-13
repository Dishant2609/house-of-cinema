import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';

export const config = { runtime: 'edge' };

const TMDB_KEY = process.env.VITE_TMDB_API_KEY || 'd95d937e9a07bd2f0cfa6816b9f2d4fd';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const app = new Hono().basePath('/api');

app.use(cors({ origin: (origin) => origin ?? '*', credentials: true }));

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));
app.get('/health', (c) => c.json({ status: 'ok' }));

// TMDB proxy — keeps API key server-side
app.get('/tmdb/*', async (c) => {
  const path = c.req.path.replace('/api/tmdb', '');
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', TMDB_KEY);
  const clientUrl = new URL(c.req.url);
  clientUrl.searchParams.forEach((v, k) => {
    if (k !== 'api_key') url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  const data = await res.json();
  return c.json(data);
});

// Image proxy — avoids CORS issues with TMDB images
app.get('/img/*', async (c) => {
  const path = c.req.path.replace('/api/img', '');
  const url = `${IMAGE_BASE}${path}`;
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  });
});

export default handle(app);
