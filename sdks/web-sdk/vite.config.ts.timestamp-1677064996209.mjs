// vite.config.ts
import { defineConfig, loadEnv } from "file:///home/o/work/ballerine/node_modules/.pnpm/vite@4.0.3_@types+node@18.11.17/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///home/o/work/ballerine/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@1.0.8_svelte@3.55.0+vite@4.0.3/node_modules/@sveltejs/vite-plugin-svelte/dist/index.js";
import { resolve } from "path";
import dts from "file:///home/o/work/ballerine/node_modules/.pnpm/vite-plugin-dts@1.7.1_vite@4.0.3/node_modules/vite-plugin-dts/dist/index.mjs";
import { visualizer } from "file:///home/o/work/ballerine/node_modules/.pnpm/rollup-plugin-visualizer@5.8.3/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "/home/o/work/ballerine/sdks/web-sdk";
var vite_config_default = ({ mode }) => {
  console.log("building with vite...", mode);
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    build: {
      sourcemap: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 300,
      rollupOptions: {
        output: {
          format: "umd",
          inlineDynamicImports: true,
          banner: `/*! Ballerine SDK - v${env.npm_package_version} - ${env.NODE_ENV}-build */`
        }
      },
      lib: {
        entry: resolve(__vite_injected_original_dirname, "src/main.ts"),
        name: "BallerineSDK",
        formats: ["es", "umd"],
        fileName: "ballerine-sdk"
      }
    },
    plugins: [
      svelte({ emitCss: false }),
      dts({
        insertTypesEntry: true
      }),
      visualizer()
    ],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9vL3dvcmsvYmFsbGVyaW5lL3Nka3Mvd2ViLXNka1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvby93b3JrL2JhbGxlcmluZS9zZGtzL3dlYi1zZGsvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvby93b3JrL2JhbGxlcmluZS9zZGtzL3dlYi1zZGsvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgdHlwZSB7IFVzZXJDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcblxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiB7IG1vZGU6IFVzZXJDb25maWdbJ21vZGUnXSB9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdidWlsZGluZyB3aXRoIHZpdGUuLi4nLCBtb2RlKTtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xuICAgIGJ1aWxkOiB7XG4gICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogdHJ1ZSxcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMzAwLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBmb3JtYXQ6ICd1bWQnLFxuICAgICAgICAgIGlubGluZUR5bmFtaWNJbXBvcnRzOiB0cnVlLFxuICAgICAgICAgIGJhbm5lcjogYC8qISBCYWxsZXJpbmUgU0RLIC0gdiR7ZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb259IC0gJHtlbnYuTk9ERV9FTlZ9LWJ1aWxkICovYCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBsaWI6IHtcbiAgICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL21haW4udHMnKSxcbiAgICAgICAgbmFtZTogJ0JhbGxlcmluZVNESycsXG4gICAgICAgIGZvcm1hdHM6IFsnZXMnLCAndW1kJ10sXG4gICAgICAgIGZpbGVOYW1lOiAnYmFsbGVyaW5lLXNkaycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgc3ZlbHRlKHsgZW1pdENzczogZmFsc2UgfSksXG4gICAgICBkdHMoe1xuICAgICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuICAgICAgfSksXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1jYWxsXG4gICAgICB2aXN1YWxpemVyKCksXG4gICAgXSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIF9fQVBQX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYubnBtX3BhY2thZ2VfdmVyc2lvbiksXG4gICAgfSxcbiAgfSk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLFNBQVMsY0FBYztBQUN2QixTQUFTLGVBQWU7QUFDeEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsa0JBQWtCO0FBTDNCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBb0M7QUFDekQsVUFBUSxJQUFJLHlCQUF5QixJQUFJO0FBQ3pDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxTQUFPLGFBQWE7QUFBQSxJQUNsQixPQUFPO0FBQUEsTUFDTCxXQUFXO0FBQUEsTUFDWCxzQkFBc0I7QUFBQSxNQUN0Qix1QkFBdUI7QUFBQSxNQUN2QixlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixzQkFBc0I7QUFBQSxVQUN0QixRQUFRLHdCQUF3QixJQUFJLHlCQUF5QixJQUFJO0FBQUEsUUFDbkU7QUFBQSxNQUNGO0FBQUEsTUFDQSxLQUFLO0FBQUEsUUFDSCxPQUFPLFFBQVEsa0NBQVcsYUFBYTtBQUFBLFFBQ3ZDLE1BQU07QUFBQSxRQUNOLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxRQUNyQixVQUFVO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU8sRUFBRSxTQUFTLE1BQU0sQ0FBQztBQUFBLE1BQ3pCLElBQUk7QUFBQSxRQUNGLGtCQUFrQjtBQUFBLE1BQ3BCLENBQUM7QUFBQSxNQUVELFdBQVc7QUFBQSxJQUNiO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixpQkFBaUIsS0FBSyxVQUFVLFFBQVEsSUFBSSxtQkFBbUI7QUFBQSxJQUNqRTtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogW10KfQo=
