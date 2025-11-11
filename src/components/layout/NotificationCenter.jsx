
import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks';

const initialNotifications = [
    { id: 1, text: 'New lead "Innovate Inc" assigned to you.', time: '5m ago', read: false },
    { id: 2, text: 'Deal "Project Phoenix" moved to Negotiation.', time: '1h ago', read: false },
    { id: 3, text: 'You were mentioned in a comment on "Synergy Corp".', time: '3h ago', read: true },
    { id: 4, text: 'Task "Follow up with client" is due tomorrow.', time: '1d ago', read: true },
];

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const { toast } = useToast();
    
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({...n, read: true})));
        toast({ title: "Notifications marked as read."});
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && <Badge>{unreadCount} New</Badge>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {notifications.map(notification => (
                    <DropdownMenuItem key={notification.id} className={`flex flex-col items-start gap-1 whitespace-normal ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                       <p className="text-sm">{notification.text}</p>
                       <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </DropdownMenuItem>
                ))}

                {notifications.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No new notifications</p>}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={markAllAsRead}>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    <span>Mark all as read</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationCenter;
