// vite.config.ts
import { defineConfig } from 'file:///home/blokh/ballerine/ballerine/node_modules/.pnpm/vite@4.4.9_@types+node@20.4.1_less@4.2.0/node_modules/vite/dist/node/index.js';
import react from 'file:///home/blokh/ballerine/ballerine/node_modules/.pnpm/@vitejs+plugin-react@4.0.1_vite@4.4.9/node_modules/@vitejs/plugin-react/dist/index.mjs';
import dts from 'file:///home/blokh/ballerine/ballerine/node_modules/.pnpm/vite-plugin-dts@1.7.3_@types+node@20.4.1_vite@4.4.9/node_modules/vite-plugin-dts/dist/index.mjs';
import fg from 'file:///home/blokh/ballerine/ballerine/node_modules/.pnpm/fast-glob@3.3.0/node_modules/fast-glob/out/index.js';
import { resolve } from 'path';
import tailwindcss from 'file:///home/blokh/ballerine/ballerine/node_modules/.pnpm/tailwindcss@3.3.3_ts-node@10.9.1/node_modules/tailwindcss/lib/index.js';
var __vite_injected_original_dirname = '/home/blokh/ballerine/ballerine/packages/ui';
var entryPoints = ['src/components/**/*.ts'];
var files = fg.sync(entryPoints, { absolute: true });
var entities = files
  .filter(file => Boolean(file.match(/(?<=src\/)(?!.*\.test).*$/)))
  .map(file => {
    const [key] = file.match(/(?<=src\/).*$/) || [];
    const keyWithoutExt = key.replace(/\.[^.]*$/, '');
    return [keyWithoutExt, file];
  });
