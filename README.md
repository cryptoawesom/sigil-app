# SIGIL — Technocore DID & Proof Studio

Unofficial community tool for generating a client-side P-256 identity
(`did:flop:…`), signing intros/work entries, and verifying proofs.
100% static — no backend, no build step. All cryptography runs in the
browser via the Web Crypto API.

## Local preview
Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy
This repo deploys as-is on Vercel, GitHub Pages, Netlify, or any static
host — there's nothing to build.
