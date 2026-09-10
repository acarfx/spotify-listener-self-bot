# Spotify Listener Self-Bot

Multi-token Discord presence system that keeps accounts in voice channels and cycles a realistic **Spotify Rich Presence**. Each token picks a random track from album data, stays online, auto-rejoins after drops, and remembers the last voice channel across restarts.

> Used in production on **Rentia**.

![Preview](https://github.com/acarfx/spotify-listener-self-bot/assets/77089894/5a7859df-db23-4d34-89b3-cb7edd110a34)

---

## Features

- **Multi-token** — run as many accounts as you put in `settings.json`
- **Random Spotify RPC** — each token plays a different track from `Spotify/Data.json`
- **Auto next track** — when a song ends, a new one is selected automatically
- **Voice persistence** — last channel is stored per user; reconnects after restart
- **Auto rejoin** — if a token drops from voice, it joins again after a short delay
- **Channel move memory** — moving a token to another voice channel updates its saved channel
- **Always DND** — status is forced back to Do Not Disturb if it changes
- **Bad token cleanup** — invalid tokens are reported in the console

---

## Requirements

- [Node.js](https://nodejs.org/) 16+
- Discord user tokens (self-bot)
- Voice channel IDs for those accounts to join

---

## Install

```bash
git clone https://github.com/acarfx/spotify-listener-self-bot.git
cd spotify-listener-self-bot
npm install
```

---

## Configuration

Edit **`settings.json`** before starting:

```json
{
  "tokens": [
    "USER_TOKEN_1",
    "USER_TOKEN_2"
  ],
  "channels": [
    "VOICE_CHANNEL_ID_1",
    "VOICE_CHANNEL_ID_2"
  ]
}
```

| Field | Description |
| --- | --- |
| `tokens` | Discord user tokens, one per account |
| `channels` | Voice channel IDs. Index `n` maps to token `n`. If a token has no matching channel, the first channel is used |

Track metadata lives in **`Spotify/Data.json`** (Spotify playlist / album dump). Replace that file to change which songs appear on the RPC.

---

## Usage

```bash
node index.js
```

On first login each token:

1. Joins the mapped voice channel
2. Saves that channel to `Databases/<userId>.json`
3. Sets status to **Do Not Disturb**
4. Starts a Spotify Rich Presence with a random track

After that, moving the account to another voice channel in the server is enough to change its home channel. Restarting the process will send it back to the last saved channel.

---

## Project structure

```
spotify-listener-self-bot/
├── Classes/
│   └── Client.js          # Self-bot client + voice join helper
├── Spotify/
│   └── Data.json          # Track / album dataset for RPC
├── Databases/             # Created at runtime (last channel per user)
├── settings.json          # Tokens and channel IDs
├── index.js               # Main loop, RPC, reconnect logic
├── main.js               # Test stub (not used by the listener)
└── package.json
```

---

## How it works

1. **Login** — `index.js` spins up one `ACAR` client per token via `discord.js-selfbot-v13`.
2. **Voice** — `Classes/Client.js` joins the target channel with `@discordjs/voice`.
3. **Memory** — `lowdb` stores the last channel ID under `Databases/<discordUserId>.json`.
4. **RPC** — a random item from `Spotify/Data.json` is mapped to `SpotifyRPC` (title, artist, album art, duration, Spotify IDs).
5. **Loop** — a timeout equal to the track duration calls RPC again so the presence never goes stale.

---

## Notes

- Tokens and channels are paired by array index.
- Accounts join unmuted and undeafened (`selfMute: false`, `selfDeaf: false`).
- Discord user tokens are secrets. Do not commit a filled `settings.json`.
- Self-bots violate Discord’s Terms of Service. Use at your own risk; accounts can be disabled.

---

## License

Personal / educational use. No license file is attached to the repository.
