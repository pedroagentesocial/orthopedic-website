import { Footprints, Bone, Dumbbell, Hand, Activity, Sparkles, type LucideIcon } from 'lucide-react';

export const SERVICE_ICONS = {
  Footprints,
  Bone,
  Dumbbell,
  Hand,
  Activity,
  Sparkles,
} as const satisfies Record<string, LucideIcon>;

export type ServiceIconName = keyof typeof SERVICE_ICONS;
