import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

export function PromoNotifier() {
  const { state } = useApp();
  const { currentUser } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const seen = sessionStorage.getItem('promoShownSession');
    if (seen) return;

    const isFarmer = currentUser?.role === 'farmer';

    const farmerOffers = [
      {
        title: 'Bulk Seed Discount',
        description: 'Save 15% on maize and veg seeds this month',
        action: 'View Seeds',
        onClick: () => navigate('/products'),
      },
      {
        title: 'Fertilizer Bundle',
        description: 'R200 off per ton with compost bundle',
        action: 'See Bundles',
        onClick: () => navigate('/products'),
      },
      {
        title: 'Market Demand: Leafy Greens',
        description: 'High demand in Gauteng this week',
        action: 'List Produce',
        onClick: () => navigate('/farmer/dashboard'),
      },
    ];

    const customerOffers = [
      {
        title: 'R50 Off First Order',
        description: 'On orders over R200 (limited time)',
        action: 'Shop Now',
        onClick: () => navigate('/products'),
      },
      {
        title: 'Free Delivery Weekend',
        description: 'Free delivery on all orders this weekend',
        action: 'Browse Deals',
        onClick: () => navigate('/products'),
      },
      {
        title: 'Organic Produce Sale',
        description: '20% off organic vegetables & fruits',
        action: 'View Organics',
        onClick: () => navigate('/products'),
      },
    ];

    const list = isFarmer ? farmerOffers : customerOffers;
    const offer = list[Math.floor(Math.random() * list.length)];

    toast(offer.title, {
      description: offer.description,
      action: {
        label: offer.action,
        onClick: offer.onClick,
      },
      duration: 6000,
      closeButton: true,
    });

    sessionStorage.setItem('promoShownSession', '1');
  }, [currentUser, navigate]);

  return null;
}
