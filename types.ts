export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  imageUrl: string;
  description: string;
  features: string[];
  reviews?: Review[];
}

export interface NavLink {
  name: string;
  href: string;
  isFilter?: boolean;
  filterValue?: string;
  filterType?: 'category' | 'brand';
  megaMenu?: MegaMenuItem[];
}

export interface MegaMenuItem {
    title: string;
    filterType: 'category' | 'brand';
    links: {
        name: string;
        href: string;
        filterValue: string;
    }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface User {
  name:string;
  email: string;
  avatar?: string;
  currency?: 'UYU' | 'USD';
  orders?: Order[];
}

export interface AdvisorAnswers {
  smokingHabit: string;
  vapingGoal: string;
  preference: string;
}

export interface Recommendation {
  productName: string;
  productType: string;
  reasoning: string;
  imageUrl: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}