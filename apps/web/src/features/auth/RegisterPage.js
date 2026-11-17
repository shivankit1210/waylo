import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Eye, EyeOff, Loader2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { registerSchema } from '@waylo/shared';
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
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            displayName: '',
            email: '',
            password: '',
        },
    });
    const onSubmit = async (values) => {
        setIsLoading(true);
        try {
            const data = await registerApi(values);
            setAuth(data.user, data.accessToken);
            toast.success(`Welcome to Waylo, ${data.user.displayName}!`);
            navigate('/dashboard', { replace: true });
        }
        catch (err) {
            const message = err?.response?.data?.error?.message ||
                err?.response?.data?.message ||
                'Registration failed. Please try again.';
            toast.error(message);
        }
        finally {
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
            preferredCurrency: 'INR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setAuth(demoUser, 'demo-jwt-token-waylo');
        toast.success('Signed up as Demo Adventurer!');
        navigate('/dashboard', { replace: true });
    };
    return (_jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-background", children: [_jsxs("div", { className: "relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white", children: [_jsx("div", { className: "absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" }), _jsx("div", { className: "absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 text-white shadow-lg shadow-blue-500/30", children: _jsx(Compass, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black tracking-tight text-white", children: "Waylo" }), _jsx("p", { className: "text-xs uppercase tracking-widest text-blue-200/80 font-medium", children: "Trip Management Redefined" })] })] }), _jsxs("div", { className: "relative z-10 max-w-md space-y-6", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5 text-amber-300" }), "Join 25,000+ Smart Explorers"] }), _jsx("h2", { className: "text-4xl font-extrabold tracking-tight leading-tight", children: "Start planning trips you\u2019ll actually remember." }), _jsx("div", { className: "space-y-3 pt-2", children: [
                                    'One-click AI itinerary and route suggestions',
                                    'Auto-calculated vehicle fuel stops and service alerts',
                                    'Collaborative group packing lists with gear checkoffs',
                                    'Fair expense splitting with UPI & multi-currency support',
                                ].map((feature, i) => (_jsxs("div", { className: "flex items-center gap-3 text-sm text-slate-200", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-400 shrink-0" }), _jsx("span", { children: feature })] }, i))) })] }), _jsx("div", { className: "relative z-10 text-xs text-slate-400 border-t border-white/10 pt-6", children: "Free to use. No credit card required." })] }), _jsx("div", { className: "flex items-center justify-center p-6 sm:p-10 lg:p-12", children: _jsxs("div", { className: "w-full max-w-md space-y-8", children: [_jsxs("div", { className: "text-center sm:text-left space-y-2", children: [_jsxs("div", { className: "lg:hidden flex items-center justify-center gap-2 mb-4", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white", children: _jsx(Compass, { className: "h-5 w-5" }) }), _jsx("span", { className: "text-2xl font-bold", children: "Waylo" })] }), _jsx("h2", { className: "text-3xl font-extrabold tracking-tight text-foreground", children: "Create your account" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Start building your next memorable adventure with AI." })] }), _jsx(Card, { className: "border-border/80 shadow-xl bg-card/60 backdrop-blur-md", children: _jsxs(CardContent, { className: "pt-6", children: [_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "displayName", children: "Your Full Name" }), _jsx(Input, { id: "displayName", placeholder: "Alex Rivera", autoComplete: "name", ...register('displayName'), className: errors.displayName ? 'border-destructive focus-visible:ring-destructive' : '' }), errors.displayName && (_jsx("p", { className: "text-xs text-destructive font-medium", children: errors.displayName.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email address" }), _jsx(Input, { id: "email", type: "email", placeholder: "name@example.com", autoComplete: "email", ...register('email'), className: errors.email ? 'border-destructive focus-visible:ring-destructive' : '' }), errors.email && (_jsx("p", { className: "text-xs text-destructive font-medium", children: errors.email.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password (min 8 characters)" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", type: showPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "new-password", ...register('password'), className: errors.password ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10' }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: showPassword ? _jsx(EyeOff, { className: "h-4 w-4" }) : _jsx(Eye, { className: "h-4 w-4" }) })] }), errors.password && (_jsx("p", { className: "text-xs text-destructive font-medium", children: errors.password.message }))] }), _jsx(Button, { type: "submit", className: "w-full h-11 text-base font-semibold gap-2 mt-2", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Creating account..."] })) : (_jsxs(_Fragment, { children: ["Create account", _jsx(ArrowRight, { className: "h-4 w-4" })] })) })] }), _jsxs("div", { className: "relative my-6", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-border" }) }), _jsx("div", { className: "relative flex justify-center text-xs uppercase", children: _jsx("span", { className: "bg-card px-2 text-muted-foreground font-semibold", children: "Or" }) })] }), _jsxs(Button, { type: "button", variant: "outline", onClick: handleDemoRegister, className: "w-full h-11 font-medium gap-2 border-primary/30 hover:border-primary/60 text-primary hover:bg-primary/5", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Try Instant Demo Explorer"] })] }) }), _jsxs("p", { className: "text-center text-sm text-muted-foreground", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "font-semibold text-primary hover:underline", children: "Sign in" })] })] }) })] }));
}
//# sourceMappingURL=RegisterPage.js.map