import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "./navigation";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navigation />
      <Component {...pageProps} />
    </AuthProvider>
  )
}
