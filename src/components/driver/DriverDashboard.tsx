import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Truck, Package, MapPin, Phone, Clock } from 'lucide-react';

export function DriverDashboard() {
  const { state, dispatch } = useApp();
  const { orders, currentUser } = state;

  // Orders ready for delivery (preparing status)
  const availableDeliveries = orders.filter(o => o.status === 'preparing');
  
  // Orders assigned to this driver
  const myDeliveries = orders.filter(o => o.driverId === currentUser?.id);

  const handleAcceptDelivery = (orderId: string) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { 
        orderId, 
        status: 'out_for_delivery',
        driverId: currentUser!.id
      }
    });
  };

  const handleCompleteDelivery = (orderId: string) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status: 'delivered' }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedDeliveries = myDeliveries.filter(o => o.status === 'delivered').length;
  const activeDeliveries = myDeliveries.filter(o => o.status === 'out_for_delivery').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Truck className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-3xl">Driver Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available Deliveries</p>
                <p className="text-2xl">{availableDeliveries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Deliveries</p>
                <p className="text-2xl">{activeDeliveries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl">{completedDeliveries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>Available Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            {availableDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600">No deliveries available right now</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableDeliveries.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3>Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-gray-600">
                          {order.customerName}
                        </p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">
                        Ready for Pickup
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{order.customerAddress}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{order.customerPhone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 mr-2" />
                        <span>{order.items.length} item(s) • ${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.deliveryNotes && (
                      <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
                        <strong>Notes:</strong> {order.deliveryNotes}
                      </div>
                    )}

                    <Button
                      size="sm"
                      onClick={() => handleAcceptDelivery(order.id)}
                      className="w-full"
                    >
                      Accept Delivery
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>My Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            {myDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600">No assigned deliveries</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myDeliveries
                  .sort((a, b) => {
                    if (a.status === 'out_for_delivery' && b.status !== 'out_for_delivery') return -1;
                    if (a.status !== 'out_for_delivery' && b.status === 'out_for_delivery') return 1;
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  })
                  .map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3>Order #{order.id.slice(-8)}</h3>
                          <p className="text-sm text-gray-600">
                            {order.customerName}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status === 'out_for_delivery' ? 'In Transit' : 'Delivered'}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{order.customerAddress}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{order.customerPhone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {order.deliveryNotes && (
                        <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
                          <strong>Notes:</strong> {order.deliveryNotes}
                        </div>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteDelivery(order.id)}
                          className="w-full"
                        >
                          Mark as Delivered
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}