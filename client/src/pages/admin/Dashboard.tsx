import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Users, 
  Building, 
  TrendingUp, 
  MessageSquare,
  Mail,
  Phone,
  Briefcase,
  Target,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { api } from '@/utils/apiClient';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEffect } from 'react';

// Types
interface AnalyticsData {
  growth: Array<{
    _id: string;
    count: number;
    verified: number;
  }>;
  industry: Array<{
    _id: string;
    count: number;
    verifiedCount: number;
  }>;
  companySize: Array<{
    _id: string;
    count: number;
    verifiedCount: number;
  }>;
  painPoints: {
    total: number;
    commonWords: Array<{
      word: string;
      count: number;
    }>;
  };
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];

function UsersTable() {
  const { data, isLoading, error } = useQuery<{ data: any[] }>(
    {
      queryKey: ['waitlist-users'],
      queryFn: () => api.waitlist.getAll(),
    }
  );

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-xs md:text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Company</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Company Size</th>
            <th className="border px-2 py-1">Industry</th>
            <th className="border px-2 py-1">Pain Points</th>
            <th className="border px-2 py-1">Verified</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map(user => (
            <tr key={user._id}>
              <td className="border px-2 py-1">{user.firstName} {user.lastName}</td>
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1">{user.phone}</td>
              <td className="border px-2 py-1">{user.company}</td>
              <td className="border px-2 py-1">{user.role}</td>
              <td className="border px-2 py-1">{user.companySize}</td>
              <td className="border px-2 py-1">{user.industry}</td>
              <td className="border px-2 py-1">{user.painPoints}</td>
              <td className="border px-2 py-1">{user.isVerified ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch analytics data
  const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      try {
        const { data } = await api.analytics.getAnalytics({ days: parseInt(dateRange) });
        return data;
      } catch (error) {
        if (error instanceof Error && 'status' in error && (error as any).status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
        throw error;
      }
    },
    retry: 1,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Handle data export
  const handleExport = async () => {
    try {
      const filename = `waitlist-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      await api.analytics.exportData(filename);
      
      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      if (error instanceof Error && 'status' in error && (error as any).status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
      
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : 'Failed to export data. Please try again.',
        variant: "destructive"
      });
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-red-500 mb-4">Error loading analytics</p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );

  const totalRegistrations = analytics?.growth.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const totalVerified = analytics?.growth.reduce((acc, curr) => acc + curr.verified, 0) || 0;
  const verificationRate = totalRegistrations > 0 ? (totalVerified / totalRegistrations * 100).toFixed(1) : 0;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor and analyze waitlist performance</p>
        </div>
        <div className="flex gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRegistrations}</div>
                <p className="text-xs text-muted-foreground">
                  Total waitlist registrations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVerified}</div>
                <p className="text-xs text-muted-foreground">
                  {verificationRate}% verification rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Industries</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.industry.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Different industries represented
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Common Pain Points</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.painPoints.commonWords.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Identified key challenges
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Registration Trends</CardTitle>
                <CardDescription>Daily registration and verification trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics?.growth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" name="Registrations" />
                      <Line type="monotone" dataKey="verified" stroke="#82ca9d" name="Verified" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
                <CardDescription>Breakdown by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.industry}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {analytics?.industry.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
                <CardDescription>Detailed growth analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Average Daily Registrations</span>
                    </div>
                    <span className="font-bold">
                      {(totalRegistrations / analytics?.growth.length || 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>Growth Rate (7d)</span>
                    </div>
                    <span className="font-bold">
                      {((analytics?.growth.slice(-7).reduce((acc, curr) => acc + curr.count, 0) || 0) / 7).toFixed(1)}/day
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Verification Rate</span>
                    </div>
                    <span className="font-bold">{verificationRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Timeline</CardTitle>
                <CardDescription>Registration trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.growth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Registrations" />
                      <Bar dataKey="verified" fill="#82ca9d" name="Verified" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Size Distribution</CardTitle>
                <CardDescription>Breakdown by company size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.companySize}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {analytics?.companySize.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Analysis</CardTitle>
                <CardDescription>Detailed industry breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.industry}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Total" />
                      <Bar dataKey="verifiedCount" fill="#82ca9d" name="Verified" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pain Points Analysis</CardTitle>
                <CardDescription>Most common challenges mentioned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.painPoints.commonWords.map((item, index) => (
                    <div key={item.word} className="flex items-center justify-between">
                      <span className="font-medium">{item.word}</span>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={{
                              width: `${(item.count / analytics.painPoints.commonWords[0].count) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Insights</CardTitle>
                <CardDescription>Verification patterns and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span>Verified Users</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50">
                      {totalVerified}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Pending Verification</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50">
                      {totalRegistrations - totalVerified}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Average Verification Time</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50">
                      ~24h
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verification">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Current verification metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium">Verified Users</p>
                        <p className="text-sm text-gray-500">Successfully verified accounts</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{totalVerified}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-3 text-yellow-500" />
                      <div>
                        <p className="font-medium">Pending Verification</p>
                        <p className="text-sm text-gray-500">Awaiting email verification</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{totalRegistrations - totalVerified}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-3 text-blue-500" />
                      <div>
                        <p className="font-medium">Verification Rate</p>
                        <p className="text-sm text-gray-500">Percentage of verified accounts</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{verificationRate}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Trends</CardTitle>
                <CardDescription>Daily verification patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics?.growth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="verified" 
                        stroke="#82ca9d" 
                        name="Verified Users"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UsersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
} 