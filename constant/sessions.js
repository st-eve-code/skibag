const res = await fetch('https://api.beta-gamer.com/v1/sessions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer bg_live_xxxx',   // secret API key — server-side only
    'Content-Type':  'application/json',
  },
  body: JSON.stringify({
    game:              'chess',
    matchType:         'matchmaking',   // see matchType options below
    players:           [{ id: 'user_123', displayName: 'Alex' }],
    afkTimeoutEnabled: true,
  }),
});

const { sessionToken, sessionId, expiresAt } = await res.json();
// Pass sessionToken to your client — never the raw API key