import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PaymentForm } from '../payment/PaymentForm';
import { toast } from 'sonner';

export function CartPage() {
  const { state, dispatch } = useApp();
  const { cart, currentUser } = state;
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState({
    address: currentUser?.address || '',
    phone: currentUser?.phone || '',
    deliveryNotes: ''
  });
  const [showPayment, setShowPayment] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      toast.success('Item removed from cart');
    } else {
      dispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: { productId, quantity: newQuantity }
      });
    }
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!checkoutData.address || !checkoutData.phone) {
      toast.error('Please fill in your delivery address and phone number');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    // Group items by farmer
    const ordersByFarmer = cart.reduce((acc: Record<string, typeof cart>, item) => {
      const farmerId = item.product.farmerId;
      if (!acc[farmerId]) {
        acc[farmerId] = [] as typeof cart;
      }
      acc[farmerId].push(item);
      return acc;
    }, {} as Record<string, typeof cart>);

    // Create separate orders for each farmer
    (Object.entries(ordersByFarmer) as [string, typeof cart][]).forEach(([farmerId, items]) => {
      const orderTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      const order = {
        id: `order_${Date.now()}_${farmerId}`,
        customerId: currentUser!.id,
        customerName: currentUser!.name,
        customerAddress: checkoutData.address,
        customerPhone: checkoutData.phone,
        items: items,
        total: orderTotal,
        status: 'pending' as const,
        farmerId: farmerId,
        createdAt: new Date().toISOString(),
        deliveryNotes: checkoutData.deliveryNotes,
        paymentData: paymentData
      };

      dispatch({ type: 'PLACE_ORDER', payload: order });
    });

    setShowPayment(false);
    toast.success('Order placed successfully!');
    navigate('/orders');
  };

  const getProductImage = (category: string) => {
    switch (category) {
      case 'produce':
        return 'https://images.unsplash.com/photo-1657288649124-b80bdee3c17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGZyZXNoJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NTg0MTQ3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      case 'dairy':
        return 'https://images.unsplash.com/photo-1756361946794-d7976ff5f765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZnJlc2glMjBlZ2dzJTIwZGFpcnl8ZW58MXx8fHwxNzU4NDE0NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      case 'livestock':
        return 'https://images.unsplash.com/photo-1683751397268-45f49bda55c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFzcyUyMGZlZCUyMGJlZWYlMjBjYXR0bGV8ZW58MXx8fHwxNzU4NDE0NzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      default:
        return '';
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">
          Start shopping to add items to your cart
        </p>
        <Button onClick={() => navigate('/products')}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cart.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <ImageWithFallback
                    src={getProductImage(item.product.category)}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3>{item.product.name}</h3>
                    <p className="text-sm text-gray-600">{item.product.farmerName}</p>
                    <p className="text-sm">R{item.product.price} {item.product.unit}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p>R{(item.product.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Checkout */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label className="block text-sm mb-1">Delivery Address</label>
                  <Input
                    value={checkoutData.address}
                    onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Phone Number</label>
                  <Input
                    value={checkoutData.phone}
                    onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Delivery Notes (Optional)</label>
                  <Input
                    value={checkoutData.deliveryNotes}
                    onChange={(e) => setCheckoutData({...checkoutData, deliveryNotes: e.target.value})}
                    placeholder="Special instructions..."
                  />
                </div>

                <Alert>
                  <AlertDescription>
                    Orders will be processed by individual farms. You may receive multiple deliveries.
                  </AlertDescription>
                </Alert>

                <Button className="w-full" onClick={handleCheckout}>
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {showPayment && (
        <PaymentForm
          total={total}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}