import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, TrendingUp, X } from 'lucide-react';
import { mockAPI, Booking } from '@/lib/mockAPI';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await mockAPI.getAllBookings();
      setBookings(bookingsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const result = await mockAPI.cancelBooking(bookingId, 'admin-1');
      if (result.success) {
        toast({
          title: "Booking Cancelled",
          description: "The appointment has been cancelled.",
        });
        loadBookings(); // Refresh data
      } else {
        toast({
          title: "Cancellation Failed",
          description: result.error || "Failed to cancel appointment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTodayBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === today);
  };

  const getUpcomingBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(booking => booking.date > today);
  };

  const getUniquePatients = () => {
    const uniquePatients = new Set(bookings.map(booking => booking.patientId));
    return uniquePatients.size;
  };

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const todayBookings = getTodayBookings();
  const upcomingBookings = getUpcomingBookings();

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary-light p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-success/20 p-2 rounded-lg">
                  <Clock className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{todayBookings.length}</p>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-accent/20 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{upcomingBookings.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-warning/20 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{getUniquePatients()}</p>
                  <p className="text-sm text-muted-foreground">Unique Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        {todayBookings.length > 0 && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Today's Appointments ({todayBookings.length})
              </CardTitle>
              <CardDescription>Appointments scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayBookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground">{booking.patientName}</h4>
                      <p className="text-sm text-muted-foreground">{booking.patientEmail}</p>
                      <p className="text-sm font-medium text-foreground">Time: {booking.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{booking.status}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Bookings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              All Bookings ({bookings.length})
            </CardTitle>
            <CardDescription>Complete list of all appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Bookings Yet</h3>
                <p className="text-muted-foreground">Appointments will appear here once patients start booking.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary-light p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{booking.patientName}</h4>
                          <p className="text-sm text-muted-foreground">{booking.patientEmail}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm font-medium text-foreground">
                              {formatDate(booking.date)} at {booking.time}
                            </span>
                            <Badge variant="secondary">{booking.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};