import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { wrapper } from '@/stores';
import { Provider as GameContextProvider } from '@/contexts/GameContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameContextProvider>
      <Component {...pageProps} />
    </GameContextProvider>
  );
}

export default wrapper.withRedux(appWithTranslation(MyApp));
