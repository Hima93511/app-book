// Mock API for local database simulation
import { User } from '@/contexts/AuthContext';

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  patientId?: string;
  patientName?: string;
}

export interface Booking {
  id: string;
  slotId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

interface RegisterResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

class MockAPI {
  private users: User[] = [];
  private slots: TimeSlot[] = [];
  private bookings: Booking[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Load data from localStorage or initialize
    const userData = localStorage.getItem('mockUsers');
    const slotData = localStorage.getItem('mockSlots');
    const bookingData = localStorage.getItem('mockBookings');

    if (userData) {
      this.users = JSON.parse(userData);
    } else {
      // Initialize with default admin user
      this.users = [
        {
          id: 'admin-1',
          email: 'admin@clinic.com',
          name: 'Dr. Admin',
          role: 'admin'
        }
      ];
      this.saveUsers();
    }

    if (slotData) {
      this.slots = JSON.parse(slotData);
    } else {
      this.generateAvailableSlots();
    }

    if (bookingData) {
      this.bookings = JSON.parse(bookingData);
    }
  }

  private generateAvailableSlots() {
    // Generate slots for next 7 days, 9 AM to 5 PM, every hour
    const slots: TimeSlot[] = [];
    const today = new Date();
    
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      
      // Skip weekends for demo
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const dateStr = date.toISOString().split('T')[0];
      
      for (let hour = 9; hour <= 17; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        slots.push({
          id: `slot-${dateStr}-${hour}`,
          date: dateStr,
          time: timeStr,
          available: true
        });
      }
    }
    
    this.slots = slots;
    this.saveSlots();
  }

  private saveUsers() {
    localStorage.setItem('mockUsers', JSON.stringify(this.users));
  }

  private saveSlots() {
    localStorage.setItem('mockSlots', JSON.stringify(this.slots));
  }

  private saveBookings() {
    localStorage.setItem('mockBookings', JSON.stringify(this.bookings));
  }

  private generateToken(user: User): string {
    return btoa(JSON.stringify({ ...user, exp: Date.now() + 24 * 60 * 60 * 1000 }));
  }

  verifyToken(token: string): User | null {
    try {
      const data = JSON.parse(atob(token));
      if (data.exp < Date.now()) {
        return null;
      }
      return { id: data.id, email: data.email, name: data.name, role: data.role };
    } catch {
      return null;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.users.find(u => u.email === email);
    
    // For demo purposes, accept any password except empty
    if (!user || !password) {
      return { success: false, error: 'Invalid email or password' };
    }

    const token = this.generateToken(user);
    return { success: true, token, user };
  }

  async register(name: string, email: string, password: string, role: 'patient' | 'admin'): Promise<RegisterResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (this.users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role
    };

    this.users.push(newUser);
    this.saveUsers();

    const token = this.generateToken(newUser);
    return { success: true, token, user: newUser };
  }

  async getSlots(): Promise<TimeSlot[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.slots.filter(slot => slot.available);
  }

  async bookSlot(slotId: string, patientId: string): Promise<{ success: boolean; error?: string; booking?: Booking }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const slot = this.slots.find(s => s.id === slotId);
    const patient = this.users.find(u => u.id === patientId);

    if (!slot || !patient) {
      return { success: false, error: 'Slot or patient not found' };
    }

    if (!slot.available) {
      return { success: false, error: 'Slot is no longer available' };
    }

    // Update slot
    slot.available = false;
    slot.patientId = patientId;
    slot.patientName = patient.name;

    // Create booking
    const booking: Booking = {
      id: `booking-${Date.now()}`,
      slotId: slot.id,
      patientId: patient.id,
      patientName: patient.name,
      patientEmail: patient.email,
      date: slot.date,
      time: slot.time,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    this.bookings.push(booking);
    this.saveSlots();
    this.saveBookings();

    return { success: true, booking };
  }

  async getMyBookings(patientId: string): Promise<Booking[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.bookings.filter(b => b.patientId === patientId && b.status === 'confirmed');
  }

  async getAllBookings(): Promise<Booking[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.bookings.filter(b => b.status === 'confirmed');
  }

  async cancelBooking(bookingId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    const user = this.users.find(u => u.id === userId);
    if (!user || (user.role === 'patient' && booking.patientId !== userId)) {
      return { success: false, error: 'Unauthorized to cancel this booking' };
    }

    // Update booking status
    booking.status = 'cancelled';

    // Make slot available again
    const slot = this.slots.find(s => s.id === booking.slotId);
    if (slot) {
      slot.available = true;
      slot.patientId = undefined;
      slot.patientName = undefined;
    }

    this.saveSlots();
    this.saveBookings();

    return { success: true };
  }
}

export const mockAPI = new MockAPI();