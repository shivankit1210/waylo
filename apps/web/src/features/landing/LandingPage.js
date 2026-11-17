import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles, CalendarDays, Luggage, CarFront, Receipt, Users, ArrowRight, ShieldCheck, Zap, Star, Globe2, } from 'lucide-react';
import { Button } from '@/components/ui/button';
const FEATURES = [
    {
        icon: Sparkles,
        color: 'text-blue-500 bg-blue-500/10',
        title: 'AI Trip Planning',
        desc: 'Generate complete multi-day itineraries, scenic mountain pass routes, and ideal rest stops in seconds with smart AI.',
    },
    {
        icon: CalendarDays,
        color: 'text-indigo-500 bg-indigo-500/10',
        title: 'Smart Itinerary',
        desc: 'Adaptive schedules that recalculate when traffic, weather, or spontaneous roadside viewpoints slow you down.',
    },
    {
        icon: Luggage,
        color: 'text-amber-500 bg-amber-500/10',
        title: 'Packing Manager',
        desc: 'Smart packing lists curated for motorcycle gear, cold weather layers, camera drones, and shared camping equipment.',
    },
    {
        icon: CarFront,
        color: 'text-emerald-500 bg-emerald-500/10',
        title: 'Vehicle & Route Tracking',
        desc: 'Log odometer readings, monitor fuel efficiency, get tire pressure reminders, and pinpoint fuel stations along remote stretches.',
    },
    {
        icon: Receipt,
        color: 'text-purple-500 bg-purple-500/10',
        title: 'Fair Expense Splits',
        desc: 'Never fight over bills again. Split fuel, tolls, and food with multi-currency conversion and instant UPI QR settlements.',
    },
    {
        icon: Users,
        color: 'text-sky-500 bg-sky-500/10',
        title: 'Group Coordination',
        desc: 'Assign roles like Ride Captain or Treasurer, share live location pins, and collaborate seamlessly on one synchronized board.',
    },
];
const STEPS = [
    {
        step: '01',
        title: 'Prompt or outline your vision',
        desc: 'Type where you want to go, your travel style (motorcycle tour, solo trek, family trip), and your budget.',
    },
    {
        step: '02',
        title: 'AI builds your master blueprint',
        desc: 'Get curated routes, stopovers, packing requirements, and fuel plans ready to customize in real time.',
    },
    {
        step: '03',
        title: 'Hit the road with total peace of mind',
        desc: 'Track expenses, coordinate with your crew, and enjoy every kilometer knowing your trip is completely organized.',
    },
];
const TESTIMONIALS = [
    {
        quote: 'Waylo turned our 14-day Ladakh motorcycle tour from a logistical nightmare into pure freedom on two wheels. The fuel alerts saved us twice.',
        author: 'Kabir & Vikram',
        role: 'Motorcycle Tour Leaders',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    {
        quote: 'The expense split and UPI settle feature is so slick. We did a 5-day South Goa road trip with 6 friends and zero bill stress.',
        author: 'Ananya Roy',
        role: 'Weekend Roadtripper',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    {
        quote: 'The packing manager alone is worth it. It suggested high-altitude thermal innerwear and chain lube that we would have totally forgotten.',
        author: 'Dev Mehta',
        role: 'Adventure Photographer',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
];
export function LandingPage() {
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-background text-foreground overflow-hidden", children: [_jsxs("section", { className: "relative pt-20 pb-28 md:pt-32 md:pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-sky-400/10 blur-[120px] rounded-full pointer-events-none" }), _jsx("div", { className: "absolute top-1/3 -right-40 w-96 h-96 bg-orange-500/15 blur-[100px] rounded-full pointer-events-none" }), _jsxs("div", { className: "max-w-5xl mx-auto text-center space-y-8 relative z-10", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-sm", children: [_jsx(Sparkles, { className: "h-4 w-4 text-primary" }), _jsx("span", { children: "Waylo Trip Operating System 2.0" })] }), _jsxs(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, className: "text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08]", children: ["Your whole trip,", ' ', _jsx("span", { className: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent", children: "in one place." })] }), _jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed", children: "AI itineraries, vehicle tracking, weather-smart packing checklists, and seamless group expense splits. Built for the modern explorer." }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.3 }, className: "flex flex-col sm:flex-row items-center justify-center gap-4 pt-4", children: [_jsx(Button, { asChild: true, variant: "gradient", size: "lg", className: "w-full sm:w-auto h-13 px-8 text-base font-bold shadow-xl shadow-blue-500/25 rounded-2xl gap-2.5", children: _jsxs(Link, { to: "/register", children: [_jsx("span", { children: "Start Free Adventure" }), _jsx(ArrowRight, { className: "h-5 w-5" })] }) }), _jsx(Button, { asChild: true, variant: "outline", size: "lg", className: "w-full sm:w-auto h-13 px-8 text-base font-semibold rounded-2xl border-border/80 hover:bg-muted/60", children: _jsx(Link, { to: "/login", children: _jsx("span", { children: "Explore Live Demo" }) }) })] }), _jsxs("div", { className: "pt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-500" }), _jsx("span", { children: "Offline-first reliable" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "h-4 w-4 text-amber-500" }), _jsx("span", { children: "Instant UPI splits" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Globe2, { className: "h-4 w-4 text-blue-500" }), _jsx("span", { children: "Global currency conversion" })] })] })] })] }), _jsx("section", { className: "py-20 bg-muted/30 border-y border-border/60 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-6xl mx-auto space-y-14", children: [_jsxs("div", { className: "text-center space-y-3 max-w-xl mx-auto", children: [_jsx("h2", { className: "text-3xl sm:text-4xl font-extrabold tracking-tight", children: "Engineered for real road trips" }), _jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Everything you need to plan, ride, and settle without juggling five different disconnected apps." })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: FEATURES.map((feature, i) => {
                                const Icon = feature.icon;
                                return (_jsxs("div", { className: "p-7 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 group", children: [_jsx("div", { className: `h-12 w-12 rounded-2xl flex items-center justify-center mb-5 ${feature.color} group-hover:scale-110 transition-transform`, children: _jsx(Icon, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-bold text-foreground mb-2", children: feature.title }), _jsx("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: feature.desc })] }, i));
                            }) })] }) }), _jsxs("section", { className: "py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16", children: [_jsxs("div", { className: "text-center space-y-3 max-w-xl mx-auto", children: [_jsx("h2", { className: "text-3xl sm:text-4xl font-extrabold tracking-tight", children: "How Waylo works" }), _jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "From first spark of inspiration to your final trip photo dump in three simple steps." })] }), _jsx("div", { className: "grid md:grid-cols-3 gap-8 relative", children: STEPS.map((step, i) => (_jsxs("div", { className: "relative p-8 rounded-3xl border border-border/80 bg-card shadow-sm flex flex-col justify-between space-y-6", children: [_jsx("div", { className: "text-4xl font-black text-primary/20", children: step.step }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-xl font-bold text-foreground", children: step.title }), _jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: step.desc })] })] }, i))) })] }), _jsx("section", { className: "py-20 bg-muted/20 border-t border-border/60 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-6xl mx-auto space-y-12", children: [_jsxs("div", { className: "text-center space-y-3", children: [_jsx("h2", { className: "text-3xl font-extrabold tracking-tight", children: "Loved by travelers" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "See how community explorers plan with Waylo" })] }), _jsx("div", { className: "grid md:grid-cols-3 gap-6", children: TESTIMONIALS.map((t, idx) => (_jsxs("div", { className: "p-6 rounded-3xl border border-border/80 bg-card shadow-sm flex flex-col justify-between space-y-4", children: [_jsx("div", { className: "flex gap-1 text-amber-400", children: Array.from({ length: t.rating }).map((_, i) => (_jsx(Star, { className: "h-4 w-4 fill-current" }, i))) }), _jsxs("p", { className: "text-sm text-muted-foreground italic leading-relaxed", children: ["\"", t.quote, "\""] }), _jsxs("div", { className: "flex items-center gap-3 pt-3 border-t border-border/60", children: [_jsx("img", { src: t.avatar, alt: t.author, className: "h-10 w-10 rounded-full object-cover ring-2 ring-primary/20" }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground", children: t.author }), _jsx("p", { className: "text-xs text-muted-foreground", children: t.role })] })] })] }, idx))) })] }) }), _jsx("section", { className: "py-20 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" }), _jsx("h2", { className: "text-3xl sm:text-5xl font-black tracking-tight leading-tight", children: "Ready to plan your next epic journey?" }), _jsx("p", { className: "text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed", children: "Create an account in 30 seconds and generate your custom AI itinerary right now." }), _jsx("div", { className: "pt-2", children: _jsx(Button, { asChild: true, size: "lg", className: "bg-white text-blue-900 hover:bg-slate-100 font-bold px-8 h-12 rounded-2xl shadow-xl", children: _jsx(Link, { to: "/register", children: "Get Started Free" }) }) })] }) }), _jsx("footer", { className: "border-t border-border/60 py-12 px-4 sm:px-6 lg:px-8 bg-card/60", children: _jsxs("div", { className: "max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center", children: _jsx(Compass, { className: "h-4 w-4" }) }), _jsx("span", { className: "font-bold text-lg", children: "Waylo" }), _jsx("span", { className: "text-xs text-muted-foreground ml-2", children: "\u00A9 2026 Waylo Technologies Inc." })] }), _jsxs("div", { className: "flex items-center gap-6 text-xs text-muted-foreground", children: [_jsx(Link, { to: "/trips", className: "hover:text-foreground", children: "Explore" }), _jsx(Link, { to: "/trips/new", className: "hover:text-foreground", children: "AI Planner" }), _jsx(Link, { to: "/login", className: "hover:text-foreground", children: "Log In" }), _jsx(Link, { to: "/register", className: "hover:text-foreground", children: "Sign Up" })] })] }) })] }));
}
//# sourceMappingURL=LandingPage.js.map