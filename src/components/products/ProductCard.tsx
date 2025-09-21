import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Product } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Heart, ShoppingCart, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { state, dispatch } = useApp();
  const { currentUser, wishlist, cart } = state;

  const isInWishlist = wishlist.some(p => p.id === product.id);
  const cartItem = cart.find(item => item.product.id === product.id);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity: 1 }
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
      toast.success(`${product.name} removed from wishlist`);
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  // Get appropriate image for product
  const getProductImage = () => {
    if (product.category === 'produce') {
      return 'https://images.unsplash.com/photo-1657288649124-b80bdee3c17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGZyZXNoJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NTg0MTQ3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    } else if (product.category === 'dairy') {
      return 'https://images.unsplash.com/photo-1756361946794-d7976ff5f765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZnJlc2glMjBlZ2dzJTIwZGFpcnl8ZW58MXx8fHwxNzU4NDE0NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    } else if (product.category === 'livestock') {
      return 'https://images.unsplash.com/photo-1683751397268-45f49bda55c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFzcyUyMGZlZCUyMGJlZWYlMjBjYXR0bGV8ZW58MXx8fHwxNzU4NDE0NzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }
    return product.image;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'produce': return 'bg-green-100 text-green-800';
      case 'dairy': return 'bg-blue-100 text-blue-800';
      case 'livestock': return 'bg-red-100 text-red-800';
      case 'grains': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          <ImageWithFallback
            src={getProductImage()}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {currentUser?.role === 'customer' && (
            <Button
              variant="ghost"
              size="sm"
              className={`absolute top-2 right-2 p-2 rounded-full ${
                isInWishlist ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600'
              }`}
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
          )}
          <div className="absolute top-2 left-2">
            <Badge className={getCategoryColor(product.category)}>
              {product.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="mb-2">{product.name}</CardTitle>
        <CardDescription className="mb-3 text-sm">
          {product.description}
        </CardDescription>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{product.farmerName} • {product.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl">R{product.price}</span>
            <span className="text-sm text-gray-500 ml-1">{product.unit}</span>
          </div>
          <div className="text-sm text-gray-500">
            Stock: {product.stock}
          </div>
        </div>
        
        {currentUser?.role === 'customer' && (
          <div className="flex space-x-2">
            <Button 
              className="flex-1" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}
            </Button>
          </div>
        )}
        
        {product.stock === 0 && (
          <Badge variant="secondary" className="mt-2">
            Out of Stock
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}