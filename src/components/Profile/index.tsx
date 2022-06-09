import { useContext } from 'react';
import accounting from 'accounting';
import GameContext, { Player } from '@/contexts/GameContext';

type Props = {
  player: Player;
};

function Portfolio({ player }: Props) {
  const {
    calculatePlayerPortfolioValue,
    calculateRank,
    calculatePlayerAvatarNumber,
  } = useContext(GameContext);

  return (
    <div className="flex items-center p-6 bg-white min-w-min rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <div className="w-24 h-24 mr-4">
        {player && (
          <img
            className="w-24 h-24 rounded-full shadow-md"
            src={`https://avatars.dicebear.com/api/pixel-art/${calculatePlayerAvatarNumber(
              player.id
            )}.svg`}
            alt="avatar"
          />
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex gap-px">
          <p className="text-lg font-normal text-gray-700 dark:text-gray-400">
            {player?.name}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400 mx-1">•</p>
          <p className="text-lg font-normal text-gray-700 dark:text-gray-400">
            Rank #{player && calculateRank(player.id)}
          </p>
        </div>
        <div className="flex items-center">
          <h5 className="mb-0 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {player
              ? accounting.formatMoney(
                  player.cash + calculatePlayerPortfolioValue(player.id),
                  '$',
                  3
                )
              : 0}
          </h5>
          <div className="mx-2" />
          {player && (
            <div className="mb-0 text-md h-5 text-gray-600 font-normal tracking-tight dark:text-white">
              {`Cash: ${accounting.formatMoney(
                player.cash,
                '$',
                3
              )} | Portfolio Value: ${accounting.formatMoney(
                calculatePlayerPortfolioValue(player.id),
                '$',
                3
              )}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// <div className="ml-2 font-normal text-sm text-white dark:text-gray-400 bg-green-400 p-1 rounded min-h-min h-7">
//   +4.75%
// </div>
export default Portfolio;
