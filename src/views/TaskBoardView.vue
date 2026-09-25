<script setup>
import { computed } from 'vue'

import PanelSection from '../components/common/PanelSection.vue'
import HighRiskBoard from '../components/restoration/HighRiskBoard.vue'
import TaskTable from '../components/restoration/TaskTable.vue'
import { restorationTasks } from '../data/restorationData'
import { riskRank } from '../utils/restorationFormatters'

const sortedTasks = computed(() =>
  [...restorationTasks].sort((a, b) => riskRank(a.risk) - riskRank(b.risk)),
)
</script>

<template>
  <div class="view-stack">
    <HighRiskBoard :tasks="restorationTasks" />

    <PanelSection title="任务清单" badge="按风险排序">
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
