import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Filter, Search, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useData, useToast } from '@/hooks';
import CreateQuoteDialog from '@/components/quotes/CreateQuoteDialog';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

const QuotesPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data, updateData, addDataItem } = useData();
  const { toast } = useToast();

  const onQuoteCreated = (quote) => {
    addDataItem('quotes', quote);
    setCreateDialogOpen(false);
  };
  
  const handleDelete = (quoteId) => {
      const updatedQuotes = data.quotes.filter(q => q.id !== quoteId);
      updateData('quotes', updatedQuotes);
      toast({ title: "Quote Deleted", description: "The quote has been removed."});
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'Sent': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Accepted': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Helmet>
        <title>Quotes - CloudCRM</title>
        <meta name="description" content="Manage sales quotes" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quotes</h1>
            <p className="text-muted-foreground mt-1">Create and manage sales quotes</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Quote
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search quotes..." className="pl-10" />
              </div>
              <Button variant="outline" onClick={() => toast({title: "Filter", description:"🚧 Not implemented"})}>
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            {data.quotes.map((quote, index) => (
                <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-4 items-center">
                        <p className="font-semibold text-foreground">{quote.quoteNumber}</p>
                        <p className="text-sm text-muted-foreground col-span-2">{quote.deal}</p>
                        <div className="flex items-center justify-end space-x-4">
                           <p className="font-medium text-foreground">${quote.total.toLocaleString()}</p>
                           <Badge className={getStatusBadge(quote.status)}>{quote.status}</Badge>
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View</DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(quote.id)} className="text-red-500">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                    </div>
                </Card>
                </motion.div>
            ))}
            </div>
          </CardContent>
        </Card>

        <CreateQuoteDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onQuoteCreated={onQuoteCreated} />
      </div>
    </>
  );
};

export default QuotesPage;