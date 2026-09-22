# OCI NoSQL Showcase

A static walkthrough of Oracle NoSQL Database Cloud Service.

## Run

Requires Node.js 18 or later. No package installation, OCI credentials, API, or internet connection is needed to run the site.

```sh
node server.mjs
```

Open **http://localhost:8788**. The server binds to loopback. Set `PORT` to choose another port. Alternatively, publish the public HTML/CSS/JavaScript/assets to any static host that serves ES modules with the correct MIME types; use HTTP rather than opening the HTML directly as a file.

## Explore

- Overview; Availability; Recovery; Migration; Observability; Security; Workload patterns.
- Direct workload links: `#patterns/iot`, `#patterns/gaming`, `#patterns/social`.
- Workload patterns opens with IoT selected.
- Scenario tabs support arrows and Home/End. Recovery/migration support Play/Pause, Next step, Reset; playback starts only on request. Reduced motion disables transfer animation and retains every manual stage.
- All data, charts, and results are illustrative. No command or cloud operation executes from the UI.
