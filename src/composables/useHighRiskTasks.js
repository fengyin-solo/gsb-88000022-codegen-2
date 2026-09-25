import { computed } from 'vue'

import { restorationTasks } from '../data/restorationData'
import { ownerLabel, stageLabel } from '../utils/restorationFormatters'

export function isHighRiskTask(task) {
  return task?.risk === 'high'
}

export function isOwnerMissing(task) {
  return !(typeof task?.owner === 'string' && task.owner.trim())
}

export function isStageMissing(task) {
  return !(typeof task?.stage === 'string' && task.stage.trim())
}

export function useHighRiskTasks(tasks = restorationTasks) {
  const highRiskTasks = computed(() => tasks.filter(isHighRiskTask))

  const highRiskCount = computed(() => highRiskTasks.value.length)

  const highRiskGroups = computed(() => {
    const groups = new Map()

    for (const task of highRiskTasks.value) {
      if (!groups.has(task.title)) {
        groups.set(task.title, {
          title: task.title,
          tasks: [],
        })
      }
      groups.get(task.title).tasks.push(task)
    }

    return [...groups.values()].map((group) => ({
      ...group,
      count: group.tasks.length,
      owners: [...new Set(group.tasks.map((task) => ownerLabel(task.owner)))],
      stages: [...new Set(group.tasks.map((task) => stageLabel(task.stage)))],
      missingOwnerCount: group.tasks.filter(isOwnerMissing).length,
      missingStageCount: group.tasks.filter(isStageMissing).length,
    }))
  })

  const missingOwnerCount = computed(
    () => highRiskTasks.value.filter(isOwnerMissing).length,
  )
  const missingStageCount = computed(
    () => highRiskTasks.value.filter(isStageMissing).length,
  )

  return {
    highRiskTasks,
    highRiskCount,
    highRiskGroups,
    missingOwnerCount,
    missingStageCount,
  }
}
