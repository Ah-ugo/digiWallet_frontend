import React, { useEffect } from "react";
import { useAuthStore } from "../store";
import { getCurrentUser } from "../api";
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUser();
  }, [setUser]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {user?.name}!
      </h1>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="text-2xl font-bold">
                ₦{user?.wallet_balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Number</p>
              <p className="text-2xl font-bold">{user?.account_number}</p>
              <p className="text-sm text-gray-500">{user?.bank_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/transfer"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ArrowUpRight className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Send Money</h3>
              <p className="text-gray-500">Transfer to any bank account</p>
            </div>
          </div>
        </Link>

        <Link
          to="/deposit"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ArrowDownLeft className="text-orange-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Add Money</h3>
              <p className="text-gray-500">Fund your wallet</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
