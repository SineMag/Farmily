import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { ProductCard } from '../products/ProductCard';
import { Button } from '../ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

export function WishlistPage() {
  const { state, dispatch } = useApp();
  const { wishlist } = state;

  const handleAddAllToCart = () => {
    wishlist.forEach(product => {
      dispatch({
        type: 'ADD_TO_CART',
        payload: { product, quantity: 1 }
      });
    });
  };

  const handleClearWishlist = () => {
    wishlist.forEach(product => {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-6">
          Save products you love to buy them later
        </p>
        <Button onClick={() => window.location.href = '/products'}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleAddAllToCart}
            disabled={wishlist.length === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add All to Cart
          </Button>
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            disabled={wishlist.length === 0}
          >
            Clear Wishlist
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}