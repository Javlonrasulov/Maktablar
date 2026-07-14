# Navbahor Education Intelligence Platform

Premium analytics and school management UI for Navbahor district (Navoiy region).

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (Liquid Glass design tokens)
- Framer Motion, React Router, TanStack Query/Table
- ECharts, Leaflet, i18next (uz-Cyrl default, uz-Latn, ru, en)
- React Hook Form + Zod
- File-backed auth API (system users shared across devices on the same host)

## Scripts

```bash
npm install
npm run dev
npm run build
```

Default language is **Oʻzbek (Kirill)** and persists via `localStorage`.

System users are stored on the server at `server/data/system-users.json` so any device that opens the **same** app URL (e.g. `http://PC-IP:5173`) can log in with the same credentials.

For phones / other PCs: run `npm run dev` on the host, then open the LAN address shown in the terminal (not `localhost` on the other device).

Mock data still powers schools, teachers, subjects, workload, map, and reports until a full backend is connected.
