// Helper function to format the time remaining until a due date

export function formatTimeRemaining(
     dueDate: string | Date | null | undefined,
): string {
     if (!dueDate) return "No due date";

     const now = new Date().getTime();
     const target = new Date(dueDate).getTime();
     const diffMs = target - now;

     // If the due date has already passed
     if (diffMs <= 0) {
          return "Overdue";
     }

     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
     const diffDays = Math.floor(diffHours / 24);

     // More than 24 hours (1 or more days remaining)
     if (diffDays >= 1) {
          return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
     }

     // Less than a day, but at least 1 hour remaining
     if (diffHours >= 1) {
          return `${diffHours} ${diffHours === 1 ? "hour" : "hours"}`;
     }

     // Less than 1 hour remaining
     const diffMinutes = Math.floor(diffMs / (1000 * 60));
     return `${Math.max(1, diffMinutes)} ${diffMinutes === 1 ? "min" : "mins"}`;
}
export function getInitials(name: string | null): string {
     if (!name) return "?";
     return name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
}
export function formatDate(date: Date): string {
     return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
     });
}
export function formatTime(date: Date): string {
     return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
     });
}
export function getGreeting(): string {
     const hour = new Date().getHours();
     if (hour < 12) return "Good morning";
     if (hour < 18) return "Good afternoon";
     return "Good evening";
}
export function formatDueDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `${diffDays} days left`;
}