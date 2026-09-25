import { computed } from 'vue'

import {
  restorationBatches,
  restorationEnvironment,
} from '../data/restorationData'
import { useHighRiskTasks } from './useHighRiskTasks'

export function useRestorationOverview() {
  const { allTasks, highRiskCount } = useHighRiskTasks()

  const batchCount = computed(() => restorationBatches.length)
  const environmentCount = computed(() => restorationEnvironment.length)
  // 仅统计已指派的处理人员，缺失负责人不进入人员计数
  const ownerCount = computed(
    () =>
      new Set(
        allTasks.value.filter((task) => !task.ownerMissing).map((task) => task.owner),
      ).size,
  )

  return {
    batchCount,
    highRiskCount,
    environmentCount,
    ownerCount,
  }
}
