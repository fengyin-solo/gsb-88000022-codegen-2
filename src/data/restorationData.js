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

export const restorationTasks = [
  {
    id: 'task-a03-1',
    title: '明抄本县志残卷',
    volume: '卷上',
    stage: '补纸前',
    risk: 'high',
    owner: '韩澈',
    note: '虫道贯穿标题栏，需先固色。',
  },
  {
    id: 'task-b11-1',
    title: '碑帖拓片册页',
    volume: '册二',
    stage: '控湿中',
    risk: 'medium',
    owner: '陆宁',
    note: '边缘卷曲，可延后压平。',
  },
  {
    id: 'task-c02-1',
    title: '戏曲抄本散页',
    volume: '散页袋一',
    stage: '归档前',
    risk: 'low',
    owner: '周恬',
    note: '等待封套尺寸确认。',
  },
  {
    id: 'task-a03-2',
    title: '明抄本县志残卷',
    volume: '卷下',
    stage: '固色复核',
    risk: 'high',
    owner: '',
    note: '卷下扉页霉斑待复核，尚未指派修复师。',
  },
  {
    id: 'task-d07-1',
    title: '宋刻本经折装残册',
    volume: '册三',
    stage: '',
    risk: 'high',
    owner: '沈沂',
    note: '新入库残册，虫蛀范围与工序排期待评估。',
  },
]
