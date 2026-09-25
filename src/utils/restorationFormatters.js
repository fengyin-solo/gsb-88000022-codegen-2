export const MISSING_OWNER_LABEL = '未指派'
export const MISSING_STAGE_LABEL = '阶段待确认'

export function riskMeta(risk) {
  const map = {
    high: {
      label: '高',
      tone: 'high',
    },
    medium: {
      label: '中',
      tone: 'medium',
    },
    low: {
      label: '低',
      tone: 'low',
    },
  }

  return map[risk] ?? map.low
}

export function riskRank(risk) {
  const map = {
    high: 0,
    medium: 1,
    low: 2,
  }

  return map[risk] ?? map.low
}

export function ownerLabel(owner) {
  return typeof owner === 'string' && owner.trim() ? owner : MISSING_OWNER_LABEL
}

export function stageLabel(stage) {
  return typeof stage === 'string' && stage.trim() ? stage : MISSING_STAGE_LABEL
}
