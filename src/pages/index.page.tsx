import type { NextPage, GetStaticProps } from 'next';
import { useContext, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { wrapper } from '@/stores';
import TokenTable from '@/components/TokenTable';
import GameContext from '@/contexts/GameContext';
import { getInitialLocale } from '@/utils/i18n';

const Home: NextPage = function Home() {
  const { login } = useContext(GameContext);

  useEffect(() => {
    login();
  });

  return (
    <main className="m-5">
      <TokenTable />
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
