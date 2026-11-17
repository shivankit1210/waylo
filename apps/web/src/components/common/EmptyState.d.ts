import React from 'react';
import { LucideIcon } from 'lucide-react';
interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
    children?: React.ReactNode;
}
export declare function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className, children, }: EmptyStateProps): React.JSX.Element;
export {};
//# sourceMappingURL=EmptyState.d.ts.map