import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  MoreVertical, 
  Search, 
  Clock, 
  Package,
  FileText,
  Share2,
  Download,
  Grid3x3,
  List,
  User
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Table, { TableRow, TableCell } from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import SessionOrderCard from '../components/SessionOrderCard';
import { getGroupedOrders, getOrders, updateOrderStatus } from '../services/orderService';
import { useSocket } from '../context/SocketContext';
import PrintableBill from '../components/billing/PrintableBill';

const statusVariants = {
  'Pending': 'amber',
  'Preparing': 'blue',
  'Ready': 'indigo',
  'Completed': 'green',
  'Cancelled': 'red',
  'ChangeRequested': 'yellow',
  'Updated': 'orange',
};

export default function Orders() {
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Billing State
  const [viewingBill, setViewingBill] = useState(null);

  const calculateBillData = (session) => {
    // Aggregate items
    const allItems = [];
    session.orders.forEach(order => {
      order.items.forEach(item => {
        const existing = allItems.find(
          i => i.name === item.name && JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
        );
        if (existing) {
          existing.quantity += item.quantity;
          existing.total = existing.quantity * existing.price;
        } else {
          allItems.push({ ...item, total: item.quantity * item.price });
        }
      });
    });

    return {
      billNumber: session.sessionId.slice(-8).toUpperCase(),
      createdAt: session.createdAt,
      orderType: session.orderType,
      items: allItems,
      subtotal: session.grossTotal,
      discount: session.discountAmount,
      gst: Math.round(session.grossTotal * 0.05), // Approximate if not stored, or verify logic
      grandTotal: session.totalAmount,
      paymentMode: session.paymentMode || 'Cash',
    };
  };

  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'individual'
  const [searchQuery, setSearchQuery] = useState('');
  
  const socket = useSocket();

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, [viewMode]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleSessionUpdate = ({ sessionId, orders }) => {
      console.log('📡 Received session update:', sessionId);
      
      // Calculate grouped session data
      const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const grossTotal = orders.reduce((sum, o) => sum + (o.grossTotal || o.totalAmount), 0);
      const discountAmount = orders.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
      
      // Determine status (priority: ChangeRequested > Updated > Pending > Preparing > Ready > Completed, but skip Cancelled if there are active orders)
      const statusPriority = {
        'Cancelled': 6,
        'ChangeRequested': 5,
        'Updated': 4,
        'Pending': 4,
        'Preparing': 3,
        'Ready': 2,
        'Completed': 1
      };
      // Filter out cancelled orders if there are any active orders
      const activeOrders = orders.filter(o => o.status !== 'Cancelled');
      const ordersToConsider = activeOrders.length > 0 ? activeOrders : orders;

      let worstStatus = 'Completed';
      ordersToConsider.forEach(order => {
        if (statusPriority[order.status] > statusPriority[worstStatus]) {
          worstStatus = order.status;
        }
      });

      // Determine session orderType and tableNumber (prioritize Dine-in)
      let sessionOrderType = orders[0]?.orderType;
      let sessionTableNumber = orders[0]?.tableNumber;

      const dineInOrder = orders.find(o => o.orderType === 'Dine-in');
      if (dineInOrder) {
        sessionOrderType = 'Dine-in';
        if (dineInOrder.tableNumber) {
          sessionTableNumber = dineInOrder.tableNumber;
        }
      }

      const groupedSession = {
        sessionId,
        userId: orders[0]?.userId,
        orders,
        totalAmount,
        grossTotal,
        discountAmount,
        status: worstStatus,
        orderType: sessionOrderType,
        tableNumber: sessionTableNumber,
        createdAt: orders[0]?.createdAt,
        updatedAt: orders[orders.length - 1]?.updatedAt
      };

      setGroupedOrders(prev => {
        const existingIndex = prev.findIndex(g => g.sessionId === sessionId);
        
        if (existingIndex >= 0) {
          // Update existing session
          const updated = [...prev];
          updated[existingIndex] = groupedSession;
          return updated;
        } else {
          // Add new session at the beginning
          return [groupedSession, ...prev];
        }
      });

      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('New Order', {
          body: `Order from ${orders[0]?.userId?.name || 'Guest'}`,
          icon: '/logo.png'
        });
      }
    };

    socket.on('sessionOrderUpdate', handleSessionUpdate);

    return () => {
      socket.off('sessionOrderUpdate', handleSessionUpdate);
    };
  }, [socket]);

  const fetchOrders = async () => {
    try {
      const data = viewMode === 'grouped' 
        ? await getGroupedOrders()
        : await getOrders();
      
      setGroupedOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = groupedOrders.filter(session => {
    // Filter by status
    const statusMatch = filter === 'All' || session.status === filter;
    
    // Filter by search query
    const searchMatch = searchQuery === '' || 
      session.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.userId?.mobile?.includes(searchQuery) ||
      session.sessionId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const updatedOrders = await updateOrderStatus(orderId, { status: newStatus });

      // Update the session in state
      if (Array.isArray(updatedOrders) && updatedOrders.length > 0) {
        const sessionId = updatedOrders[0].sessionId;

        // Calculate the grouped status using priority logic
        const statusPriority = {
          'Cancelled': 6,
          'ChangeRequested': 5,
          'Updated': 4,
          'Pending': 4,
          'Preparing': 3,
          'Ready': 2,
          'Completed': 1
        };
        // Filter out cancelled orders if there are any active orders
        const activeOrders = updatedOrders.filter(o => o.status !== 'Cancelled');
        const ordersToConsider = activeOrders.length > 0 ? activeOrders : updatedOrders;

        let worstStatus = 'Completed';
        ordersToConsider.forEach(order => {
          if (statusPriority[order.status] > statusPriority[worstStatus]) {
            worstStatus = order.status;
          }
        });

        setGroupedOrders(prev => prev.map(session => {
          if (session.sessionId === sessionId) {
            return {
              ...session,
              orders: updatedOrders,
              status: worstStatus
            };
          }
          return session;
        }));

        if (selectedSession?.sessionId === sessionId) {
          setSelectedSession({
            ...selectedSession,
            orders: updatedOrders,
            status: worstStatus
          });
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update order status');
    }
  };

  const openBillModal = (sessionData) => {
    setViewingBill(sessionData);
  };

  const openSessionDetails = (sessionData) => {
    setSelectedSession(sessionData);
    setIsModalOpen(true);
  };

  if (viewingBill) {
    return <PrintableBill bill={calculateBillData(viewingBill)} onBack={() => setViewingBill(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage customer orders grouped by visit sessions.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === 'grouped' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('grouped')}
            className="flex items-center"
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Grouped
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled', 'ChangeRequested', 'Updated'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
                  filter === s 
                    ? 'bg-red-50 text-red-600' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customer or session..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
            />
          </div>
        </div>

        <CardContent className="p-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={32} />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">No orders found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredOrders.map((session) => (
                <SessionOrderCard
                  key={session.sessionId}
                  sessionData={session}
                  onStatusUpdate={handleStatusUpdate}
                  onViewBill={() => openBillModal(session)}
                  onViewDetails={openSessionDetails}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Session Details - ${selectedSession?.userId?.name || 'Guest'}`}
        footer={
          <div className="flex space-x-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Close</Button>
            <Button className="flex-1" onClick={() => openBillModal(selectedSession)}>Generate Bill</Button>
          </div>
        }
      >
        {selectedSession && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{selectedSession.userId?.name || 'Guest'}</p>
                  <p className="text-xs text-slate-500">
                    {selectedSession.userId?.mobile} • {selectedSession.orderType}
                    {selectedSession.tableNumber && ` • Table ${selectedSession.tableNumber}`}
                  </p>
                </div>
              </div>
              <Badge variant={statusVariants[selectedSession.status]}>
                {selectedSession.status === 'ChangeRequested' ? 'Change Requested' : selectedSession.status === 'Updated' ? 'Order Updated' : selectedSession.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center uppercase tracking-wider">
                All Orders in Session ({selectedSession.orders.length})
                <span className="ml-2 h-px flex-1 bg-slate-100"></span>
              </h4>
              
              {selectedSession.orders.map((order, orderIdx) => (
                <div key={order._id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-600">
                      Order #{orderIdx + 1} • {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">₹{order.totalAmount}</span>
                  </div>

                  {/* Order Type and Table Info */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Package size={10} className="mr-1" />
                      {order.orderType}
                    </div>
                    {order.tableNumber && (
                      <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-red-500">
                        <Grid3x3 size={10} className="mr-1" />
                        Table {order.tableNumber}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between items-start text-sm">
                        <div className="flex items-start flex-1">
                          <span className="w-6 h-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold mr-3">
                            {item.quantity}x
                          </span>
                          <div>
                            <span className="text-slate-700 font-medium">{item.name}</span>
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.customizations.map((c, ci) => (
                                  <span key={ci} className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md border border-red-100">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-slate-900 ml-4">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-600">Total Orders:</span>
                <span className="font-semibold text-slate-900">{selectedSession.orders.length}</span>
              </div>
              {selectedSession.discountAmount > 0 && (
                <>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-semibold text-slate-900">₹{selectedSession.grossTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-green-600">Discount:</span>
                    <span className="font-semibold text-green-600">-₹{selectedSession.discountAmount}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-lg font-bold text-slate-800">Session Total</span>
                <span className="text-xl font-bold text-red-600">₹{selectedSession.totalAmount}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
