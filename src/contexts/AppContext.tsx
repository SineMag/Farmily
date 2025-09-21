import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'farmer' | 'driver';
  phone?: string;
  address?: string;
  farmName?: string; // for farmers
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  category: 'livestock' | 'produce' | 'dairy' | 'grains';
  price: number;
  unit: string; // per kg, per piece, per liter, etc.
  description: string;
  image: string;
  stock: number;
  location: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  farmerId: string;
  driverId?: string;
  createdAt: string;
  deliveryNotes?: string;
  paymentData?: any;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  isLoading: boolean;
  showNewsletter: boolean;
}

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'REGISTER_USER'; payload: User }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'PLACE_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status']; driverId?: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NEWSLETTER_VISIBILITY'; payload: boolean };

// Mock initial data
const initialProducts: Product[] = [
  {
    id: '1',
    farmerId: 'farmer1',
    farmerName: 'Green Valley Farm',
    name: 'Fresh Organic Tomatoes',
    category: 'produce',
    price: 89.99,
    unit: 'per kg',
    description: 'Locally grown organic tomatoes, perfect for salads and cooking.',
    image: '',
    stock: 50,
    location: 'Valley Springs, CA'
  },
  {
    id: '2',
    farmerId: 'farmer1',
    farmerName: 'Green Valley Farm',
    name: 'Free-Range Chicken Eggs',
    category: 'dairy',
    price: 134.99,
    unit: 'per dozen',
    description: 'Fresh eggs from free-range chickens fed with organic grain.',
    image: '',
    stock: 30,
    location: 'Valley Springs, CA'
  },
  {
    id: '3',
    farmerId: 'farmer2',
    farmerName: 'Mountain View Ranch',
    name: 'Grass-Fed Beef',
    category: 'livestock',
    price: 389.99,
    unit: 'per kg',
    description: 'Premium grass-fed beef from cattle raised on open pastures.',
    image: '',
    stock: 20,
    location: 'Mountain View, CA'
  }
];

const initialUsers: User[] = [
  {
    id: 'farmer1',
    email: 'farmer@greenvalley.com',
    name: 'John Green',
    role: 'farmer',
    farmName: 'Green Valley Farm',
    phone: '555-0123',
    address: 'Valley Springs, CA'
  },
  {
    id: 'farmer2',
    email: 'rancher@mountainview.com',
    name: 'Sarah Mountain',
    role: 'farmer',
    farmName: 'Mountain View Ranch',
    phone: '555-0124',
    address: 'Mountain View, CA'
  },
  {
    id: 'driver1',
    email: 'driver@farmily.com',
    name: 'Mike Delivery',
    role: 'driver',
    phone: '555-0125'
  }
];

const initialState: AppState = {
  currentUser: null,
  users: initialUsers,
  products: initialProducts,
  cart: [],
  wishlist: [],
  orders: [],
  isLoading: false,
  showNewsletter: true
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'REGISTER_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
        currentUser: action.payload
      };
    
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(p => p.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(p => p.id !== action.payload)
      };
    
    case 'PLACE_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
        cart: []
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { 
                ...order, 
                status: action.payload.status,
                driverId: action.payload.driverId || order.driverId
              }
            : order
        )
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_NEWSLETTER_VISIBILITY':
      return { ...state, showNewsletter: action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}