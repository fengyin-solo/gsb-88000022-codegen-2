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

export const MISSING_OWNER_LABEL = '待指派'
export const MISSING_STAGE_LABEL = '待确认'

export function isBlank(value) {
  return value === null || value === undefined || String(value).trim() === ''
}

// 缺少处理人员时显式标注，绝不渲染成空值或 0
export function ownerLabel(owner) {
  return isBlank(owner) ? MISSING_OWNER_LABEL : String(owner).trim()
}

// 缺少当前阶段时显式标注，保证聚合时该记录仍被计数
export function stageLabel(stage) {
  return isBlank(stage) ? MISSING_STAGE_LABEL : String(stage).trim()
}

const RISK_RANK = { high: 3, medium: 2, low: 1 }

export function riskRank(risk) {
  return RISK_RANK[risk] ?? 0
}

export function maxRisk(risks) {
  let current = null
  for (const risk of risks) {
    if (riskRank(risk) > riskRank(current)) {
      current = risk
    }
  }
  return current
}
