const config = {
  apiUrl: "/api",
  isProduction: process.env.NODE_ENV === "production",
  logoToken: process.env.LOGO_TOKEN,
} as const

export default config
