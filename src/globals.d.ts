/// <reference types="vite/client" />

declare const __BUILD_DATE__: string
declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_CONTACT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
