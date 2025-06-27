declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_API_URL?: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
} 