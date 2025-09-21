import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ShoppingCart, Heart, User, LogOut, Tractor, Truck } from 'lucide-react';

export function Header() {
  const { state, dispatch } = useApp();
  const { currentUser, cart, wishlist } = state;

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Tractor className="h-8 w-8 text-green-600" />
              <span className="text-xl text-green-600">Farmily</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-green-600">
              Browse Products
            </Link>
            {currentUser?.role === 'customer' && (
              <Link to="/orders" className="text-gray-700 hover:text-green-600">
                My Orders
              </Link>
            )}
            {currentUser?.role === 'farmer' && (
              <Link to="/farmer/dashboard" className="text-gray-700 hover:text-green-600">
                Dashboard
              </Link>
            )}
            {currentUser?.role === 'driver' && (
              <Link to="/driver/dashboard" className="text-gray-700 hover:text-green-600">
                Deliveries
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {currentUser.role === 'customer' && (
                  <>
                    <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-green-600">
                      <Heart className="h-6 w-6" />
                      {wishlist.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center">
                          {wishlist.length}
                        </Badge>
                      )}
                    </Link>
                    <Link to="/cart" className="relative p-2 text-gray-700 hover:text-green-600">
                      <ShoppingCart className="h-6 w-6" />
                      {cartItemsCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center">
                          {cartItemsCount}
                        </Badge>
                      )}
                    </Link>
                  </>
                )}
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {currentUser.role === 'farmer' && <Tractor className="h-4 w-4 text-green-600" />}
                    {currentUser.role === 'driver' && <Truck className="h-4 w-4 text-blue-600" />}
                    {currentUser.role === 'customer' && <User className="h-4 w-4 text-gray-600" />}
                    <span className="text-sm text-gray-700">{currentUser.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}