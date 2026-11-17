interface CreateDayDialogProps {
    tripId: string;
    nextDayNumber: number;
    tripStartDate?: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (dayNumber: number) => void;
}
export declare function CreateDayDialog({ tripId, nextDayNumber, tripStartDate, open, onOpenChange, onSuccess, }: CreateDayDialogProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=CreateDayDialog.d.ts.map