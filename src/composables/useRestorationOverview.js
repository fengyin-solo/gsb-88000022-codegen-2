import { computed } from 'vue'

import {
  restorationBatches,
  restorationEnvironment,
  restorationTasks,
} from '../data/restorationData'
import { isHighRiskTask } from './useHighRiskTasks'

export function useRestorationOverview() {
  const batchCount = computed(() => restorationBatches.length)
  const highRiskCount = computed(
    () => restorationTasks.filter(isHighRiskTask).length,
  )
  const environmentCount = computed(() => restorationEnvironment.length)
  const ownerCount = computed(
    () =>
      new Set(
        restorationTasks
          .map((item) => item.owner?.trim())
          .filter(Boolean),
      ).size,
  )

  return {
    batchCount,
    highRiskCount,
    environmentCount,
    ownerCount,
  }
}
