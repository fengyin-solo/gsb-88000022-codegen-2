export const restorationNavigation = [
  { label: '修复总览', to: '/' },
  { label: '批次档案', to: '/batches' },
  { label: '任务清单', to: '/tasks' },
]

export const restorationHero = {
  title: '古籍虫蛀修复批次板',
  description:
    '聚焦修复批次、控湿参数和文献归档风险，适合作为修复工作室内部业务系统的前端原型。',
  backlogLabel: '待处理批次',
  backlogValue: '12 册',
  note: '高湿季节前优先清理虫道扩散页。',
}

export const restorationBatches = [
  {
    code: 'A-03',
    title: '明抄本县志残卷',
    pages: '17-29',
    risk: 'high',
    status: '补纸前',
    note: '虫道集中在装订线外沿。',
  },
  {
    code: 'B-11',
    title: '碑帖拓片册页',
    pages: '5-14',
    risk: 'medium',
    status: '控湿中',
    note: '需先降湿 48 小时，再进入纤维加固。',
  },
  {
    code: 'C-02',
    title: '戏曲抄本散页',
    pages: '1-9',
    risk: 'low',
    status: '归档前',
    note: '边角缺损明显，建议先做透明托裱。',
  },
]

// 文献对象台账（高风险聚合看板按此对象整理）
export const restorationVolumes = [
  {
    code: 'D-08',
    title: '清刻本医方合抄',
    pages: '31-42',
    note: '霉斑与虫蛀交叠，需与控湿记录联检。',
  },
]

export const restorationEnvironment = [
  {
    label: '相对湿度',
    value: '52%',
    note: '控制线 50% - 55%',
  },
  {
    label: '纸浆补配',
    value: '2 批',
    note: '桑皮纤维待过滤',
  },
  {
    label: '紫外检查',
    value: '4 页',
    note: '夜间统一复核霉斑残留',
  },
]

export const restorationSteps = [
  '拍照建档并标注虫蛀起止页。',
  '低压吸附除尘，保留边角碎纤维。',
  '喷雾回软后局部补纸，不做整页过度清洗。',
  '平整定型 8 小时后转入无酸盒暂存。',
]

// 任务记录。部分条目暂缺负责人或阶段，前端必须显式标注并照常计数，
// 不能在聚合或筛选时被静默丢弃。
export const restorationTasks = [
  {
    id: 'T-001',
    title: '明抄本县志残卷',
    volumeCode: 'A-03',
    stage: '补纸前',
    risk: 'high',
    owner: '韩澈',
    note: '虫道贯穿标题栏，需先固色。',
  },
  {
    id: 'T-002',
    title: '清刻本医方合抄',
    volumeCode: 'D-08',
    stage: '控湿中',
    risk: 'high',
    owner: '沈药',
    note: '霉斑边缘粉化，翻页需托底。',
  },
  {
    id: 'T-003',
    title: '清刻本医方合抄',
    volumeCode: 'D-08',
    stage: null,
    risk: 'high',
    owner: '沈药',
    note: '加固方案未定，阶段待工序会上确认。',
  },
  {
    id: 'T-004',
    title: '清刻本医方合抄',
    volumeCode: 'D-08',
    stage: '除尘中',
    risk: 'high',
    owner: null,
    note: '原负责人外借支援，需尽快重新指派。',
  },
  {
    id: 'T-005',
    title: '碑帖拓片册页',
    volumeCode: 'B-11',
    stage: '控湿中',
    risk: 'medium',
    owner: '陆宁',
    note: '边缘卷曲，可延后压平。',
  },
  {
    id: 'T-006',
    title: '戏曲抄本散页',
    volumeCode: 'C-02',
    stage: '归档前',
    risk: 'low',
    owner: '周恬',
    note: '等待封套尺寸确认。',
  },
]
