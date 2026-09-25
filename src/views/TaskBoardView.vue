<script setup>
import { computed } from 'vue'

import PanelSection from '../components/common/PanelSection.vue'
import TaskTable from '../components/restoration/TaskTable.vue'
import HighRiskBoard from '../components/restoration/HighRiskBoard.vue'
import { riskRank, useHighRiskTasks } from '../composables/useHighRiskTasks'

const { allTasks } = useHighRiskTasks()

// 与原台账一致：按风险从高到低排序
const sortedTasks = computed(() =>
  [...allTasks.value].sort((a, b) => riskRank(b.risk) - riskRank(a.risk)),
)
</script>

<template>
  <div class="view-stack">
    <HighRiskBoard />

    <PanelSection id="all-tasks" title="任务台账" badge="按风险排序">
      <TaskTable :rows="sortedTasks" />
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
  gap: 24px;
}
</style>
