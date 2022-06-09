import { useCallback, useContext } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import GameContext, { Player } from '@/contexts/GameContext';

type Props = {
  player: Player | null;
};

function Table({ player }: Props) {
  const { tokens, exchangeToken } = useContext(GameContext);

  const handleBuyClick = useCallback((tokenId: string, amount: number) => {
    exchangeToken(tokenId, amount);
  }, []);

  const handleSellClick = useCallback((tokenId: string, amount: number) => {
    exchangeToken(tokenId, -amount);
  }, []);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Token
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Owns
            </th>
            <th scope="col" className="px-6 py-3">
              chart
            </th>
            <th scope="col" className="px-6 py-3">
              24hr Change
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
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
              <td className="px-6 py-4">{token.price}</td>
              <td className="px-6 py-4">
                {player?.tokenOwnerships[token.id].amount}
              </td>
              <td className="px-6 py-4">
                <Sparklines data={[5, 10, 5, 3, 5, 10, 5, 3, 5, 10, 5, 3]}>
                  <SparklinesLine
                    color="red"
                    style={{
                      strokeWidth: 3,
                    }}
                  />
                </Sparklines>
              </td>

              <td className="px-6 py-4 text-red-500">-0.4%</td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                    onClick={() => {
                      handleBuyClick(token.id, 1);
                    }}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                    onClick={() => {
                      handleSellClick(token.id, 1);
                    }}
                  >
                    Sell
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
