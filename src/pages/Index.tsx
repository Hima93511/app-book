import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Shield, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();

  // Redirect authenticated users to their appropriate dashboard
  if (user) {
    const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-overlay"></div>
        <div className="absolute inset-0 animate-glow opacity-30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-card p-4 rounded-full w-20 h-20 mx-auto mb-8 shadow-primary animate-float border border-border/20">
            <Calendar className="h-12 w-12 text-primary mx-auto" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in text-gradient-primary">
            MediBook
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto animate-slide-up">
            Streamline your healthcare appointments with our modern booking platform. 
            Designed for patients and healthcare providers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button asChild size="lg" className="bg-gradient-card text-white hover:shadow-glow hover-lift text-lg px-8 py-4 border border-border/20">
              <Link to="/login">
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover-scale text-lg px-8 py-4">
              <Link to="/register">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose MediBook?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of healthcare scheduling with our intuitive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gradient-card shadow-soft border border-border/20 hover:shadow-glow hover-lift transition-smooth">
              <CardHeader className="text-center">
                <div className="bg-primary/20 backdrop-blur-sm p-3 rounded-lg w-fit mx-auto mb-4 border border-primary/20">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Easy Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Book appointments in seconds with our intuitive calendar interface
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft border border-border/20 hover:shadow-glow hover-lift transition-smooth">
              <CardHeader className="text-center">
                <div className="bg-success/20 backdrop-blur-sm p-3 rounded-lg w-fit mx-auto mb-4 border border-success/20">
                  <Clock className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-xl">Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get instant notifications and see live availability updates
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft border border-border/20 hover:shadow-glow hover-lift transition-smooth">
              <CardHeader className="text-center">
                <div className="bg-accent/20 backdrop-blur-sm p-3 rounded-lg w-fit mx-auto mb-4 border border-accent/20">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Secure Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Your data is protected with enterprise-grade security measures
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft border border-border/20 hover:shadow-glow hover-lift transition-smooth">
              <CardHeader className="text-center">
                <div className="bg-warning/20 backdrop-blur-sm p-3 rounded-lg w-fit mx-auto mb-4 border border-warning/20">
                  <Users className="h-8 w-8 text-warning" />
                </div>
                <CardTitle className="text-xl">Multi-role Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Designed for both patients and healthcare administrators
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-primary animate-glow">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up as a patient or admin in seconds. No complex setup required.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-secondary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-medium border border-success/20">
                <span className="text-2xl font-bold text-success">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Browse Slots</h3>
              <p className="text-muted-foreground">
                View available appointment slots for the next 7 days and choose your preferred time.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-secondary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-medium border border-accent/20">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Book & Manage</h3>
              <p className="text-muted-foreground">
                Instantly book appointments and manage all your bookings from one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-overlay opacity-90"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Simplify Your Healthcare Scheduling?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients and healthcare providers who trust MediBook
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-card text-white hover:shadow-glow hover-lift text-lg px-8 py-4 border border-border/20">
              <Link to="/register">
                Start Free Trial
                <CheckCircle className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover-scale text-lg px-8 py-4">
              <Link to="/login">
                I Have an Account
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-card border-t border-border/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="h-6 w-6 text-primary animate-glow" />
            <span className="text-xl font-bold text-foreground">MediBook</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 MediBook. Making healthcare scheduling simple and efficient.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
