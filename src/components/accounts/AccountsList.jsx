import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Globe, Phone, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import AccountDetailSheet from './AccountDetailSheet';

const AccountsList = ({ accounts }) => {
  const { updateData } = useData();
  const { toast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const handleViewDetails = (account) => {
    setSelectedAccount(account);
    setDetailSheetOpen(true);
  };

  const handleDelete = (account) => {
    const updatedAccounts = accounts.filter(a => a.id !== account.id);
    updateData('accounts', updatedAccounts);
    toast({
      title: "Account Deleted",
      description: `${account.name} has been removed.`,
    });
  };

  const handleSaveAccount = (updatedAccount) => {
    const updatedAccounts = accounts.map(a => a.id === updatedAccount.id ? updatedAccount : a);
    updateData('accounts', updatedAccounts);
    setDetailSheetOpen(false);
  };
  
  if (!accounts || accounts.length === 0) {
    return <p className="text-center text-muted-foreground py-10">No accounts match your criteria.</p>
  }

  return (
    <>
      <div className="space-y-4">
        {accounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => handleViewDetails(account)}>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{account.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Globe className="w-4 h-4 mr-2" />
                      {account.website}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      {account.phone}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      {account.contacts} Contacts
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-xs text-muted-foreground">Industry: {account.industry}</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(account)}>View / Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(account)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <AccountDetailSheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen} account={selectedAccount} onSave={handleSaveAccount} />
    </>
  );
};

export default AccountsList;