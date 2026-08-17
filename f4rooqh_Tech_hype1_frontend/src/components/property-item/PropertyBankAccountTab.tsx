"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Landmark, Shield, Copy } from "lucide-react";
import ConfirmDeleteDialog from "../shared/ConfirmDeleteDialog";

interface PropertyBankAccountTabProps {
  bankAccounts: any[];
  hasBankAccount: boolean;
  setBankModalOpen: (val: boolean) => void;
  setSelectedBankAccount: (account: any) => void;
  setEditBankModalOpen: (val: boolean) => void;
  deleteBankLoading: boolean;
  handleDeleteBankAccount: (id: string) => void;
  formatIBAN: (iban: string) => string;
  copyToClipboard: (text: string, label: string) => void;
}

export function PropertyBankAccountTab({
  bankAccounts,
  hasBankAccount,
  setBankModalOpen,
  setSelectedBankAccount,
  setEditBankModalOpen,
  deleteBankLoading,
  handleDeleteBankAccount,
  formatIBAN,
  copyToClipboard,
}: PropertyBankAccountTabProps) {
  return (
    <TabsContent value="bank-account" className="mt-4">
      <div className="flex justify-between items-center bg-stone-900 p-3 rounded border border-stone-800 mb-4">
        <p className="text-stone-400 text-sm">
          Manage bank accounts linked to this property.
        </p>
        {!hasBankAccount && (
          <Button
            onClick={() => setBankModalOpen(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded"
          >
            <Plus className="h-4 w-4" /> Add Bank Account
          </Button>
        )}
      </div>
      {bankAccounts && bankAccounts.length > 0 ? (
        <div className="space-y-4">
          {bankAccounts.map((account: any) => (
            <Card key={account.id} className="bg-stone-800/50 border-stone-700">
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {account.bankName}
                      <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </h3>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-stone-700">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-700 text-blue-400 hover:bg-blue-700/20"
                      onClick={() => {
                        setSelectedBankAccount(account);
                        setEditBankModalOpen(true);
                      }}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <ConfirmDeleteDialog
                      loading={deleteBankLoading}
                      onConfirm={() => handleDeleteBankAccount(account.id)}
                      title="Delete Bank Account?"
                      description="This bank account will be permanently deleted."
                      trigger={
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-700 text-red-400 hover:bg-red-700/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Account Holder</p>
                    <p className="text-sm font-medium text-white">
                      {account.accountHolder}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Account Number</p>
                    <p className="text-sm font-medium text-white">
                      {account.accountNumber}
                    </p>
                  </div>
                  {account.iban && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400">IBAN</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono text-white">
                          {formatIBAN(account.iban)}
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(account.iban, "IBAN")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {account.swiftCode && (
                    <div>
                      <p className="text-xs text-gray-400">SWIFT Code</p>
                      <p className="text-sm font-medium text-white">
                        {account.swiftCode}
                      </p>
                    </div>
                  )}
                  {account.branchAddress && (
                    <div>
                      <p className="text-xs text-gray-400">Branch Address</p>
                      <p className="text-sm font-medium text-white">
                        {account.branchAddress}
                      </p>
                    </div>
                  )}
                </div>

                {account.additionalInfo && (
                  <div className="bg-stone-900/50 p-3 rounded">
                    <p className="text-xs text-gray-400">
                      Additional Information
                    </p>
                    <p className="text-sm text-gray-300">
                      {account.additionalInfo}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-stone-800 rounded">
          <p className="text-lg text-white mb-2">No bank account added</p>
          <p className="text-sm text-gray-400 mb-4">
            Add a bank account for payment processing
          </p>
          <Button
            onClick={() => setBankModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded"
          >
            <Plus className="h-4 w-4" /> Add Bank Account
          </Button>
        </div>
      )}
    </TabsContent>
  );
}
