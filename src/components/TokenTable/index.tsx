import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import ActionPanel from './ActionPanel';

function Table() {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              #
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
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
            >
              Badcoin
            </th>
            <td className="px-6 py-4">0</td>
            <td className="px-6 py-4">
              <Sparklines data={[5, 10, 5, 0]}>
                <SparklinesLine
                  color="red"
                  style={{
                    strokeWidth: 3,
                    // fillOpacity: "0"
                  }}
                />
              </Sparklines>
            </td>

            <td className="px-6 py-4 text-red-500">-0.4%</td>
            <td className="px-6 py-4 text-right">
              <ActionPanel />
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
            >
              Catcoin
            </th>
            <td className="px-6 py-4">4</td>
            <td className="px-6 py-4">
              <Sparklines data={[5, 10, 5, 20]}>
                <SparklinesLine
                  color="green"
                  style={{
                    strokeWidth: 3,
                    // fillOpacity: "0"
                  }}
                />
              </Sparklines>
            </td>
            <td className="px-6 py-4 text-green-500">1.35%</td>
            <td className="px-6 py-4 text-right">
              <ActionPanel />
            </td>
          </tr>
          <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
            >
              Lulu
            </th>
            <td className="px-6 py-4">10</td>
            <td className="px-6 py-4">
              <Sparklines data={[5, 10, 5, 20]}>
                <SparklinesLine
                  color="green"
                  style={{
                    strokeWidth: 3,
                  }}
                />
              </Sparklines>
            </td>
            <td className="px-6 py-4 text-green-500">0.3%</td>
            <td className="px-6 py-4 text-right">
              <ActionPanel />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
