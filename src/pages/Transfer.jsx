import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getBanks, initiateTransfer } from "../api";
import { useAuthStore } from "../store";
import {
  ArrowUpRight,
  Wallet,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle,
  CreditCard,
  ArrowRight,
  Building,
  FileText,
} from "lucide-react";

export default function Transfer() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(true);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [bankSearch, setBankSearch] = useState("");
  const [transferStatus, setTransferStatus] = useState(null); // 'success', 'error'

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const user = useAuthStore((state) => state.user);
  const watchAmount = watch("amount", "");
  const watchBankCode = watch("bankCode", "");

  useEffect(() => {
    const fetchBanks = async () => {
      setBankLoading(true);
      try {
        const data = await getBanks();
        if (Array.isArray(data)) {
          setBanks(data);
          setFilteredBanks(data);
        } else {
          // Handle case where data is not an array
          console.error("Banks data is not an array:", data);
          setBanks([]);
          setFilteredBanks([]);
        }
      } catch (error) {
        console.error("Failed to fetch banks:", error);
        setBanks([]);
        setFilteredBanks([]);
      } finally {
        setBankLoading(false);
      }
    };
    fetchBanks();
  }, []);

  useEffect(() => {
    if (!Array.isArray(banks) || banks.length === 0) return;

    const results = banks.filter((bank) => {
      // Safely access bank name property
      if (
        bank &&
        bank.bankName &&
        typeof bank.bankName.toLowerCase === "function"
      ) {
        return bank.bankName.toLowerCase().includes(bankSearch.toLowerCase());
      }
      return false;
    });

    setFilteredBanks(results);
  }, [bankSearch, banks]);

  const onSubmit = async (data) => {
    if (parseFloat(data.amount) > (user?.wallet_balance || 0)) {
      setError("amount", {
        type: "manual",
        message: "Insufficient balance for this transfer",
      });
      return;
    }

    setLoading(true);
    setTransferStatus(null);

    try {
      await initiateTransfer(
        parseFloat(data.amount),
        data.bankCode,
        data.accountNumber,
        data.narration || "Transfer"
      );
      setTransferStatus("success");
      reset();
    } catch (error) {
      console.error("Transfer failed:", error);
      setTransferStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransfer = () => {
    setTransferStatus(null);
    reset();
  };

  if (transferStatus === "success") {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center border border-green-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Transfer Successful!
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
            Your money is on its way to the recipient.
          </p>
          <button
            onClick={handleNewTransfer}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 w-full sm:w-auto"
          >
            Make Another Transfer
          </button>
        </div>
      </div>
    );
  }

  if (transferStatus === "error") {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center border border-red-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Transfer Failed
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
            We couldn't process your transfer. Please try again.
          </p>
          <button
            onClick={handleNewTransfer}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 w-full sm:w-auto"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      <div className="flex items-center space-x-3 mb-6 sm:mb-8">
        <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
          <ArrowUpRight className="text-blue-600" size={20} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Send Money
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 sm:p-7 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">
                Available Balance
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">
                ₦
                {(user?.wallet_balance || 0).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 bg-opacity-40 rounded-full flex items-center justify-center">
              <Wallet size={20} className="sm:hidden" />
              <Wallet size={24} className="hidden sm:block" />
            </div>
          </div>
        </div>

        {/* Transfer Steps */}
        <div className="flex justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-100 overflow-x-auto">
          <div className="flex items-center flex-shrink-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm">
              1
            </div>
            <span className="ml-1 sm:ml-2 text-gray-700 font-medium text-xs sm:text-sm whitespace-nowrap">
              Amount
            </span>
          </div>
          <ArrowRight
            size={14}
            className="text-gray-400 mx-1 sm:mx-2 flex-shrink-0"
          />
          <div className="flex items-center flex-shrink-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm">
              2
            </div>
            <span className="ml-1 sm:ml-2 text-gray-700 font-medium text-xs sm:text-sm whitespace-nowrap">
              Bank
            </span>
          </div>
          <ArrowRight
            size={14}
            className="text-gray-400 mx-1 sm:mx-2 flex-shrink-0"
          />
          <div className="flex items-center flex-shrink-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm">
              3
            </div>
            <span className="ml-1 sm:ml-2 text-gray-700 font-medium text-xs sm:text-sm whitespace-nowrap">
              Details
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-7">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {/* Amount Field */}
            <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-blue-50 rounded-md mr-2 sm:mr-3">
                  <CreditCard size={18} className="text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-800">
                  Amount
                </h3>
              </div>

              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Amount to Send
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center text-gray-500 text-base sm:text-lg">
                  ₦
                </span>
                <input
                  type="number"
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 100,
                      message: "Minimum amount is ₦100",
                    },
                    validate: (value) =>
                      parseFloat(value) <= (user?.wallet_balance || 0) ||
                      "Insufficient balance",
                  })}
                  className={`pl-8 sm:pl-9 block w-full rounded-lg border px-3 ${
                    errors.amount
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } py-2.5 sm:py-3 shadow-sm text-base sm:text-lg transition-all duration-200`}
                  placeholder="Enter amount"
                />
              </div>
              {errors.amount && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle size={12} className="mr-1" />{" "}
                  {errors.amount.message}
                </p>
              )}

              {watchAmount && !errors.amount && (
                <div className="mt-1.5 sm:mt-2 flex justify-between text-xs sm:text-sm bg-gray-50 p-2 sm:p-3 rounded-md">
                  <span className="text-gray-600 font-medium">
                    {parseFloat(watchAmount).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </span>
                  <span
                    className={`font-medium ${
                      parseFloat(watchAmount) > (user?.wallet_balance || 0)
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {parseFloat(watchAmount) > (user?.wallet_balance || 0)
                      ? "Insufficient balance"
                      : "Available"}
                  </span>
                </div>
              )}
            </div>

            {/* Bank Selection */}
            <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-blue-50 rounded-md mr-2 sm:mr-3">
                  <Building size={18} className="text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-800">
                  Bank Details
                </h3>
              </div>

              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Select Bank
              </label>
              <div className="relative mb-2 sm:mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder="Search banks"
                  className="pl-9 block w-full rounded-lg border border-gray-300 py-2.5 px-3 sm:py-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="relative">
                <select
                  {...register("bankCode", { required: "Bank is required" })}
                  className={`block w-full rounded-lg border px-3 ${
                    errors.bankCode
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } py-2.5 sm:py-3 shadow-sm text-gray-700 transition-all duration-200`}
                >
                  <option value="">Select a bank</option>
                  {bankLoading ? (
                    <option disabled>Loading banks...</option>
                  ) : (
                    Array.isArray(filteredBanks) &&
                    filteredBanks.map((bank) => (
                      <option
                        key={bank.bankCode || Math.random().toString()}
                        value={bank.bankCode}
                      >
                        {bank.bankName}
                      </option>
                    ))
                  )}
                </select>
                {bankLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <RefreshCw
                      size={16}
                      className="animate-spin text-gray-400"
                    />
                  </div>
                )}
              </div>
              {errors.bankCode && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle size={12} className="mr-1" />{" "}
                  {errors.bankCode.message}
                </p>
              )}

              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 mt-4 sm:mt-5">
                Account Number
              </label>
              <input
                type="text"
                {...register("accountNumber", {
                  required: "Account number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Enter a valid 10-digit account number",
                  },
                })}
                className={`block w-full rounded-lg border px-3 ${
                  errors.accountNumber
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                } py-2.5 sm:py-3 shadow-sm transition-all duration-200`}
                placeholder="Enter 10-digit account number"
                maxLength={10}
              />
              {errors.accountNumber && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle size={12} className="mr-1" />{" "}
                  {errors.accountNumber.message}
                </p>
              )}
            </div>

            {/* Narration */}
            <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-blue-50 rounded-md mr-2 sm:mr-3">
                  <FileText size={18} className="text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-800">
                  Transfer Details
                </h3>
              </div>

              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Narration (Optional)
              </label>
              <textarea
                {...register("narration")}
                rows={3}
                className="block w-full rounded-lg border border-gray-300 py-2.5 px-3 sm:py-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200"
                placeholder="What's this transfer for?"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full flex justify-center items-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-base sm:text-lg font-medium transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin mr-2 sm:mr-3" />
                  Processing...
                </>
              ) : (
                <>
                  Send Money
                  <ArrowUpRight size={18} className="ml-1.5 sm:ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
