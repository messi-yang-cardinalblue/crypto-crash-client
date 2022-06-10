import type { NextPage, GetStaticProps } from 'next';
import { useContext, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Toaster } from 'react-hot-toast';
import { Modal } from 'react-responsive-modal';
import { wrapper } from '@/stores';
import PlayerTable from '@/components/PlayerTable';
import OtherPlayerTokenTable from '@/components/OtherPlayerTokenTable';
import TokenTable from '@/components/TokenTable';
import TokenPriceChart from '@/components/TokenPriceChart';
import NameInputForm from '@/components/NameInputForm';
import Profile from '@/components/Profile';
import GameContext, { Player } from '@/contexts/GameContext';
import { getInitialLocale } from '@/utils/i18n';

const Home: NextPage = function Home() {
  const { player, playerMap, requestedToken, login, requestTokenData } =
    useContext(GameContext);
  const [otherPlayer, setOtherPlayer] = useState<Player | null>(null);
  const [displayOtherPlayerModal, setDisplayOtherPlayerModal] =
    useState<boolean>(false);
  const [displayTokenChartModal, setDisplayTokenChartModal] =
    useState<boolean>(false);

  const handleNameSubmit = (name: string) => {
    login(name);
  };

  const handlePlayerClick = (playerId: string) => {
    setOtherPlayer(playerMap[playerId] || null);
    setDisplayOtherPlayerModal(true);
  };

  const handleDisplayOtherPlayerModalClose = () => {
    setDisplayOtherPlayerModal(false);
  };

  const handleChartClick = (tokenId: string) => {
    requestTokenData(tokenId);
    setDisplayTokenChartModal(true);
  };

  const handleDisplayTokenChartModalClose = () => {
    setDisplayTokenChartModal(false);
  };

  return (
    <main className="">
      {!player && (
        <div>
          <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="w-4/5 max-w-screen-md flex flex-col items-center justify-center gap-y-20 gap-x-4">
              <div className="text-6xl font-semibold text-gray-800">
                Crypto Cra$h
              </div>
              <div className="text-lg font-normal text-center text-gray-500">
                Welcome to Crypto Cra$h
              </div>
              <NameInputForm onSubmit={handleNameSubmit} />
            </div>
          </div>
        </div>
      )}
      {player && (
        <div className="flex flex-col gap-y-5 pl-80 pt-5 pr-5 pb-5">
          <Profile player={player} />
          <div style={{ flexGrow: '5' }}>
            <TokenTable onTokenChartClick={handleChartClick} />
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
          onClose={handleDisplayOtherPlayerModalClose}
          center
        >
          <OtherPlayerTokenTable player={otherPlayer} />
        </Modal>
      )}
      {requestedToken && displayTokenChartModal && (
        <Modal
          styles={{
            root: { zIndex: '9999' },
            modal: {
              width: '50vw',
              height: '50vh',
              background: 'none',
              boxShadow: 'none',
            },
          }}
          open
          onClose={handleDisplayTokenChartModalClose}
          center
        >
          <TokenPriceChart token={requestedToken} />
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
