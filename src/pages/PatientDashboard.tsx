import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { mockAPI, TimeSlot, Booking } from '@/lib/mockAPI';
import { useToast } from '@/hooks/use-toast';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [slotsData, bookingsData] = await Promise.all([
        mockAPI.getSlots(),
        user ? mockAPI.getMyBookings(user.id) : []
      ]);
      setSlots(slotsData);
      setBookings(bookingsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotId: string) => {
    if (!user) return;
    
    setBookingLoading(slotId);
    try {
      const result = await mockAPI.bookSlot(slotId, user.id);
      if (result.success) {
        toast({
          title: "Booking Confirmed",
          description: "Your appointment has been successfully booked!",
        });
        loadData(); // Refresh data
      } else {
        toast({
          title: "Booking Failed",
          description: result.error || "Failed to book appointment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;
    
    try {
      const result = await mockAPI.cancelBooking(bookingId, user.id);
      if (result.success) {
        toast({
          title: "Booking Cancelled",
          description: "Your appointment has been cancelled.",
        });
        loadData(); // Refresh data
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

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    return slots.reduce((groups, slot) => {
      if (!groups[slot.date]) {
        groups[slot.date] = [];
      }
      groups[slot.date].push(slot);
      return groups;
    }, {} as Record<string, TimeSlot[]>);
  };

  if (loading) {
    return (
      <Layout title="Patient Dashboard">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const groupedSlots = groupSlotsByDate(slots);

  return (
    <Layout title="Patient Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary-light p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{slots.length}</p>
                  <p className="text-sm text-muted-foreground">Available Slots</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-success/20 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
                  <p className="text-sm text-muted-foreground">My Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-accent/20 p-2 rounded-lg">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">7</p>
                  <p className="text-sm text-muted-foreground">Days Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Slots</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            {Object.keys(groupedSlots).length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Available Slots</h3>
                  <p className="text-muted-foreground">Check back later for new appointments.</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedSlots).map(([date, daySlots]) => (
                <Card key={date} className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">{formatDate(date)}</CardTitle>
                    <CardDescription>{daySlots.length} slots available</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {daySlots.map(slot => (
                        <Button
                          key={slot.id}
                          variant="outline"
                          className="h-auto p-3 flex flex-col gap-1"
                          onClick={() => handleBookSlot(slot.id)}
                          disabled={bookingLoading === slot.id}
                        >
                          {bookingLoading === slot.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          ) : (
                            <>
                              <Clock className="h-4 w-4" />
                              <span className="text-sm font-medium">{slot.time}</span>
                            </>
                          )}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {bookings.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Bookings Yet</h3>
                  <p className="text-muted-foreground">Book your first appointment from the available slots.</p>
                </CardContent>
              </Card>
            ) : (
              bookings.map(booking => (
                <Card key={booking.id} className="shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-success/20 p-2 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{formatDate(booking.date)}</h3>
                          <p className="text-sm text-muted-foreground">Time: {booking.time}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{booking.status}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Booked on {new Date(booking.createdAt).toLocaleDateString()}
                            </span>
                          </div>
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
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};