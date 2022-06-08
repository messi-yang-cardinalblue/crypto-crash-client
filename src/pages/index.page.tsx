import type { NextPage, GetStaticProps } from 'next';
import { useContext, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { wrapper } from '@/stores';
import PlayerTable from '@/components/PlayerTable';
import TokenTable from '@/components/TokenTable';
import GameContext from '@/contexts/GameContext';
import { getInitialLocale } from '@/utils/i18n';

const Home: NextPage = function Home() {
  const { login } = useContext(GameContext);

  useEffect(() => {
    login();
  }, []);

  return (
    <main>
      <div className="flex flex-row">
        <div className="p-5" style={{ flexGrow: '5' }}>
          <PlayerTable />
        </div>
        <div className="p-5" style={{ flexGrow: '5' }}>
          <TokenTable />
        </div>
      </div>
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
