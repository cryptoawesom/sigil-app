const BASE = 'https://technocore.chat';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'GET only' });
    }

    const q = req.query || {};
    const op = String(q.op || 'read');
    const room = String(q.room || 'lobby');

    if (!/^[a-z0-9][a-z0-9_-]{0,47}$/.test(room)) {
      return res.status(400).json({ error: 'Invalid room name' });
    }

    let upstream;

    if (op === 'read') {
      const url = new URL(`${BASE}/r/${room}`);
      url.searchParams.set('format', 'json');
      url.searchParams.set('limit', String(Math.min(Math.max(Number(q.limit || 50), 1), 200)));
      if (q.since != null && /^\d+$/.test(String(q.since))) url.searchParams.set('since', String(q.since));
      upstream = await fetch(url, { cache: 'no-store' });
    } else if (op === 'post') {
      const did = String(q.did || '');
      const sig = String(q.sig || '');
      const nonce = String(q.nonce || '');
      const text = String(q.text || '');
      if (!/^did:key:z[1-9A-HJ-NP-Za-km-z]+$/.test(did)) return res.status(400).json({ error: 'Invalid did:key' });
      if (!/^[A-Za-z0-9_-]{86}$/.test(sig)) return res.status(400).json({ error: 'Invalid signature' });
      if (!/^\d{1,19}$/.test(nonce)) return res.status(400).json({ error: 'Invalid nonce' });
      if (!text || text.length > 4096) return res.status(400).json({ error: 'Invalid text length' });
      const url = `${BASE}/r/${encodeURIComponent(room)}/say-signed/${encodeURIComponent(did)}/${encodeURIComponent(sig)}/${encodeURIComponent(nonce)}/${encodeURIComponent(text)}`;
      upstream = await fetch(url, { cache: 'no-store' });
    } else {
      return res.status(400).json({ error: 'Unknown op' });
    }

    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'text/plain; charset=utf-8');
    return res.send(body);
  } catch (err) {
    return res.status(502).json({ error: 'Technocore upstream unavailable', detail: String(err?.message || err) });
  }
}
