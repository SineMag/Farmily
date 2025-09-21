import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

export function OrdersPage() {
  const { state } = useApp();
  const { orders, currentUser } = state;

  const userOrders = orders.filter(order => order.customerId === currentUser?.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <Package className="h-4 w-4" />;
      case 'preparing': return <Package className="h-4 w-4" />;
      case 'out_for_delivery': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (userOrders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-6">
          You haven't placed any orders. Start shopping to see your orders here.
        </p>
        <Button onClick={() => window.location.href = '/products'}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">My Orders</h1>

      <div className="space-y-6">
        {userOrders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div>
                  <h4 className="mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span>{item.product.name}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                        <span>R{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h5 className="text-sm text-gray-600">Delivery Address:</h5>
                    <p className="text-sm">{order.customerAddress}</p>
                  </div>
                  <div>
                    <h5 className="text-sm text-gray-600">Total:</h5>
                    <p className="text-lg">R{order.total.toFixed(2)}</p>
                  </div>
                </div>

                {order.deliveryNotes && (
                  <div className="pt-2 border-t">
                    <h5 className="text-sm text-gray-600">Delivery Notes:</h5>
                    <p className="text-sm">{order.deliveryNotes}</p>
                  </div>
                )}

                {/* Order Tracking */}
                <div className="pt-4 border-t">
                  <h5 className="text-sm text-gray-600 mb-3">Order Progress:</h5>
                  <div className="flex items-center justify-between">
                    {['pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered'].map((step, index) => {
                      const isCompleted = ['accepted', 'preparing', 'out_for_delivery', 'delivered'].includes(order.status) && 
                        ['pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered'].indexOf(order.status) >= index;
                      const isCurrent = order.status === step;
                      
                      return (
                        <div key={step} className="flex flex-col items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                            isCompleted || isCurrent 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {getStatusIcon(step)}
                          </div>
                          <span className="text-xs mt-1 text-center">
                            {getStatusText(step)}
                          </span>
                          {index < 4 && (
                            <div className={`w-full h-0.5 mt-2 ${
                              isCompleted ? 'bg-green-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}