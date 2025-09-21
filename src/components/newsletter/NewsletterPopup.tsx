import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { X, Mail, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterPopup() {
  const { state, dispatch } = useApp();
  const { showNewsletter, currentUser } = state;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!showNewsletter) return null;

  const handleClose = () => {
    dispatch({ type: 'SET_NEWSLETTER_VISIBILITY', payload: false });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setSubscribed(true);
    toast.success('Successfully subscribed to our newsletter!');
    
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const isFarmer = currentUser?.role === 'farmer';
  const offers = isFarmer
    ? [
        {
          title: 'Bulk Seed Discount',
          description: 'Save up to 15% on maize and vegetable seeds in September',
          badge: 'Farm Offer',
          color: 'bg-green-100 text-green-800'
        },
        {
          title: 'Fertilizer + Compost Bundle',
          description: 'R200 off per ton when bundled with organic compost',
          badge: 'Soil Health',
          color: 'bg-yellow-100 text-yellow-800'
        },
        {
          title: 'Market Demand Alert',
          description: 'High demand in Gauteng for leafy greens this week',
          badge: 'Market',
          color: 'bg-blue-100 text-blue-800'
        }
      ]
    : [
        {
          title: 'R50 Off First Order',
          description: 'New customers get R50 off orders over R200',
          badge: 'New Customer',
          color: 'bg-green-100 text-green-800'
        },
        {
          title: 'Free Delivery Weekend',
          description: 'Free delivery on all orders this weekend',
          badge: 'Limited Time',
          color: 'bg-blue-100 text-blue-800'
        },
        {
          title: 'Organic Produce Sale',
          description: '20% off all organic vegetables and fruits',
          badge: 'Seasonal',
          color: 'bg-orange-100 text-orange-800'
        }
      ];

  if (subscribed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-4">
              You've successfully subscribed to our newsletter. Get ready for exclusive offers and updates!
            </p>
            <Button onClick={handleClose} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl mb-2">
              {isFarmer ? 'Farmer Offers & Market Alerts' : 'Exclusive Agricultural Offers!'}
            </CardTitle>
            <p className="text-gray-600">
              {isFarmer
                ? 'Grow margins with bulk input deals, logistics savings, and live demand signals'
                : 'Stay updated with the latest deals, seasonal produce, and farming insights'}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Offers */}
          <div>
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg">Current Offers</h3>
            </div>
            <div className="space-y-3">
              {offers.map((offer, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{offer.title}</h4>
                    <Badge className={offer.color}>
                      {offer.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{offer.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Mail className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg">{isFarmer ? 'Get Farmer Updates' : 'Subscribe to Our Newsletter'}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {isFarmer
                ? 'Weekly procurement deals, agri-input bundles, and market demand updates for your region.'
                : 'Get weekly updates on new products, seasonal offers, and agricultural tips delivered to your inbox.'}
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  Subscribe Now
                </Button>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Maybe Later
                </Button>
              </div>
            </form>
          </div>

          {/* What You'll Get */}
          <div className="border-t pt-4">
            <h4 className="mb-3">What you'll receive:</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-green-600 mr-2" />
                <span>Weekly seasonal produce updates</span>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                <span>Exclusive discounts and early access to sales</span>
              </div>
              <div className="flex items-center text-sm">
                <Sparkles className="h-4 w-4 text-green-600 mr-2" />
                <span>Farming tips and sustainable agriculture news</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}