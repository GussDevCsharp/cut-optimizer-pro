
// This is a re-export file to maintain backward compatibility
// Use this for component imports only
// Do not import actual implementation here to avoid circular dependencies
import { type ToastActionElement, type ToastProps } from "@/components/ui/toast";

export type { ToastActionElement, ToastProps };
export { toast, useToast } from "@/hooks/use-toast";
