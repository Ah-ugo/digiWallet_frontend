import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { initiateDeposit } from "../api";
import { useAuthStore } from "../store";
import {
  ArrowDownLeft,
  CreditCard,
  Wallet,
  RefreshCw,
  Copy,
  CheckCircle2,
} from "lucide-react";

export default function Deposit() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const user = useAuthStore((state) => state.user);

  const quickAmounts = [1000, 2000, 5000, 10000];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await initiateDeposit(parseFloat(data.amount));
      window.location.href = response.payment_url;
    } catch (error) {
      console.error("Deposit failed:", error);
      alert("Payment initialization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectQuickAmount = (amount) => {
    setValue("amount", amount);
    setSelectedAmount(amount);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ArrowDownLeft className="text-blue-600" size={20} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add Money</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Current Balance</p>
              <p className="text-3xl font-bold mt-1">
                ₦
                {user?.wallet_balance?.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <Wallet size={36} />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-3">
              <div className="flex items-center space-x-2">
                <CreditCard size={20} className="text-blue-600" />
                <span>Card Deposit</span>
              </div>
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Amount
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => selectQuickAmount(amount)}
                      className={`py-2 px-3 text-center rounded-lg border ${
                        selectedAmount === amount
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      ₦{amount.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
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
                    })}
                    className={`pl-8 block w-full rounded-lg border ${
                      errors.amount
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } py-3 shadow-sm text-lg`}
                    placeholder="Enter amount"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.amount.message ||
                      "Please enter a valid amount (minimum ₦100)"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg font-medium transition-colors"
              >
                {loading ? (
                  <>
                    <RefreshCw size={20} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </form>
          </div>

          {/* Bank Transfer Option */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-3">
              Bank Transfer
            </h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                Transfer directly to your dedicated account number:
              </p>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Account Number</p>
                  <button
                    onClick={() => copyToClipboard(user?.account_number)}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    {copied ? (
                      <CheckCircle2 size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>
                <p className="font-mono text-xl mb-1">
                  {user?.account_number || "0123456789"}
                </p>
                <p className="text-sm text-gray-500">
                  {user?.bank_name || "DigiWallet Bank"}
                </p>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Funds will reflect in your wallet balance immediately after your
                transfer is confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
