import React, { useEffect, useState } from "react";
import { getTransactions } from "../api";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { useAuthStore } from "../store";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions(user._id);
      setTransactions(data.transactions || []);
      console.log(data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    return type === "deposit" ? (
      <div className="p-2 bg-green-100 rounded-lg">
        <ArrowDownLeft className="text-green-600" size={20} />
      </div>
    ) : (
      <div className="p-2 bg-red-100 rounded-lg">
        <ArrowUpRight className="text-red-600" size={20} />
      </div>
    );
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Transaction History
        </h1>
        <button
          onClick={fetchTransactions}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={fetchTransactions}
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Try again
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-2">No transactions found</p>
            <p className="text-sm text-gray-400">
              Transactions will appear here once you make a deposit or transfer.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.reference} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={
                          transaction.type === "deposit"
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {transaction.type === "deposit" ? "+" : "-"}₦
                        {formatAmount(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          transaction.status === "success"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(
                        new Date(transaction.timestamp),
                        "MMM d, yyyy HH:mm"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {transaction.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.type === "transfer" && (
                        <div className="text-gray-600">
                          <div>
                            <span className="text-gray-500">Bank:</span>{" "}
                            {transaction.recipient_bank_code}
                          </div>
                          <div>
                            <span className="text-gray-500">Account:</span>{" "}
                            {transaction.recipient_account_number}
                          </div>
                          {transaction.narration && (
                            <div>
                              <span className="text-gray-500">Note:</span>{" "}
                              {transaction.narration}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
