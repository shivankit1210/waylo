import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { loginSchema, type LoginInput } from '@waylo/shared';
import { useAuthStore } from '@/stores/authStore';
import { login } from './api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setIsLoading(true);
    try {
      const data = await login(values);
      setAuth(data.user, data.accessToken);
      toast.success(`Welcome back, ${data.user.displayName}!`);
      navigate(from, { replace: true });
    } catch (err: any) {
      // Provide clean error message
      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Unable to log in. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo user quick login for instant testing
  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-user-123',
      email: 'alex@waylo.app',
      displayName: 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      timezone: 'Asia/Kolkata',
      preferredCurrency: 'INR' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAuth(demoUser, 'demo-jwt-token-waylo');
    toast.success('Logged in with Demo Explorer account!');
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Column: Visual Brand Hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 text-white shadow-lg shadow-blue-500/30">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Waylo</h1>
            <p className="text-xs uppercase tracking-widest text-blue-200/80 font-medium">Smart Travel Operating System</p>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            AI-Powered Multi-Day Journeys
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Turn trip chaos into effortless adventures.
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Collaborative itineraries, vehicle maintenance schedules, smart gear checklists, and instant UPI/split calculations — all in one modern app.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-indigo-900 object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Traveler"
              />
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-indigo-900 object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Traveler"
              />
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-indigo-900 object-cover"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                alt="Traveler"
              />
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Loved by 25,000+ modern road-trippers and riders.
            </p>
          </div>
        </div>

        {/* Bottom Feature Pill */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> End-to-end encrypted plans
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-sky-400" /> Works offline during remote rides
          </span>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center sm:text-left space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">Waylo</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to continue your journeys.
            </p>
          </div>

          <Card className="border-border/80 shadow-xl bg-card/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    {...register('email')}
                    className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info('Password reset instructions will be sent to your email.');
                      }}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...register('password')}
                      className={errors.password ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11 text-base font-semibold gap-2 mt-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-semibold">Or explore faster</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                className="w-full h-11 font-medium gap-2 border-primary/30 hover:border-primary/60 text-primary hover:bg-primary/5"
              >
                <Sparkles className="h-4 w-4" />
                Continue with Demo Explorer
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
