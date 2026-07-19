import { View, StyleSheet } from 'react-native';
import {
  Utensils, Car, ShoppingBag, FileText, Heart, Film, Briefcase,
  MoreHorizontal, Home, Zap, Gift, Book, Coffee, Dumbbell, Music,
  Tv, Smartphone, Plane, Camera, Watch, Sun, Moon, Cloud, Droplet,
  Leaf, PiggyBank, CreditCard, DollarSign, TrendingUp, TrendingDown,
  Wallet, Banknote, Receipt, Percent, Shield, Users, Package, Truck,
  Bike, Bus, HeartPulse,
} from 'lucide-react-native';

const iconMap: Record<string, any> = {
  utensils: Utensils,
  car: Car,
  'shopping-bag': ShoppingBag,
  'file-text': FileText,
  heart: Heart,
  film: Film,
  briefcase: Briefcase,
  'more-horizontal': MoreHorizontal,
  home: Home,
  zap: Zap,
  gift: Gift,
  book: Book,
  coffee: Coffee,
  dumbbell: Dumbbell,
  music: Music,
  tv: Tv,
  smartphone: Smartphone,
  plane: Plane,
  camera: Camera,
  watch: Watch,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  droplet: Droplet,
  leaf: Leaf,
  'piggy-bank': PiggyBank,
  'credit-card': CreditCard,
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  wallet: Wallet,
  banknote: Banknote,
  receipt: Receipt,
  percent: Percent,
  shield: Shield,
  users: Users,
  package: Package,
  truck: Truck,
  bike: Bike,
  bus: Bus,
  'heart-pulse': HeartPulse,
};

interface CategoryIconProps {
  icon?: string;
  color: string;
  size?: number;
}

export function CategoryIcon({ icon, color, size = 18 }: CategoryIconProps) {
  const IconComponent = icon ? iconMap[icon] : undefined;

  return (
    <View style={[styles.circle, { backgroundColor: color + '20', width: size + 18, height: size + 18, borderRadius: (size + 18) / 2 }]}>
      {IconComponent ? (
        <IconComponent color={color} size={size} />
      ) : (
        <View style={[styles.dot, { backgroundColor: color, width: size * 0.5, height: size * 0.5, borderRadius: size * 0.25 }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
  },
});