var entries = Object.fromEntries(entities);
var vite_config_default = defineConfig({
  plugins: [react(), dts({ copyDtsFiles: true }), tailwindcss()],
  resolve: {
    alias: {
      '@components': resolve(__vite_injected_original_dirname, './src/components'),
      '@common': resolve(__vite_injected_original_dirname, './src/common'),
      '@utils': resolve(__vite_injected_original_dirname, './src/utils'),
    },
  },
  test: {
    exclude: ['node_modules', 'dist'],
  },
  build: {
    outDir: 'dist',
    sourcemap: 'inline',
    lib: {
      entry: {
        ...entries,
        index: './src/index.ts',
      },
      formats: ['es'],
      name: 'ui',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
    minify: true,
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9ibG9raC9iYWxsZXJpbmUvYmFsbGVyaW5lL3BhY2thZ2VzL3VpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9ibG9raC9iYWxsZXJpbmUvYmFsbGVyaW5lL3BhY2thZ2VzL3VpL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Jsb2toL2JhbGxlcmluZS9iYWxsZXJpbmUvcGFja2FnZXMvdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5pbXBvcnQgZmcgZnJvbSAnZmFzdC1nbG9iJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcyc7XG5cbi8vIERlZmluZXMgYW4gYXJyYXkgb2YgZW50cnkgcG9pbnRzIHRvIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBmaWxlcy5cbmNvbnN0IGVudHJ5UG9pbnRzID0gWydzcmMvY29tcG9uZW50cy8qKi8qLnRzJ107XG5cbi8vIFNlYXJjaGVzIGZvciBmaWxlcyB0aGF0IG1hdGNoIHRoZSBwYXR0ZXJucyBkZWZpbmVkIGluIHRoZSBhcnJheSBvZiBpbnB1dCBwb2ludHMuXG4vLyBSZXR1cm5zIGFuIGFycmF5IG9mIGFic29sdXRlIGZpbGUgcGF0aHMuXG5jb25zdCBmaWxlcyA9IGZnLnN5bmMoZW50cnlQb2ludHMsIHsgYWJzb2x1dGU6IHRydWUgfSk7XG5cbi8vIE1hcHMgdGhlIGZpbGUgcGF0aHMgaW4gdGhlIFwiZmlsZXNcIiBhcnJheSB0byBhbiBhcnJheSBvZiBrZXktdmFsdWUgcGFpci5cbmNvbnN0IGVudGl0aWVzID0gZmlsZXNcbiAgLy9leGNsdWRpbmcgdGVzdCBmaWxlc1xuICAuZmlsdGVyKGZpbGUgPT4gQm9vbGVhbihmaWxlLm1hdGNoKC8oPzw9c3JjXFwvKSg/IS4qXFwudGVzdCkuKiQvKSkpXG4gIC5tYXAoZmlsZSA9PiB7XG4gICAgLy8gRXh0cmFjdCB0aGUgcGFydCBvZiB0aGUgZmlsZSBwYXRoIGFmdGVyIHRoZSBcInNyY1wiIGZvbGRlciBhbmQgYmVmb3JlIHRoZSBmaWxlIGV4dGVuc2lvbi5cbiAgICBjb25zdCBba2V5XSA9IGZpbGUubWF0Y2goLyg/PD1zcmNcXC8pLiokLykgfHwgW107XG5cbiAgICAvLyBSZW1vdmUgdGhlIGZpbGUgZXh0ZW5zaW9uIGZyb20gdGhlIGtleS5cbiAgICBjb25zdCBrZXlXaXRob3V0RXh0ID0ga2V5LnJlcGxhY2UoL1xcLlteLl0qJC8sICcnKTtcblxuICAgIHJldHVybiBba2V5V2l0aG91dEV4dCwgZmlsZV07XG4gIH0pO1xuXG4vLyBDb252ZXJ0IHRoZSBhcnJheSBvZiBrZXktdmFsdWUgcGFpcnMgdG8gYW4gb2JqZWN0IHVzaW5nIHRoZSBPYmplY3QuZnJvbUVudHJpZXMoKSBtZXRob2QuXG4vLyBSZXR1cm5zIGFuIG9iamVjdCB3aGVyZSBlYWNoIGtleSBpcyB0aGUgZmlsZSBuYW1lIHdpdGhvdXQgdGhlIGV4dGVuc2lvbiBhbmQgdGhlIHZhbHVlIGlzIHRoZSBhYnNvbHV0ZSBmaWxlIHBhdGguXG5jb25zdCBlbnRyaWVzID0gT2JqZWN0LmZyb21FbnRyaWVzKGVudGl0aWVzKTtcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgZHRzKHsgY29weUR0c0ZpbGVzOiB0cnVlIH0pLCB0YWlsd2luZGNzcygpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQGNvbXBvbmVudHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgICdAY29tbW9uJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21tb24nKSxcbiAgICAgICdAdXRpbHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3V0aWxzJyksXG4gICAgfSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGV4Y2x1ZGU6IFsnbm9kZV9tb2R1bGVzJywgJ2Rpc3QnXSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBzb3VyY2VtYXA6ICdpbmxpbmUnLFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHtcbiAgICAgICAgLi4uZW50cmllcyxcbiAgICAgICAgaW5kZXg6ICcuL3NyYy9pbmRleC50cycsXG4gICAgICB9LFxuICAgICAgZm9ybWF0czogWydlcyddLFxuICAgICAgbmFtZTogJ3VpJyxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC9qc3gtcnVudGltZSddLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICByZWFjdDogJ1JlYWN0JyxcbiAgICAgICAgICAncmVhY3QtZG9tJzogJ1JlYWN0RE9NJyxcbiAgICAgICAgICAncmVhY3QvanN4LXJ1bnRpbWUnOiAncmVhY3QvanN4LXJ1bnRpbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG1pbmlmeTogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVCxTQUFTLG9CQUFvQjtBQUNoVixPQUFPLFdBQVc7QUFDbEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sUUFBUTtBQUNmLFNBQVMsZUFBZTtBQUN4QixPQUFPLGlCQUFpQjtBQUx4QixJQUFNLG1DQUFtQztBQVF6QyxJQUFNLGNBQWMsQ0FBQyx3QkFBd0I7QUFJN0MsSUFBTSxRQUFRLEdBQUcsS0FBSyxhQUFhLEVBQUUsVUFBVSxLQUFLLENBQUM7QUFHckQsSUFBTSxXQUFXLE1BRWQsT0FBTyxVQUFRLFFBQVEsS0FBSyxNQUFNLDJCQUEyQixDQUFDLENBQUMsRUFDL0QsSUFBSSxVQUFRO0FBRVgsUUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLE1BQU0sZUFBZSxLQUFLLENBQUM7QUFHOUMsUUFBTSxnQkFBZ0IsSUFBSSxRQUFRLFlBQVksRUFBRTtBQUVoRCxTQUFPLENBQUMsZUFBZSxJQUFJO0FBQzdCLENBQUM7QUFJSCxJQUFNLFVBQVUsT0FBTyxZQUFZLFFBQVE7QUFFM0MsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsY0FBYyxLQUFLLENBQUMsR0FBRyxZQUFZLENBQUM7QUFBQSxFQUM3RCxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxlQUFlLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsTUFDcEQsV0FBVyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUM1QyxVQUFVLFFBQVEsa0NBQVcsYUFBYTtBQUFBLElBQzVDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUyxDQUFDLGdCQUFnQixNQUFNO0FBQUEsRUFDbEM7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxRQUNMLEdBQUc7QUFBQSxRQUNILE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxTQUFTLENBQUMsSUFBSTtBQUFBLE1BQ2QsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxTQUFTLGFBQWEsbUJBQW1CO0FBQUEsTUFDcEQsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsT0FBTztBQUFBLFVBQ1AsYUFBYTtBQUFBLFVBQ2IscUJBQXFCO0FBQUEsUUFDdkI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLEVBQ1Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
