import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Tractor, Truck, User, ShoppingCart, Leaf, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: "Fresh & Local",
      description: "Get the freshest produce directly from local farms in your area"
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-blue-600" />,
      title: "Easy Ordering",
      description: "Browse products, add to cart, and order with just a few clicks"
    },
    {
      icon: <Truck className="h-8 w-8 text-orange-600" />,
      title: "Fast Delivery",
      description: "Quick delivery from farm to your doorstep with real-time tracking"
    },
    {
      icon: <MapPin className="h-8 w-8 text-purple-600" />,
      title: "Support Local",
      description: "Support local farmers and strengthen your community"
    }
  ];

  const userTypes = [
    {
      icon: <User className="h-12 w-12 text-green-600" />,
      title: "Customer",
      description: "Shop fresh produce and farm products",
      action: "Start Shopping",
      link: "/products"
    },
    {
      icon: <Tractor className="h-12 w-12 text-blue-600" />,
      title: "Farmer",
      description: "Sell your products directly to customers",
      action: "Join as Farmer",
      link: "/register"
    },
    {
      icon: <Truck className="h-12 w-12 text-orange-600" />,
      title: "Driver",
      description: "Deliver fresh products to customers",
      action: "Become a Driver",
      link: "/register"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Tractor className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 text-gray-900">
              Welcome to Farmily
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connecting farmers and customers for fresh, local, and sustainable food delivery. 
              Shop directly from farms or sell your harvest to the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/products')}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shop Now
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/register')}>
                Join Farmily
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4">Why Choose Farmily?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing the way you access fresh, local produce while supporting 
              farmers in your community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4">Join Our Community</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're looking to buy fresh produce, sell your harvest, or deliver to your neighbors,
              Farmily has a place for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="flex justify-center mb-6">
                    {type.icon}
                  </div>
                  <h3 className="text-2xl mb-4">{type.title}</h3>
                  <p className="text-gray-600 mb-6">{type.description}</p>
                  <Link to={type.link}>
                    <Button className="w-full">
                      {type.action}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to get fresh farm products delivered to your door
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-600">1</span>
              </div>
              <h3 className="text-lg mb-2">Browse Products</h3>
              <p className="text-gray-600">Explore fresh produce from local farms</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-blue-600">2</span>
              </div>
              <h3 className="text-lg mb-2">Place Order</h3>
              <p className="text-gray-600">Add items to cart and checkout</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-orange-600">3</span>
              </div>
              <h3 className="text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Track your order in real-time</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-purple-600">4</span>
              </div>
              <h3 className="text-lg mb-2">Enjoy Fresh Food</h3>
              <p className="text-gray-600">Receive fresh products at your door</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of customers and farmers already using Farmily to connect with fresh, local food.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/products')}>
              Start Shopping
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/register')} className="text-green-600 border-white hover:bg-white">
              Join as Farmer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}