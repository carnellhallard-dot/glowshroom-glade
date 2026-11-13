# Glowshroom Glade 🍄✨

A live, magical mushroom check-in inspired by **Dungeons & Ducklings**. Everyone grows a customised mushroom on a phone and it appears in the shared enchanted forest in real time. Includes the duckling artwork, colour, size, cap, markings, mood, nickname, a host counter, a QR code and a reset button.

## Deploy on GitHub + Render

1. Unzip this folder.
2. Create a new GitHub repository called `glowshroom-glade`.
3. In the repository **root**, upload `package.json`, `server.js` and `README.md`.
4. Create a `public` folder if needed (GitHub **Add file → Create new file**, type `public/placeholder.txt`, write `temporary`, commit). Open that folder and upload `index.html`, `app.js`, `styles.css`, and the complete `assets/glade.webp` file under an `assets` folder. It is essential that the image is at `public/assets/glade.webp`.
5. Render → **New → Web Service** → select the new repository → Node runtime → build command `npm install` → start command `npm start` → choose Free if available → deploy.
6. Once Render says **Live**, use your actual Render URL with the links below.

**HOST (project this):** `https://YOUR-RENDER-URL/?view=host&room=GLADE1`

**PARTICIPANTS:** `https://YOUR-RENDER-URL/?view=student&room=GLADE1`

The host screen has **Invite travellers** (QR code + participant URL) and **Clear glade** (reset). To keep an old glade while starting a new one, use `GLADE2` as the room code on both screens.

You can also visit the root website, which opens the participant view by default.

## Important practical details

- Up to **250 mushrooms per room**, though a projected forest becomes crowded with many mushrooms.
- Stores mushrooms in server memory only. Render Free can sleep/restart, clearing the rooms. **Not permanent storage**.
- No student ID, login or assessment integration. Names/nicknames are optional, so encourage aliases for public sessions.
- There is **no host authentication**. Anyone with the host link could clear that room. Use for informal, non-sensitive activities only.
- The QR code is generated on the server (dependency `qrcode`) and points at the participant link for the current room.
- To replace files later, update the GitHub repository; Render auto-deploy will usually redeploy if enabled.
- Background artwork is bundled in `public/assets/glade.webp` and displays without relying on external image providers. Google fonts fall back to system fonts if unavailable.

## Local run

```bash
npm install
npm start
```

Visit `http://localhost:3000/?view=host&room=GLADE1` and `http://localhost:3000/?view=student&room=GLADE1`.
