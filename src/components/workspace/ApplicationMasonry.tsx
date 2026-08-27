import type { Application } from "@/types";
import { ApplicationMasonryCard } from "@/components/workspace/ApplicationMasonryCard";

interface ApplicationMasonryProps {
  applications: Application[];
}

/** Controlled Pinterest-style masonry — CSS Grid with a fixed set of
 * admin-selectable spans (hero/wide/tall/standard/rich). Never an
 * uncontrolled waterfall. */
export function ApplicationMasonry({ applications }: ApplicationMasonryProps) {
  return (
    <div className="hidden gap-5 md:grid md:auto-rows-[minmax(200px,auto)] md:grid-cols-2 lg:grid-cols-4">
      {applications.map((app, i) => (
        <ApplicationMasonryCard key={app.id} app={app} index={i} />
      ))}
    </div>
  );
}
