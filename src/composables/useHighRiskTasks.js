import { computed } from 'vue'

import {
  restorationBatches,
  restorationTasks,
  restorationVolumes,
} from '../data/restorationData'
import {
  isBlank,
  maxRisk,
  ownerLabel,
  riskRank,
  stageLabel,
} from '../utils/restorationFormatters'

// 批次档案与独立文献册合并为文献对象目录
const volumeMetaList = [
  ...restorationBatches.map((batch) => ({
    code: batch.code,
    title: batch.title,
    pages: batch.pages,
    note: batch.note,
  })),
  ...restorationVolumes,
]

const volumeMetaMap = new Map(volumeMetaList.map((volume) => [volume.code, volume]))

// 统一归一化：缺失负责人/阶段在此显式标注并保留记录，
// 后续所有筛选、分组、计数都只能基于同一份归一化结果。
function normalizeTask(task) {
  const ownerMissing = isBlank(task.owner)
  const stageMissing = isBlank(task.stage)
  return {
    ...task,
    ownerMissing,
    stageMissing,
    ownerDisplay: ownerLabel(task.owner),
    stageDisplay: stageLabel(task.stage),
  }
}

const allTasks = computed(() => restorationTasks.map(normalizeTask))

const highRiskTasks = computed(() =>
  allTasks.value.filter((task) => task.risk === 'high'),
)

function getVolumeMeta(code) {
  return volumeMetaMap.get(code) ?? null
}

function uniqueLabels(values) {
  return [...new Set(values)]
}

// 按文献对象聚合高风险任务
function buildVolumeCards(tasks) {
  const groups = new Map()

  for (const task of tasks) {
    const group = groups.get(task.volumeCode) ?? {
      volumeCode: task.volumeCode,
      tasks: [],
    }
    group.tasks.push(task)
    groups.set(task.volumeCode, group)
  }

  return [...groups.values()]
    .map((group) => {
      const meta = getVolumeMeta(group.volumeCode)
      const allVolumeTasks = allTasks.value.filter(
        (task) => task.volumeCode === group.volumeCode,
      )
      const highestRisk =
        maxRisk(allVolumeTasks.map((task) => task.risk)) ?? null
      const owners = uniqueLabels(group.tasks.map((task) => task.ownerDisplay))
      const stages = uniqueLabels(group.tasks.map((task) => task.stageDisplay))

      return {
        volumeCode: group.volumeCode,
        title: meta?.title ?? group.volumeCode,
        pages: meta?.pages ?? '',
        note: meta?.note ?? '',
        metaFound: Boolean(meta),
        highRiskCount: group.tasks.length,
        highestRisk,
        owners,
        stages,
        tasks: group.tasks,
      }
    })
    .sort((a, b) => b.highRiskCount - a.highRiskCount || a.volumeCode.localeCompare(b.volumeCode))
}

function tasksByStage(tasks, stage) {
  if (!stage) {
    return tasks
  }
  return tasks.filter((task) => task.stageDisplay === stage)
}

export function useHighRiskTasks() {
  const highRiskCount = computed(() => highRiskTasks.value.length)

  // 阶段筛选项来自全部高风险任务，包含“待确认”，缺阶段记录可被筛到
  const stageOptions = computed(() =>
    uniqueLabels(highRiskTasks.value.map((task) => task.stageDisplay)),
  )

  const volumeCards = computed(() => buildVolumeCards(highRiskTasks.value))

  function filterByStage(stage) {
    return tasksByStage(highRiskTasks.value, stage)
  }

  function volumeCardsByStage(stage) {
    return buildVolumeCards(tasksByStage(highRiskTasks.value, stage))
  }

  function highRiskTasksByVolume(volumeCode) {
    return highRiskTasks.value.filter((task) => task.volumeCode === volumeCode)
  }

  function tasksByVolume(volumeCode) {
    return allTasks.value
      .filter((task) => task.volumeCode === volumeCode)
      .sort((a, b) => riskRank(b.risk) - riskRank(a.risk))
  }

  return {
    allTasks,
    highRiskTasks,
    highRiskCount,
    stageOptions,
    volumeCards,
    filterByStage,
    volumeCardsByStage,
    highRiskTasksByVolume,
    tasksByVolume,
    getVolumeMeta,
  }
}

export { riskRank }
