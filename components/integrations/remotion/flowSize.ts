import type { FlowVariant } from './FlowComposition'

export const SIZE: Record<FlowVariant, { width: number; height: number }> = {
  make: { width: 1600, height: 900 },
  code: { width: 1600, height: 900 },
  direct: { width: 1600, height: 900 },
  overview: { width: 1600, height: 600 },
  tiers: { width: 1600, height: 600 },
  web: { width: 1000, height: 800 },
}
