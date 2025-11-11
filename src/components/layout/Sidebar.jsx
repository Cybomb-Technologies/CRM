import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserCircle, 
  TrendingUp, 
  CheckSquare, 
  Ticket, 
  Package, 
  FileText, 
  BarChart3, 
  Workflow, 
  Settings,
  ChevronLeft,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Leads', path: '/leads', icon: Users },
  { name: 'Accounts', path: '/accounts', icon: Building2 },
  { name: 'Contacts', path: '/contacts', icon: UserCircle },
  { name: 'Deals', path: '/deals', icon: TrendingUp },
  { name: 'Activities', path: '/activities', icon: CheckSquare },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Tickets', path: '/tickets', icon: Ticket },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Quotes', path: '/quotes', icon: FileText },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Workflows', path: '/workflows', icon: Workflow },
  { name: 'Settings', path: '/settings', icon: Settings }
];

const Sidebar = ({ open, setOpen }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-64 bg-card border-r flex flex-col"
        >
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-foreground">CloudCRM</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-accent rounded-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;