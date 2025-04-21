import React, { useState, useMemo } from "react";
import { deleteTransaction } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const TransactionList = ({ transactions, fetchTransactions, setEditing }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    await deleteTransaction(selectedId);
    fetchTransactions();
    setShowConfirm(false);
    setSelectedId(null);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedTransactions = useMemo(() => {
    let sorted = [...transactions];

    if (searchTerm) {
      sorted = sorted.filter((txn) =>
        Object.values(txn).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (sortConfig.direction === "asc") return valA > valB ? 1 : -1;
        else return valA < valB ? 1 : -1;
      });
    }

    return sorted;
  }, [transactions, sortConfig, searchTerm]);

  const totalPages = Math.ceil(getSortedTransactions.length / itemsPerPage);
  const paginatedData = getSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        Transaction List
      </h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="border px-3 py-2 w-full rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions to show.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-left">
              <tr>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Date {renderSortIcon("date")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center gap-2">
                    Amount (₹) {renderSortIcon("amount")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center gap-2">
                    Description {renderSortIcon("description")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center gap-2">
                    Category {renderSortIcon("category")}
                  </div>
                </th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              <AnimatePresence>
                {paginatedData.map((txn) => (
                  <motion.tr
                    key={txn._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{txn.date}</td>
                    <td className="px-4 py-3">{txn.amount}</td>
                    <td className="px-4 py-3">{txn.description}</td>
                    <td className="px-4 py-3">{txn.category}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => setEditing(txn)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(txn._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center z-50">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this transaction?
            </h3>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
