import { useContext } from 'react';
import GameContext from '@/contexts/GameContext';

function Table() {
  const { players } = useContext(GameContext);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              User name
            </th>
            <th scope="col" className="px-6 py-3">
              Rank
            </th>
            <th scope="col" className="px-6 py-3">
              Cash
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, playerIdx) => (
            <tr
              key={player.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
              >
                {player.name}
              </th>
              <td className="px-6 py-4">{playerIdx + 1}</td>
              <td className="px-6 py-4">{player.cash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
