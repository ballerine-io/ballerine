// vite.config.ts
import react from 'file:///Users/ilyarudnev/Documents/Backend/ballerine/node_modules/.pnpm/@vitejs+plugin-react-swc@3.5.0_vite@5.3.5/node_modules/@vitejs/plugin-react-swc/index.mjs';
import { defineConfig } from 'file:///Users/ilyarudnev/Documents/Backend/ballerine/node_modules/.pnpm/vitest@2.1.8_@types+node@18.17.19_msw@1.3.2/node_modules/vitest/dist/config.js';
import terminal from 'file:///Users/ilyarudnev/Documents/Backend/ballerine/node_modules/.pnpm/vite-plugin-terminal@1.1.0_vite@5.3.5/node_modules/vite-plugin-terminal/dist/index.mjs';
import tsconfigPaths from 'file:///Users/ilyarudnev/Documents/Backend/ballerine/node_modules/.pnpm/vite-tsconfig-paths@5.0.1_typescript@5.5.4_vite@5.3.5/node_modules/vite-tsconfig-paths/dist/index.js';
import topLevelAwait from 'file:///Users/ilyarudnev/Documents/Backend/ballerine/node_modules/.pnpm/vite-plugin-top-level-await@1.4.4_vite@5.3.5/node_modules/vite-plugin-top-level-await/exports/import.mjs';
var vite_config_default = defineConfig(configEnv => {
  const isDevelopment = configEnv.mode === 'development';
  return {
    server: {
      open: true,
      host: true,
      port: 5137,
      // port: 443,
      // https: true,
    },
    preview: {
      port: 5137,
    },
    plugins: [
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`,
      }),
      terminal({
        output: ['console', 'terminal'],
        strip: false,
      }),
      react(),
      tsconfigPaths(),
      // mkcert(),
    ],
    css: {
      modules: {
        generateScopedName: isDevelopment ? '[name]__[local]__[hash:base64:5]' : '[hash:base64:5]',
      },
    },
    test: {
      exclude: ['e2e', 'node_modules'],
      environment: 'jsdom',
      setupFiles: ['./src/tests-setup.ts'],
    },
    build: {
      sourcemap: true,
    },
  };
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaWx5YXJ1ZG5ldi9Eb2N1bWVudHMvQmFja2VuZC9iYWxsZXJpbmUvYXBwcy9iYWNrb2ZmaWNlLXYyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvaWx5YXJ1ZG5ldi9Eb2N1bWVudHMvQmFja2VuZC9iYWxsZXJpbmUvYXBwcy9iYWNrb2ZmaWNlLXYyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9pbHlhcnVkbmV2L0RvY3VtZW50cy9CYWNrZW5kL2JhbGxlcmluZS9hcHBzL2JhY2tvZmZpY2UtdjIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnO1xuaW1wb3J0IHRlcm1pbmFsIGZyb20gJ3ZpdGUtcGx1Z2luLXRlcm1pbmFsJztcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xuaW1wb3J0IHRvcExldmVsQXdhaXQgZnJvbSAndml0ZS1wbHVnaW4tdG9wLWxldmVsLWF3YWl0JztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKGNvbmZpZ0VudiA9PiB7XG4gIGNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBjb25maWdFbnYubW9kZSA9PT0gJ2RldmVsb3BtZW50JztcblxuICByZXR1cm4ge1xuICAgIHNlcnZlcjoge1xuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgICBwb3J0OiA1MTM3LFxuICAgICAgLy8gcG9ydDogNDQzLFxuICAgICAgLy8gaHR0cHM6IHRydWUsXG4gICAgfSxcbiAgICBwcmV2aWV3OiB7XG4gICAgICBwb3J0OiA1MTM3LFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgdG9wTGV2ZWxBd2FpdCh7XG4gICAgICAgIHByb21pc2VFeHBvcnROYW1lOiAnX190bGEnLFxuICAgICAgICBwcm9taXNlSW1wb3J0TmFtZTogaSA9PiBgX190bGFfJHtpfWAsXG4gICAgICB9KSxcbiAgICAgIHRlcm1pbmFsKHtcbiAgICAgICAgb3V0cHV0OiBbJ2NvbnNvbGUnLCAndGVybWluYWwnXSxcbiAgICAgICAgc3RyaXA6IGZhbHNlLFxuICAgICAgfSksXG4gICAgICByZWFjdCgpLFxuICAgICAgdHNjb25maWdQYXRocygpLFxuICAgICAgLy8gbWtjZXJ0KCksXG4gICAgXSxcbiAgICBjc3M6IHtcbiAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgZ2VuZXJhdGVTY29wZWROYW1lOiBpc0RldmVsb3BtZW50ID8gJ1tuYW1lXV9fW2xvY2FsXV9fW2hhc2g6YmFzZTY0OjVdJyA6ICdbaGFzaDpiYXNlNjQ6NV0nLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHRlc3Q6IHtcbiAgICAgIGV4Y2x1ZGU6IFsnZTJlJywgJ25vZGVfbW9kdWxlcyddLFxuICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgICBzZXR1cEZpbGVzOiBbJy4vc3JjL3Rlc3RzLXNldHVwLnRzJ10sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1gsT0FBTyxXQUFXO0FBQ3BZLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sY0FBYztBQUNyQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWEsZUFBYTtBQUN2QyxRQUFNLGdCQUFnQixVQUFVLFNBQVM7QUFFekMsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUE7QUFBQSxJQUdSO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsY0FBYztBQUFBLFFBQ1osbUJBQW1CO0FBQUEsUUFDbkIsbUJBQW1CLE9BQUssU0FBUyxDQUFDO0FBQUEsTUFDcEMsQ0FBQztBQUFBLE1BQ0QsU0FBUztBQUFBLFFBQ1AsUUFBUSxDQUFDLFdBQVcsVUFBVTtBQUFBLFFBQzlCLE9BQU87QUFBQSxNQUNULENBQUM7QUFBQSxNQUNELE1BQU07QUFBQSxNQUNOLGNBQWM7QUFBQTtBQUFBLElBRWhCO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsUUFDUCxvQkFBb0IsZ0JBQWdCLHFDQUFxQztBQUFBLE1BQzNFO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLE1BQ0osU0FBUyxDQUFDLE9BQU8sY0FBYztBQUFBLE1BQy9CLGFBQWE7QUFBQSxNQUNiLFlBQVksQ0FBQyxzQkFBc0I7QUFBQSxJQUNyQztBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsV0FBVztBQUFBLElBQ2I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
