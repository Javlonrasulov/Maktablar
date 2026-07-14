# Navbahor Education Intelligence Platform

Premium analytics and school management UI for Navbahor district (Navoiy region).

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (Liquid Glass design tokens)
- Framer Motion, React Router, TanStack Query/Table
- ECharts, Leaflet, i18next (uz-Cyrl default, uz-Latn, ru, en)
- React Hook Form + Zod
- Shared auth API (Netlify Functions + Blobs in production; local file store in `npm run dev`)

## Scripts

```bash
npm install
npm run dev
npm run build
```

Production: https://navbahor-education.netlify.app

System users created on the live site are stored in Netlify Blobs and work from any device.

Default language is **Oʻzbek (Kirill)**.
