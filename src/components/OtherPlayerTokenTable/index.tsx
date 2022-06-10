import { useContext } from 'react';
import accounting from 'accounting';
import Profile from '@/components/Profile';
import GameContext, { Player } from '@/contexts/GameContext';

type Props = {
  player: Player;
};

function Table({ player }: Props) {
  const { tokens } = useContext(GameContext);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <Profile player={player} />
      <table className="mt-5 w-full text-sm text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Token
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Owned Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr
              key={token.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
              >
                {token.name}
              </th>
              <td className="px-6 py-4">
                {accounting.formatMoney(token.price, '$', 2)}
              </td>

              <td className="px-6 py-4">
                {player.tokenOwnerships[token.id].amount}
              </td>
              <td className="px-6 py-4">
                {accounting.formatMoney(
                  player.tokenOwnerships[token.id].amount * token.price,
                  '$',
                  2
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
