import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(configEnv => {
  const isDevelopment = configEnv.mode === 'development';

  return {
    server: {
      open: true,
      host: true,
    },
    plugins: [tsconfigPaths(), react()],
    css: {
      modules: {
        generateScopedName: isDevelopment ? '[name]__[local]__[hash:base64:5]' : '[hash:base64:5]',
      },
    },
  };
});
