import { useEffect, useState } from "react";

const LazyLoadingTable = ({
  columns = [],
  data = [],
  className = "",
  style = {},
  rowLoad = [10, 20, 50],
}) => {
  const [visibleData, setVisibleData] = useState([]);
  const [rowCount, setRowCount] = useState(rowLoad[0]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const start = currentPage * rowCount;
    const end = start + rowCount;
    setVisibleData(data.slice(start, end));
  }, [rowCount, currentPage, data]);

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className={`overflow-x-auto ${className}`} style={style}>
      <table className="table-auto w-full border-collapse border border-gray-200 shadow-md rounded-md">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((name, i) => (
              <th
                key={`column-${i}`}
                className="border border-gray-300 px-4 py-2 text-left font-medium"
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleData.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-gray-50 hover:bg-gray-100">
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th
                    scope="row"
                    key={`row-header-${rowIndex}-${cellIndex}`}
                    className="border border-gray-300 px-4 py-2 font-medium"
                  >
                    {cell}
                  </th>
                ) : (
                  <td
                    key={`row-data-${rowIndex}-${cellIndex}`}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
          <tr>
            <td colSpan={columns.length - 1} className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <label htmlFor="row-count" className="text-sm font-medium">
                  Rows per page:
                </label>
                <select
                  id="row-count"
                  className="border border-gray-300 px-2 py-1 rounded text-sm"
                  value={rowCount}
                  onChange={(e) => setRowCount(Number(e.target.value))}
                >
                  {rowLoad.map((value, i) => (
                    <option key={i} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </td>
            <td className="px-4 py-2 text-right">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  className={`px-3 py-1 text-sm border border-gray-300 rounded ${
                    currentPage === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    currentPage >= Math.ceil(data.length / rowCount) - 1
                  }
                  className={`px-3 py-1 text-sm border border-gray-300 rounded ${
                    currentPage >= Math.ceil(data.length / rowCount) - 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LazyLoadingTable;
