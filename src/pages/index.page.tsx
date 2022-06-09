import type { NextPage, GetStaticProps } from 'next';
import { useContext, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Toaster } from 'react-hot-toast';
import { Modal } from 'react-responsive-modal';
import { wrapper } from '@/stores';
import PlayerTable from '@/components/PlayerTable';
import OtherPlayerTokenTable from '@/components/OtherPlayerTokenTable';
import TokenTable from '@/components/TokenTable';
import NameInputForm from '@/components/NameInputForm';
import Profile from '@/components/Profile';
import GameContext, { Player } from '@/contexts/GameContext';
import { getInitialLocale } from '@/utils/i18n';

const Home: NextPage = function Home() {
  const { player, playerMap, login } = useContext(GameContext);
  const [otherPlayer, setOtherPlayer] = useState<Player | null>(null);
  const [displayOtherPlayerModal, setDisplayOtherPlayerModal] =
    useState<boolean>(false);

  const handleNameSubmit = (name: string) => {
    login(name);
  };

  const handlePlayerClick = (playerId: string) => {
    setOtherPlayer(playerMap[playerId] || null);
    setDisplayOtherPlayerModal(true);
  };

  const handleModalClose = () => {
    setDisplayOtherPlayerModal(false);
  };

  return (
    <main className="bg-gray-100 min-h-screen min-h-screen">
      {!player && (
        <div className="h-full w-full flex items-center justify-center">
          <NameInputForm onSubmit={handleNameSubmit} />
        </div>
      )}
      {player && (
        <div className="flex flex-col gap-y-5 pl-80 pt-5 pr-5 pb-5">
          <Profile player={player} />
          <div style={{ flexGrow: '5' }}>
            <TokenTable />
          </div>
          <div style={{ flexGrow: '5' }}>
            <PlayerTable onPlayerClick={handlePlayerClick} />
          </div>
        </div>
      )}
      {otherPlayer && displayOtherPlayerModal && (
        <Modal
          styles={{
            root: { zIndex: '9999' },
            modal: { background: 'none', boxShadow: 'none' },
          }}
          open
          onClose={handleModalClose}
          center
        >
          <OtherPlayerTokenTable player={otherPlayer} />
        </Modal>
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
