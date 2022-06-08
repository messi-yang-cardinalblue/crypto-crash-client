import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

export default function Table() {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              Color
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Price
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
              Apple MacBook Pro 17"
            </th>
            <td className="px-6 py-4">Sliver</td>
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
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </a>
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
            >
              Microsoft Surface Pro
            </th>
            <td className="px-6 py-4">White</td>
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
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </a>
            </td>
          </tr>
          <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
            >
              Magic Mouse 2
            </th>
            <td className="px-6 py-4">Black</td>
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
            <td className="px-6 py-4 text-green-500">0.3%</td>
            <td className="px-6 py-4 text-right">
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
