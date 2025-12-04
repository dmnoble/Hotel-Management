/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BACKEND_MODE: 'local' | 'http';
  // add any other VITE_* vars you use here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
