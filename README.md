# motsense

Website structure for Motsense:

## Public website

- Home
  - Hero
  - How it works
  - What we detect
  - API
  - Use cases
  - Dashboard preview
  - Hardware
  - Why Motsense
  - Request Demo
- Product
  - Road Sensor
  - Platform
  - API
- Solutions
  - Smart Cities
  - Transportation Agencies
  - Road Operators
  - Mobility Platforms
  - Research
- Developers / API
  - Overview
  - API capabilities
  - Example response
  - Documentation
- Technology
  - Sensing
  - Edge Processing
  - LoRaWAN
  - Cloud
- Company
  - About
  - Contact
- Sign In

## Private platform

- Overview
- Live Map
- Traffic Events
- Analytics
- Devices
- Gateways
- Alerts
- API & Integrations
- Settings

## Hostinger Production Deployment

This repository uses Next.js and can run as the dashboard frontend behind Traefik.

1. Clone the repository on the VPS

```bash
cd /opt
git clone https://github.com/donmorenous-maker/motsense.git motsense-dashboard
cd /opt/motsense-dashboard
```

2. Install dependencies

```bash
npm install
```

3. Build the production bundle

```bash
npm run build
```

4. Start the frontend on port 3000

```bash
PORT=3000 npm start
```

The dashboard uses relative requests by default:

- `/api/events`
- `/api/summary`
- `/health`

Leave `NEXT_PUBLIC_API_BASE_URL` empty for the Hostinger deployment so requests continue flowing through Traefik. Do not point the browser at `localhost`, Supabase, MQTT, or any privileged backend service directly.

### Example systemd service

Create `/etc/systemd/system/motsense-dashboard.service`:

```ini
[Unit]
Description=Motsense dashboard frontend
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/motsense-dashboard
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
```

Then enable it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now motsense-dashboard
sudo systemctl status motsense-dashboard
```

Traefik should continue routing:

- `https://dashboard.motsense.com/` → `http://127.0.0.1:3000`
- `https://dashboard.motsense.com/api/` → `http://127.0.0.1:8000`

Do not expose port 3000 directly to the public internet. Let Traefik terminate TLS and proxy requests internally.
