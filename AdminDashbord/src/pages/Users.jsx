import React, { useState, useEffect } from 'react';
import { Search, UserMinus, UserCheck, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table, { TableRow, TableCell } from '../components/ui/Table';
import API_URL from '../config';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const toggleUserStatus = (id) => {
    // For now purely frontend toggle as backend doesn't support block yet
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Active' ? 'Blocked' : 'Active' } 
        : user
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl my-6">
        <p>{error}</p>
        <Button onClick={fetchUsers} variant="ghost" className="mt-2 text-red-700 hover:text-red-800">
          Try Again
        </Button>
      </div>
    );
  }

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
              placeholder="Search by name, email or phone..."
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
          {filteredUsers.length === 0 ? (
             <div className="p-8 text-center text-slate-500">
               No users found matching your search.
             </div>
          ) : (
            <Table headers={['User', 'Contact Info', 'Joined Date', 'Orders', 'Status', 'Actions']}>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                        {user.name ? user.name.slice(0, 2) : 'NA'}
                      </div>
                      <span className="font-semibold text-slate-800 capitalize">{user.name || 'Unknown User'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-slate-500">
                        <Mail size={12} className="mr-1.5" />
                        {user.email || 'N/A'}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <Phone size={12} className="mr-1.5" />
                        {user.phone || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-slate-600">
                      <Calendar size={14} className="mr-1.5" />
                      {user.joined ? new Date(user.joined).toLocaleDateString() : 'N/A'}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
