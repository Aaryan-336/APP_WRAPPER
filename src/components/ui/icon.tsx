import { icons, CircleQuestionMark, type LucideProps } from "lucide-react";

export type IconName = keyof typeof icons;

interface DynamicIconProps extends LucideProps {
  name: string;
}

/** Renders a lucide-react icon by its string name (as configured in admin/data). */
export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const Cmp = (icons as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Cmp) return <CircleQuestionMark {...props} />;
  return <Cmp {...props} />;
}
