import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Building2,
  TrendingUp,
  Activity,
  MapPin,
  Calendar,
  Edit2,
  UserX,
  Trash2,
  DollarSign
} from 'lucide-react';
import { Link } from 'wouter';

interface UserData {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'trader' | 'viewer';
  status: 'active' | 'suspended' | 'inactive';
  lastLogin: string;
  createdAt: string;
  country: string;
  totalTrades: number;
  totalVolume: string;
  subscription: 'Free' | 'Professional' | 'Enterprise';
  orgsCount?: number;
}

interface UserCardsViewProps {
  users: UserData[];
  onOrgClick: (user: UserData) => void;
  getRoleBadge: (role: UserData['role']) => React.ReactNode;
  getStatusBadge: (status: UserData['status']) => React.ReactNode;
  getSubscriptionBadge: (subscription: UserData['subscription']) => React.ReactNode;
}

export function UserCardsView({
  users,
  onOrgClick,
  getRoleBadge,
  getStatusBadge,
  getSubscriptionBadge,
}: UserCardsViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{user.name}</CardTitle>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Role, Status, Subscription */}
            <div className="flex flex-wrap gap-1.5">
              {getRoleBadge(user.role)}
              {getStatusBadge(user.status)}
              {getSubscriptionBadge(user.subscription)}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <Activity className="h-3 w-3 mr-1" />
                  Trades
                </div>
                <p className="text-sm font-semibold">{user.totalTrades.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Volume
                </div>
                <p className="text-sm font-semibold text-green-600">{user.totalVolume}</p>
              </div>
            </div>

            {/* Organization and Country */}
            <div className="space-y-2 pt-2 border-t">
              {user.orgsCount !== undefined && user.orgsCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-between h-8"
                  onClick={() => onOrgClick(user)}
                >
                  <span className="flex items-center">
                    <Building2 className="h-3 w-3 mr-1.5" />
                    Organizations
                  </span>
                  <Badge variant="secondary" className="ml-2">
                    {user.orgsCount}
                  </Badge>
                </Button>
              )}
              
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  {user.country}
                </span>
                <span className="flex items-center text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(user.lastLogin).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 pt-2">
              <Link href={`/admin/user/${user.id}`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full h-8">
                  <Edit2 className="h-3 w-3" />
                </Button>
              </Link>
              <Button size="sm" variant="outline" className="flex-1 h-8">
                <UserX className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}