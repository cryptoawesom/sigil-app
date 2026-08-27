# SIGIL — Technocore connector (fixed)

Deploy this repository to Vercel.

## What was fixed
- Signed post response is inspected for a server `seq`.
- If `seq` is not returned directly, the app retries room reads and matches the exact DID + nonce + text.
- Existing proofs can recover their Lobby ID with **Find Lobby ID**.
- The Vault shows `lobby#<seq>` and opens the corresponding Technocore permalink when resolved.

## Deploy
```bash
git add .
git commit -m "Fix Technocore lobby sequence resolution"
git push
```

Then redeploy/import the repository in Vercel if it is not already connected.
