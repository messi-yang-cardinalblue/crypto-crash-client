import type { NextPage, GetStaticProps } from 'next';
import { useContext } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Toaster } from 'react-hot-toast';
import { wrapper } from '@/stores';
import PlayerTable from '@/components/PlayerTable';
import TokenTable from '@/components/TokenTable';
import NameInputForm from '@/components/NameInputForm';
import GameContext from '@/contexts/GameContext';
import { getInitialLocale } from '@/utils/i18n';

const Home: NextPage = function Home() {
  const { player, login } = useContext(GameContext);

  const handleNameSubmit = (name: string) => {
    login(name);
  };

  return (
    <main className="bg-gray-100 min-h-screen h-screen min-h-screen">
      {!player && (
        <div className="h-full w-full flex items-center justify-center">
          <NameInputForm onSubmit={handleNameSubmit} />
        </div>
      )}
      {player && (
        <div className="flex flex-col">
          <div className="p-5" style={{ flexGrow: '5' }}>
            <TokenTable player={player} />
          </div>
          <div className="p-5" style={{ flexGrow: '5' }}>
            <PlayerTable />
          </div>
        </div>
      )}
      <Toaster />
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
