import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Package, DollarSign, ShoppingCart, Eye, Edit, Trash2 } from 'lucide-react';
import { ProductForm } from './ProductForm';

export function FarmerDashboard() {
  const { state, dispatch } = useApp();
  const { currentUser, products, orders } = state;
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const farmerProducts = products.filter(p => p.farmerId === currentUser?.id);
  const farmerOrders = orders.filter(o => o.farmerId === currentUser?.id);
  
  const totalRevenue = farmerOrders
    .filter(o => o.status === 'delivered')
    .reduce((total, order) => total + order.total, 0);

  const pendingOrders = farmerOrders.filter(o => o.status === 'pending');

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'accepted' | 'preparing' | 'cancelled') => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status: newStatus }
    });
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl">Farm Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
        </div>
        <Button onClick={() => setShowProductForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl">{farmerProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl">{farmerOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl">{pendingOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl">R{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {farmerProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No products yet</p>
                  <Button onClick={() => setShowProductForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {farmerProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3>{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm">R{product.price} {product.unit}</p>
                        <p className="text-sm">Stock: {product.stock}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product.id);
                            setShowProductForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              {farmerOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {farmerOrders
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3>Order #{order.id.slice(-8)}</h3>
                            <p className="text-sm text-gray-600">
                              {order.customerName} • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">{order.customerAddress}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                            <span>R{order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm mb-2">Items:</h4>
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {item.product.name} x{item.quantity}
                            </div>
                          ))}
                        </div>

                        {order.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, 'accepted')}
                            >
                              Accept Order
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                            >
                              Decline
                            </Button>
                          </div>
                        )}

                        {order.status === 'accepted' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                          >
                            Mark as Preparing
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          productId={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}