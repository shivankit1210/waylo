import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Eye, EyeOff, Loader2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@waylo/shared';
import { useAuthStore } from '@/stores/authStore';
import { register as registerApi } from './api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setIsLoading(true);
    try {
      const data = await registerApi(values);
      setAuth(data.user, data.accessToken);
      toast.success(`Welcome to Waylo, ${data.user.displayName}!`);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoRegister = () => {
    const demoUser = {
      id: 'demo-user-new',
      email: 'traveler@waylo.app',
      displayName: 'Sam Adventurer',
      avatarUrl: null,
      timezone: 'Asia/Kolkata',
      preferredCurrency: 'INR' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAuth(demoUser, 'demo-jwt-token-waylo');
    toast.success('Signed up as Demo Adventurer!');
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Column: Visual Brand Hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 text-white shadow-lg shadow-blue-500/30">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Waylo</h1>
            <p className="text-xs uppercase tracking-widest text-blue-200/80 font-medium">Trip Management Redefined</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Join 25,000+ Smart Explorers
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Start planning trips you’ll actually remember.
          </h2>

          <div className="space-y-3 pt-2">
            {[
              'One-click AI itinerary and route suggestions',
              'Auto-calculated vehicle fuel stops and service alerts',
              'Collaborative group packing lists with gear checkoffs',
              'Fair expense splitting with UPI & multi-currency support',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 border-t border-white/10 pt-6">
          Free to use. No credit card required.
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center sm:text-left space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">Waylo</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="text-sm text-muted-foreground">
              Start building your next memorable adventure with AI.
            </p>
          </div>

          <Card className="border-border/80 shadow-xl bg-card/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Your Full Name</Label>
                  <Input
                    id="displayName"
                    placeholder="Alex Rivera"
                    autoComplete="name"
                    {...register('displayName')}
                    className={errors.displayName ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.displayName && (
                    <p className="text-xs text-destructive font-medium">{errors.displayName.message}</p>
                  )}
                </div>

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
                  <Label htmlFor="password">Password (min 8 characters)</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="new-password"
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
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
                  <span className="bg-card px-2 text-muted-foreground font-semibold">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleDemoRegister}
                className="w-full h-11 font-medium gap-2 border-primary/30 hover:border-primary/60 text-primary hover:bg-primary/5"
              >
                <Sparkles className="h-4 w-4" />
                Try Instant Demo Explorer
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
