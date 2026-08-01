const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  isProduction: process.env.NODE_ENV === "production",
  logoToken: process.env.LOGO_TOKEN,
} as const

export default config
