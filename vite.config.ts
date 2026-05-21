import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(async () => {
  const plugins = [react()];
  try {
    // @ts-expect-error -- optional plugin may not exist
    const m = await import("./.vite-source-tags.js");
    plugins.push(m.sourceTags());
  } catch {
    // optional plugin not available, continue without it
  }
  return {
    plugins,
    server: {
      host: true,
      port: 5173,
    },
  };
});
