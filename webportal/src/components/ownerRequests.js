import React, { useEffect, useState } from "react";

const GoogleFormResponses = () => {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [visibleData, setVisibleData] = useState([]);
  const [rowCount, setRowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch(
          `https://docs.google.com/spreadsheets/d/18-Wsg9S2yNYJ-HayREOC-aH_Gsja76Vsfo7ayqsi43U/edit?gid=1788562906#gid=1788562906`
        );
        const data = await response.text();

        if (data) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, "text/html");

          const waffleGrid = doc.querySelector("#waffle-grid-container");

          if (waffleGrid) {
            const table = waffleGrid.querySelector("table");
            const rows = Array.from(table.querySelectorAll("tr"));
            rows.shift();
            const headerRow = rows.shift();
            rows.shift();
            const limitedHeaders = Array.from(headerRow.children)
              .slice(0, 8)
              .map((cell) => cell.textContent);

            const bodyRows = rows.map((row) =>
              Array.from(row.children)
                .slice(0, 8)
                .map((cell) => cell.textContent)
            );

            setHeaders(limitedHeaders);
            setData(bodyRows);
          } else {
            setHeaders([]);
            setData([]);
          }
        } else {
          setHeaders([]);
          setData([]);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-red-600">
          Error fetching data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Field Owners Applications
        </h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 shadow-md rounded-md">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={`header-${index}`}
                    className="border border-gray-300 px-4 py-2 text-left font-medium"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleData.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className="even:bg-gray-50 hover:bg-gray-100"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={headers.length - 1} className="px-4 py-2">
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
                      {[10, 20, 50].map((value, i) => (
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
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoogleFormResponses;
