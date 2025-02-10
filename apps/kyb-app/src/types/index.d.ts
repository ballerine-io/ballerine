declare module '*.module.css';

declare global {
  interface Window {
    appVersion: string;
    toggleDevmode: () => void;
  }
}

export {};
