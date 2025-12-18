import React, { useState } from 'react';
import { Search, UserMinus, UserCheck, Mail, Phone, Calendar } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table, { TableRow, TableCell } from '../components/ui/Table';

const initialUsers = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', joined: 'Oct 12, 2023', status: 'Active', orders: 15 },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '+91 98765 11223', joined: 'Nov 05, 2023', status: 'Active', orders: 8 },
  { id: 3, name: 'Amit Verma', email: 'amit@example.com', phone: '+91 98765 55667', joined: 'Dec 01, 2023', status: 'Blocked', orders: 2 },
  { id: 4, name: 'Sneha Gupta', email: 'sneha@example.com', phone: '+91 99887 76655', joined: 'Jan 15, 2024', status: 'Active', orders: 24 },
  { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 91234 56789', joined: 'Feb 10, 2024', status: 'Active', orders: 0 },
];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Active' ? 'Blocked' : 'Active' } 
        : user
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Users Management</h1>
        <p className="text-slate-500 text-sm mt-1">View and manage registered customers.</p>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total Users: <span className="text-slate-900 font-bold">{users.length}</span>
          </div>
        </div>

        <CardContent className="p-0">
          <Table headers={['User', 'Contact Info', 'Joined Date', 'Orders', 'Status', 'Actions']}>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-slate-800">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-slate-500">
                      <Mail size={12} className="mr-1.5" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Phone size={12} className="mr-1.5" />
                      {user.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-slate-600">
                    <Calendar size={14} className="mr-1.5" />
                    {user.joined}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{user.orders} orders</span>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Active' ? 'green' : 'red'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleUserStatus(user.id)}
                    title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                  >
                    {user.status === 'Active' ? (
                      <UserMinus size={18} className="text-rose-500" />
                    ) : (
                      <UserCheck size={18} className="text-green-600" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
