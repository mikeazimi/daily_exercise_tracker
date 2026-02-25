import { EXERCISES } from "@/lib/data/exercises";
import { EXERCISE_CATALOG } from "@/lib/data/exercise-catalog";

export function generateStaticParams() {
  // Combine legacy exercise IDs and catalog IDs (deduplicate)
  const ids = new Set<string>();
  EXERCISES.forEach((e) => ids.add(e.id));
  EXERCISE_CATALOG.forEach((e) => ids.add(e.id));
  return Array.from(ids).map((id) => ({ id }));
}

export default function ExerciseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
