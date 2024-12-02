// src/pages/_app.tsx
import { ReservationProvider } from "@/app/context/ReservationContext";
import "@/app/globals.css";

import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Wrap the entire app with the ReservationProvider
    <ReservationProvider>
      <Component {...pageProps} />
    </ReservationProvider>
  );
}

export default MyApp;
