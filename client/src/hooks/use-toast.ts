
// Re-export from the UI components
export { useToast } from "@/components/ui/use-toast"
export type { ToastProps } from "@/components/ui/toast"

// Export the toast function
export const toast = {
  // Function to show a toast notification
  show: (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
    const { useToast } = require("@/components/ui/use-toast");
    const { toast } = useToast();
    return toast(props);
  },
  // Other toast methods
  dismiss: (id?: string) => {
    const { useToast } = require("@/components/ui/use-toast");
    const { dismiss } = useToast();
    return dismiss(id);
  },
  remove: (id?: string) => {
    const { useToast } = require("@/components/ui/use-toast");
    const { remove } = useToast();
    return remove(id);
  }
};
