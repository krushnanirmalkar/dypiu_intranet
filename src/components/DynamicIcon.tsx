import React from 'react';
import { 
  GraduationCap, Share2, BookOpen, Building2, Briefcase, FileCheck, 
  ClipboardCheck, Award, Compass, Users, Microscope, Library, Mail, 
  FileText, ShieldCheck, Trophy, Medal, Scroll, CheckCircle, ExternalLink,
  Search, Bell, Settings, User, LogOut, ChevronRight, Filter, Plus, Calendar,
  Clock, MapPin, Check, Sparkles, LayoutDashboard, Grid, Book, Star, HelpCircle,
  FileCheck2, Shield, Eye, ArrowUpRight, X, AlertCircle, Bookmark, Radio, Layers
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Share2,
  BookOpen,
  Building2,
  Briefcase,
  FileCheck,
  ClipboardCheck,
  Award,
  Compass,
  Users,
  Microscope,
  Library,
  Mail,
  FileText,
  ShieldCheck,
  Trophy,
  Medal,
  Scroll,
  CheckCircle,
  ExternalLink,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronRight,
  Filter,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Check,
  Sparkles,
  LayoutDashboard,
  Grid,
  Book,
  Star,
  HelpCircle,
  FileCheck2,
  Shield,
  Eye,
  ArrowUpRight,
  X,
  AlertCircle,
  Bookmark,
  Radio,
  Layers
};

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "w-5 h-5" }) => {
  const IconComponent = iconMap[name] || LayoutDashboard;
  return <IconComponent className={className} />;
};
