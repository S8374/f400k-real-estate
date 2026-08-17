"use client";

import { useEffect, useState } from "react";
import { Mail, Loader2, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";
import config from "@/config";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/subscriber`, {
          credentials: 'include',
        });
        const json = await response.json();
        if (json.success) {
          setSubscribers(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch subscribers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const response = await fetch(`${config.baseUrl}/subscriber/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await response.json();
      
      if (json.success) {
        toast.success("Subscriber removed successfully");
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error("Failed to remove subscriber");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="h-6 w-6 text-[#00B37E]" />
            Newsletter Subscribers
          </h1>
          <p className="text-gray-400 mt-1">Manage users who subscribed to the newsletter.</p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Subscribed At</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-[#00B37E]" />
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-emerald-500" />
                        </div>
                        <span className="text-sm text-gray-200">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4 opacity-50" />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete subscriber"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
