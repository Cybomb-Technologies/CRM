import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Filter, Search, MoreVertical, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData, useToast } from '@/hooks';
import CreateTicketDialog from '@/components/tickets/CreateTicketDialog';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

const TicketsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data, updateData, addDataItem } = useData();
  const { toast } = useToast();

  const onTicketCreated = (ticket) => {
    addDataItem('tickets', ticket);
    setCreateDialogOpen(false);
  };
  
  const handleFilter = () => {
    toast({ title: "Filter", description: "🚧 Not implemented yet!" });
  };
  
  const handleDelete = (ticketId) => {
      const updatedTickets = (data.tickets || []).filter(t => t.id !== ticketId);
      updateData('tickets', updatedTickets);
      toast({ title: "Ticket Deleted", description: "The ticket has been removed."});
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Closed': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High': return 'border-red-500 text-red-500';
      case 'Medium': return 'border-yellow-500 text-yellow-500';
      case 'Low': return 'border-green-500 text-green-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <>
      <Helmet>
        <title>Tickets - CloudCRM</title>
        <meta name="description" content="Manage support tickets" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
            <p className="text-muted-foreground mt-1">Manage customer support requests</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tickets..." className="pl-10" />
              </div>
              <Button variant="outline" onClick={handleFilter}>
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            {(data.tickets || []).map((ticket, index) => (
                <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                           {ticket.status === 'Closed' ? <CheckCircle className="w-5 h-5 text-green-500"/> : <Clock className="w-5 h-5 text-yellow-500"/>}
                            <div>
                                <p className="font-semibold text-foreground">{ticket.subject}</p>
                                <p className="text-sm text-muted-foreground">For {ticket.contact} - Created on {new Date(ticket.created).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                           <Badge variant="outline" className={getPriorityBadge(ticket.priority)}>{ticket.priority}</Badge>
                           <Badge className={getStatusBadge(ticket.status)}>{ticket.status}</Badge>
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(ticket.id)} className="text-red-500">Delete</DropdownMenuItem>
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

        <CreateTicketDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onTicketCreated={onTicketCreated} />
      </div>
    </>
  );
};

export default TicketsPage;