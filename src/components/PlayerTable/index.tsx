import { useContext } from 'react';
import accounting from 'accounting';
import GameContext from '@/contexts/GameContext';

type Props = {
  onPlayerClick: (playerId: string) => any;
};

function Table({ onPlayerClick }: Props) {
  const {
    players,
    calculatePlayerPortfolioValue,
    calculatePlayerAvatarNumber,
  } = useContext(GameContext);

  const handlePlayerClick = (playerId: string) => {
    onPlayerClick(playerId);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 cursor-pointer">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Rank
            </th>
            <th scope="col" className="px-6 py-3">
              User name
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Cash
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Tokens
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {players
            .sort((playerA, playerB): number => {
              const tokenPropertyA = calculatePlayerPortfolioValue(playerA.id);
              const tokenPropertyB = calculatePlayerPortfolioValue(playerB.id);
              const propertyA = playerA.cash + tokenPropertyA;
              const propertyB = playerB.cash + tokenPropertyB;
              return propertyB - propertyA;
            })
            .map((player, playerIdx) => (
              <tr
                key={player.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => {
                  handlePlayerClick(player.id);
                }}
              >
                <th scope="row" className="px-6 py-4">
                  {playerIdx + 1}
                </th>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  <div className="flex items-center">
                    {player && player.id && (
                      <img
                        className="w-8 h-8 rounded-full shadow-md"
                        src={`https://avatars.dicebear.com/api/pixel-art/${calculatePlayerAvatarNumber(
                          player.id
                        )}.svg`}
                        alt="avatar"
                      />
                    )}
                    <span className="ml-2">{player.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {accounting.formatMoney(
                    Math.round(player.cash * 1) / 1,
                    '$',
                    0
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {accounting.formatMoney(
                    calculatePlayerPortfolioValue(player.id),
                    '$',
                    0
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {accounting.formatMoney(
                    Math.round(player.cash * 1) / 1 +
                      calculatePlayerPortfolioValue(player.id),

                    '$',
                    0
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
