<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import PanelSection from '../common/PanelSection.vue'
import { useHighRiskTasks } from '../../composables/useHighRiskTasks'
import {
  MISSING_OWNER_LABEL,
  MISSING_STAGE_LABEL,
  ownerLabel,
  riskMeta,
  stageLabel,
} from '../../utils/restorationFormatters'

const props = defineProps({
  tasks: {
    type: Array,
    default: undefined,
  },
})

const {
  highRiskCount,
  highRiskGroups,
  missingOwnerCount,
  missingStageCount,
} = useHighRiskTasks(props.tasks)

const selectedTitle = ref(null)

const selectedGroup = computed(
  () =>
    highRiskGroups.value.find((group) => group.title === selectedTitle.value) ??
    null,
)

const panelTitle = computed(() =>
  selectedGroup.value
    ? `${selectedGroup.value.title} · 高风险明细`
    : '高风险任务聚合',
)

const panelBadge = computed(() =>
  selectedGroup.value
    ? `${selectedGroup.value.count} 条记录`
    : `共 ${highRiskCount.value} 项`,
)

function openDetail(title) {
  selectedTitle.value = title
}

function backToOverview() {
  selectedTitle.value = null
}
</script>

<template>
  <PanelSection :title="panelTitle" :badge="panelBadge">
    <div v-if="selectedGroup" class="board-detail">
      <button type="button" class="ghost-button" @click="backToOverview">
        ← 返回总览
      </button>

      <p
        v-if="selectedGroup.missingOwnerCount || selectedGroup.missingStageCount"
        class="data-warning"
      >
        该册有 {{ selectedGroup.missingOwnerCount }} 条任务待指派处理人员、
        {{ selectedGroup.missingStageCount }} 条任务阶段待确认，请补齐后再排期。
      </p>

      <div class="board-table">
        <div class="board-row board-head">
          <span>卷册</span>
          <span>阶段</span>
          <span>风险</span>
          <span>处理人员</span>
          <span>说明</span>
        </div>
        <div
          v-for="task in selectedGroup.tasks"
          :key="task.id"
          class="board-row"
        >
          <span>{{ task.volume || '未分册' }}</span>
          <span :class="{ 'missing-value': !task.stage }">
            {{ stageLabel(task.stage) }}
          </span>
          <span :class="['risk-tag', `risk-tag--${riskMeta(task.risk).tone}`]">
            {{ riskMeta(task.risk).label }}
          </span>
          <span :class="{ 'missing-value': !task.owner }">
            {{ ownerLabel(task.owner) }}
          </span>
          <span>{{ task.note }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="highRiskGroups.length" class="board-overview">
      <p class="board-summary">
        高风险任务 {{ highRiskCount }} 项，涉及文献对象
        {{ highRiskGroups.length }} 个；其中待指派处理人员
        <strong :class="{ 'missing-value': missingOwnerCount }">
          {{ missingOwnerCount }}
        </strong>
        条、阶段待确认
        <strong :class="{ 'missing-value': missingStageCount }">
          {{ missingStageCount }}
        </strong>
        条。
      </p>

      <div class="board-table">
        <div class="board-row board-head">
          <span>文献对象</span>
          <span>风险等级</span>
          <span>处理人员</span>
          <span>当前阶段</span>
          <span>任务数</span>
          <span>操作</span>
        </div>
        <div
          v-for="group in highRiskGroups"
          :key="group.title"
          class="board-row"
        >
          <span>{{ group.title }}</span>
          <span class="risk-tag risk-tag--high">
            {{ riskMeta('high').label }}
          </span>
          <span>
            <template v-for="owner in group.owners" :key="owner">
              <em :class="{ 'missing-value': owner === MISSING_OWNER_LABEL }">
                {{ owner }}
              </em>
            </template>
          </span>
          <span>
            <template v-for="stage in group.stages" :key="stage">
              <em :class="{ 'missing-value': stage === MISSING_STAGE_LABEL }">
                {{ stage }}
              </em>
            </template>
          </span>
          <span>{{ group.count }} 条</span>
          <span>
            <button
              type="button"
              class="ghost-button"
              @click="openDetail(group.title)"
            >
              查看明细
            </button>
          </span>
        </div>
      </div>
    </div>

    <div v-else class="board-empty">
      <h4>当前没有高风险任务</h4>
      <p>
        台账内暂无风险等级为“高”的任务。可前往批次档案核查在册批次，
        或继续在下方任务清单巡查中低风险任务，发现异常后及时调整风险等级。
      </p>
      <RouterLink class="ghost-button board-empty-link" to="/batches">
        前往批次档案
      </RouterLink>
    </div>
  </PanelSection>
</template>

<style scoped>
.board-overview,
.board-detail {
  display: grid;
  gap: 14px;
}

.board-summary {
  margin: 0;
  color: #5c4a33;
}

.board-summary strong {
  font-size: 1.05rem;
}

.board-table {
  overflow: hidden;
  border: 1px solid rgba(79, 57, 32, 0.1);
  border-radius: 18px;
}

.board-row {
  display: grid;
  grid-template-columns: 1.2fr 0.6fr 0.9fr 0.9fr 0.5fr 0.7fr;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.72);
}

.board-detail .board-row {
  grid-template-columns: 0.6fr 0.8fr 0.5fr 0.8fr 1.4fr;
}

.board-row + .board-row {
  border-top: 1px solid rgba(79, 57, 32, 0.08);
}

.board-head {
  background: #efe1c6;
  color: #775936;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
}

.board-row em {
  font-style: normal;
}

.board-row em + em::before {
  content: '、';
  color: #6a5439;
}

.risk-tag {
  display: inline-flex;
  justify-content: center;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
}

.risk-tag--high {
  background: #efd0c9;
  color: #913d2f;
}

.missing-value {
  color: #913d2f;
  font-weight: 600;
}

.data-warning {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f6e5b9;
  color: #8b6314;
}

.ghost-button {
  display: inline-flex;
  width: fit-content;
  padding: 8px 14px;
  border: 1px solid rgba(121, 88, 45, 0.35);
  border-radius: 999px;
  background: transparent;
  color: #775936;
  font: inherit;
  cursor: pointer;
  text-decoration: none;
}

.ghost-button:hover {
  background: #efe2ca;
}

.board-empty {
  display: grid;
  gap: 10px;
  justify-items: start;
  padding: 26px 20px;
  border: 1px dashed rgba(121, 88, 45, 0.35);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
}

.board-empty h4,
.board-empty p {
  margin: 0;
}

.board-empty p {
  color: #5c4a33;
}

@media (max-width: 900px) {
  .board-table {
    overflow-x: auto;
  }

  .board-row {
    min-width: 780px;
  }
}
</style>
