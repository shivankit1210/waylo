import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { loginSchema } from '@waylo/shared';
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
    const from = location.state?.from?.pathname || '/dashboard';
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const onSubmit = async (values) => {
        setIsLoading(true);
        try {
            const data = await login(values);
            setAuth(data.user, data.accessToken);
            toast.success(`Welcome back, ${data.user.displayName}!`);
            navigate(from, { replace: true });
        }
        catch (err) {
            // Provide clean error message
            const message = err?.response?.data?.error?.message ||
                err?.response?.data?.message ||
                'Unable to log in. Please check your credentials.';
            toast.error(message);
        }
        finally {
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
            preferredCurrency: 'INR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setAuth(demoUser, 'demo-jwt-token-waylo');
        toast.success('Logged in with Demo Explorer account!');
        navigate('/dashboard', { replace: true });
    };
    return (_jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-background", children: [_jsxs("div", { className: "relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white", children: [_jsx("div", { className: "absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" }), _jsx("div", { className: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 text-white shadow-lg shadow-blue-500/30", children: _jsx(Compass, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black tracking-tight text-white", children: "Waylo" }), _jsx("p", { className: "text-xs uppercase tracking-widest text-blue-200/80 font-medium", children: "Smart Travel Operating System" })] })] }), _jsxs("div", { className: "relative z-10 max-w-md space-y-6", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5 text-amber-300" }), "AI-Powered Multi-Day Journeys"] }), _jsx("h2", { className: "text-4xl font-extrabold tracking-tight leading-tight", children: "Turn trip chaos into effortless adventures." }), _jsx("p", { className: "text-base text-slate-300 leading-relaxed", children: "Collaborative itineraries, vehicle maintenance schedules, smart gear checklists, and instant UPI/split calculations \u2014 all in one modern app." }), _jsxs("div", { className: "flex items-center gap-4 pt-2", children: [_jsxs("div", { className: "flex -space-x-2", children: [_jsx("img", { className: "inline-block h-9 w-9 rounded-full ring-2 ring-indigo-900 object-cover", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", alt: "Traveler" }), _jsx("img", { className: "inline-block h-9 w-9 rounded-full ring-2 ring-indigo-900 object-cover", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", alt: "Traveler" }), _jsx("img", { className: "inline-block h-9 w-9 rounded-full ring-2 ring-indigo-900 object-cover", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80", alt: "Traveler" })] }), _jsx("p", { className: "text-xs text-slate-300 font-medium", children: "Loved by 25,000+ modern road-trippers and riders." })] })] }), _jsxs("div", { className: "relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-400" }), " End-to-end encrypted plans"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "h-4 w-4 text-sky-400" }), " Works offline during remote rides"] })] })] }), _jsx("div", { className: "flex items-center justify-center p-6 sm:p-10 lg:p-12", children: _jsxs("div", { className: "w-full max-w-md space-y-8", children: [_jsxs("div", { className: "text-center sm:text-left space-y-2", children: [_jsxs("div", { className: "lg:hidden flex items-center justify-center gap-2 mb-4", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white", children: _jsx(Compass, { className: "h-5 w-5" }) }), _jsx("span", { className: "text-2xl font-bold", children: "Waylo" })] }), _jsx("h2", { className: "text-3xl font-extrabold tracking-tight text-foreground", children: "Welcome back" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Enter your credentials to continue your journeys." })] }), _jsx(Card, { className: "border-border/80 shadow-xl bg-card/60 backdrop-blur-md", children: _jsxs(CardContent, { className: "pt-6", children: [_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email address" }), _jsx(Input, { id: "email", type: "email", placeholder: "name@example.com", autoComplete: "email", ...register('email'), className: errors.email ? 'border-destructive focus-visible:ring-destructive' : '' }), errors.email && (_jsx("p", { className: "text-xs text-destructive font-medium", children: errors.email.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx("a", { href: "#forgot-password", onClick: (e) => {
                                                                    e.preventDefault();
                                                                    toast.info('Password reset instructions will be sent to your email.');
                                                                }, className: "text-xs font-medium text-primary hover:underline", children: "Forgot password?" })] }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", type: showPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "current-password", ...register('password'), className: errors.password ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10' }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: showPassword ? _jsx(EyeOff, { className: "h-4 w-4" }) : _jsx(Eye, { className: "h-4 w-4" }) })] }), errors.password && (_jsx("p", { className: "text-xs text-destructive font-medium", children: errors.password.message }))] }), _jsx(Button, { type: "submit", className: "w-full h-11 text-base font-semibold gap-2 mt-2", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Signing in..."] })) : (_jsxs(_Fragment, { children: ["Sign in", _jsx(ArrowRight, { className: "h-4 w-4" })] })) })] }), _jsxs("div", { className: "relative my-6", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-border" }) }), _jsx("div", { className: "relative flex justify-center text-xs uppercase", children: _jsx("span", { className: "bg-card px-2 text-muted-foreground font-semibold", children: "Or explore faster" }) })] }), _jsxs(Button, { type: "button", variant: "outline", onClick: handleDemoLogin, className: "w-full h-11 font-medium gap-2 border-primary/30 hover:border-primary/60 text-primary hover:bg-primary/5", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Continue with Demo Explorer"] })] }) }), _jsxs("p", { className: "text-center text-sm text-muted-foreground", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "font-semibold text-primary hover:underline", children: "Create an account" })] })] }) })] }));
}
//# sourceMappingURL=LoginPage.js.map