import { format, getDay } from "date-fns";

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export type WorkoutType = "A" | "B" | "rest";

export function getTodaysWorkoutType(date: Date = new Date()): WorkoutType {
  const day = getDay(date); // 0 = Sunday, 1 = Monday, ...
  // Mon(1), Wed(3), Fri(5) = Workout A
  // Tue(2), Thu(4), Sat(6) = Workout B
  // Sun(0) = Rest
  if (day === 0) return "rest";
  if (day % 2 === 1) return "A";
  return "B";
}

export function getWorkoutLabel(type: WorkoutType): string {
  switch (type) {
    case "A":
      return "Push & Posture";
    case "B":
      return "Pull & Core";
    case "rest":
      return "Rest Day";
  }
}

export function formatDate(date: Date): string {
  return format(date, "EEEE, MMMM d");
}
