import React, { useMemo,useEffect,useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { folderStructure } from "../data/folder-structure";
import { parseCSV } from "../utils/parse-csv";

const CSVTable = (props:any) => {
    const [data,setData] = useState([]);
    const columns = useMemo(() => {
        if (data.length === 0) return [];
        return Object.keys(data[0]).map((key) => ({
        Header: key,
        accessor: key,
        }));
    }, [data]);

    useEffect(()=>{
        const loadFolderData = async ()=>{
            const currFolder = folderStructure?.folders?.find((folder:any)=>folder?.id==props?.folderId);
            const filePath = `../../public/csv/${currFolder.name}/${props?.fileName}`;
            const parsedData = await parseCSV(filePath);
            setData(parsedData);
        };
        if(!props?.data){
            loadFolderData();
        }else{
            setData(props?.data);
        }
    },[])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex },
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      manualFiltering: true,
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useSortBy,
    usePagination
  );

  console.log(data);

  return (
    <div className="mb-8">
      <table {...getTableProps()} className="min-w-full border">
        <thead>
          {headerGroups.map((headerGroup:any) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-100">
              {headerGroup.headers.map((column:any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-2 px-4 border"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : " ↕️"}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row:any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-50">
                {row.cells.map((cell:any) => (
                  <td {...cell.getCellProps()} className="py-2 px-4 border">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-2">
        <div>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="py-1 px-3 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="ml-2 py-1 px-3 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div>
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {Math.ceil(data.length / 20)}
            </strong>
          </span>
        </div>
        <div>
          <select
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded p-1"
            defaultValue={20}
          >
            {[20, 50, 100, 1000, "All"].map((size) => (
              <option key={size} value={size === "All" ? data.length : size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CSVTable;
