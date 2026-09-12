// Global environment type declarations

export {}

declare global {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly ANALYZE?: string
    readonly EXPORT?: string
    readonly [key: string]: string | undefined
  }
}
