<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import PanelSection from '../components/common/PanelSection.vue'
import TaskTable from '../components/restoration/TaskTable.vue'
import { useHighRiskTasks } from '../composables/useHighRiskTasks'

const route = useRoute()
const {
  highRiskTasksByVolume,
  tasksByVolume,
  getVolumeMeta,
} = useHighRiskTasks()

const volumeCode = computed(() => String(route.params.volumeCode ?? ''))
const meta = computed(() => getVolumeMeta(volumeCode.value))
const highRiskRows = computed(() => highRiskTasksByVolume(volumeCode.value))
const allRows = computed(() => tasksByVolume(volumeCode.value))

// 返回总览时把阶段筛选原样带回
const backLink = computed(() => ({
  name: 'tasks',
  query: typeof route.query.stage === 'string' && route.query.stage
    ? { stage: route.query.stage }
    : undefined,
}))

const backHint = computed(() =>
  typeof route.query.stage === 'string' && route.query.stage
    ? `返回总览（保留筛选：${route.query.stage}）`
    : '返回总览',
)
</script>

<template>
  <div class="view-stack">
    <PanelSection
      :title="`文献 ${volumeCode} · 高风险任务明细`"
      badge="单册视图"
    >
      <p class="back-line">
        <RouterLink :to="backLink" class="back-link">← {{ backHint }}</RouterLink>
      </p>

      <div v-if="highRiskRows.length === 0" class="volume-empty">
        <strong>该文献当前没有高风险任务。</strong>
        <p>
          如该文献编号下登记了新任务，可在任务台账中补充负责人与阶段后回到此页查看；
          现在可以返回聚合看板继续处理其他文献。
        </p>
        <RouterLink :to="backLink" class="back-link back-link--solid">
          返回高风险聚合看板
        </RouterLink>
      </div>

      <template v-else>
        <dl v-if="meta" class="volume-summary">
          <div>
            <dt>文献名称</dt>
            <dd>{{ meta.title }}</dd>
          </div>
          <div v-if="meta.pages">
            <dt>页码</dt>
            <dd>{{ meta.pages }}</dd>
          </div>
          <div>
            <dt>高风险任务</dt>
            <dd class="volume-summary-count">{{ highRiskRows.length }} 条</dd>
          </div>
        </dl>

        <p class="detail-count" data-testid="detail-count">
          共 {{ highRiskRows.length }} 条高风险任务
        </p>
        <TaskTable :rows="highRiskRows" />

        <p v-if="allRows.length > highRiskRows.length" class="other-tasks-note">
          该册另有 {{ allRows.length - highRiskRows.length }} 条中低风险任务，
          口径与任务台账一致，可在返回后于任务台账中查看。
        </p>
      </template>
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
}

.back-line {
  margin: 0 0 16px;
}

.back-link {
  color: #5d4322;
  font-weight: 700;
  text-decoration: none;
}

.back-link--solid {
  display: inline-flex;
  margin-top: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  background: #5d4322;
  color: #fff8eb;
}

.volume-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  margin: 0 0 18px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #f4ebda;
}

.volume-summary dt {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #82684b;
}

.volume-summary dd {
  margin: 4px 0 0;
  font-weight: 700;
}

.volume-summary-count {
  color: #913d2f;
}

.detail-count {
  margin: 0 0 12px;
  color: #6a5439;
  font-size: 0.92rem;
}

.detail-count strong {
  color: #913d2f;
}

.other-tasks-note {
  margin: 14px 2px 0;
  font-size: 0.88rem;
  color: #82684b;
}

.volume-empty {
  padding: 26px 22px;
  border-radius: 18px;
  border: 1px dashed rgba(109, 80, 40, 0.35);
  background: rgba(255, 255, 255, 0.5);
}

.volume-empty strong {
  color: #5d4322;
}

.volume-empty p {
  margin: 8px 0;
  color: #6a5439;
  font-size: 0.92rem;
}
</style>
