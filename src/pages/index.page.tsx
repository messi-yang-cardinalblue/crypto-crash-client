import type { NextPage, GetStaticProps } from 'next';
import { useSelector } from 'react-redux';
import { useContext, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppState, wrapper } from '@/stores';
import TokenCard from '@/components/TokenCard';
import GameContext from '@/contexts/GameContext';
import { getInitialLocale } from '@/utils/i18n';

const Home: NextPage = function Home() {
  const { login } = useContext(GameContext);
  const {
    game: { tokens },
  } = useSelector<AppState, AppState>((state) => state);

  useEffect(() => {
    login();
  });

  return (
    <main className="m-5">
      {tokens.map((token) => (
        <div key={token.id} className="mb-5">
          <TokenCard
            tokenId={token.id}
            tokenName={token.name}
            tokenPrice={token.price}
          />
        </div>
      ))}
    </main>
  );
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  () =>
    async ({ locale }) => ({
      props: {
        ...(await serverSideTranslations(getInitialLocale(locale), ['index'])),
      },
    })
);

export default Home;
