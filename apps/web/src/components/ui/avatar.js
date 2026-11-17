import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
const Avatar = React.forwardRef(({ className, ...props }, ref) => (_jsx(AvatarPrimitive.Root, { ref: ref, className: cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-background shadow-sm', className), ...props })));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (_jsx(AvatarPrimitive.Image, { ref: ref, className: cn('aspect-square h-full w-full object-cover', className), ...props })));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (_jsx(AvatarPrimitive.Fallback, { ref: ref, className: cn('flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-xs font-semibold text-white uppercase', className), ...props })));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
export { Avatar, AvatarImage, AvatarFallback };
//# sourceMappingURL=avatar.js.map