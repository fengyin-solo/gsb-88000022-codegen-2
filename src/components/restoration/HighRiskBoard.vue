<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PanelSection from '../common/PanelSection.vue'
import { useHighRiskTasks } from '../../composables/useHighRiskTasks'
import {
  MISSING_OWNER_LABEL,
  MISSING_STAGE_LABEL,
  riskMeta,
} from '../../utils/restorationFormatters'

const route = useRoute()
const router = useRouter()
const {
  highRiskCount,
  stageOptions,
  filterByStage,
  volumeCardsByStage,
} = useHighRiskTasks()

// 筛选状态只认 URL query，从明细返回时 query 原样带回，筛选与计数天然一致
const activeStage = computed(() => {
  const raw = Array.isArray(route.query.stage)
    ? route.query.stage[0]
    : route.query.stage
  return stageOptions.value.includes(raw) ? raw : ''
})

const filteredTasks = computed(() => filterByStage(activeStage.value))
const volumeCards = computed(() => volumeCardsByStage(activeStage.value))

function selectStage(stage) {
  router.push({
    name: 'tasks',
    query: stage ? { stage } : undefined,
  })
}

function detailLink(card) {
  return {
    name: 'high-risk-volume',
    params: { volumeCode: card.volumeCode },
    query: activeStage.value ? { stage: activeStage.value } : undefined,
  }
}
</script>

<template>
  <PanelSection title="高风险任务聚合看板" badge="按文献对象汇总">
    <!-- 没有高风险任务：给出可继续操作的指引，而不是空白看板 -->
    <div v-if="highRiskCount === 0" class="board-empty">
      <strong class="board-empty-title">当前没有高风险任务</strong>
      <p class="board-empty-text">
        暂无风险等级为高的文献记录，可以继续在下方任务台账中处理中低风险任务，
        或前往批次档案查看在修文献。
      </p>
      <div class="board-empty-actions">
        <a class="board-link" href="#all-tasks">前往任务台账</a>
        <RouterLink class="board-link" to="/batches">查看批次档案</RouterLink>
      </div>
    </div>

    <template v-else>
      <div class="board-toolbar">
        <div class="stage-filter" role="group" aria-label="按阶段筛选高风险任务">
          <button
            type="button"
            :class="['stage-chip', { 'stage-chip--active': !activeStage }]"
            @click="selectStage('')"
          >
            全部阶段
          </button>
          <button
            v-for="option in stageOptions"
            :key="option"
            type="button"
            :class="['stage-chip', { 'stage-chip--active': activeStage === option }]"
            @click="selectStage(option)"
          >
            {{ option }}
          </button>
        </div>
        <p class="board-count" data-testid="board-count">
          高风险任务 <strong>{{ filteredTasks.length }}</strong> 条 ·
          涉及文献 <strong>{{ volumeCards.length }}</strong> 册
          <template v-if="activeStage">
            （当前筛选：{{ activeStage }}）
          </template>
        </p>
      </div>

      <!-- 筛选后无匹配：同样不能静默归零，给出解除筛选的操作 -->
      <div v-if="filteredTasks.length === 0" class="board-empty">
        <strong class="board-empty-title">
          「{{ activeStage }}」阶段暂无高风险任务
        </strong>
        <p class="board-empty-text">
          其他阶段仍有 {{ highRiskCount }} 条高风险任务在处理，清除筛选后可继续查看。
        </p>
        <div class="board-empty-actions">
          <button type="button" class="board-link" @click="selectStage('')">
            清除筛选，查看全部
          </button>
        </div>
      </div>

      <div v-else class="volume-grid">
        <RouterLink
          v-for="card in volumeCards"
          :key="card.volumeCode"
          :to="detailLink(card)"
          class="volume-card"
          data-testid="volume-card"
        >
          <div class="volume-head">
            <small class="volume-code">文献 {{ card.volumeCode }}</small>
            <span
              :class="[
                'risk-pill',
                `risk-pill--${riskMeta(card.highestRisk).tone}`,
              ]"
            >
              整体风险 · {{ riskMeta(card.highestRisk).label }}
            </span>
          </div>
          <h4>{{ card.title }}</h4>
          <p v-if="card.pages" class="volume-pages">页码：{{ card.pages }}</p>

          <dl class="volume-meta">
            <div>
              <dt>高风险任务</dt>
              <dd class="volume-number">{{ card.highRiskCount }}</dd>
            </div>
            <div>
              <dt>处理人员</dt>
              <dd>
                <span
                  v-for="owner in card.owners"
                  :key="owner"
                  :class="['meta-tag', { 'meta-tag--missing': owner === MISSING_OWNER_LABEL }]"
                >
                  {{ owner }}
                </span>
              </dd>
            </div>
            <div>
              <dt>当前阶段</dt>
              <dd>
                <span
                  v-for="stage in card.stages"
                  :key="stage"
                  :class="['meta-tag', { 'meta-tag--missing': stage === MISSING_STAGE_LABEL }]"
                >
                  {{ stage }}
                </span>
              </dd>
            </div>
          </dl>

          <span class="volume-detail-link">查看该册明细 →</span>
        </RouterLink>
      </div>
    </template>
  </PanelSection>
</template>

<style scoped>
.board-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stage-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stage-chip {
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid rgba(79, 57, 32, 0.18);
  background: rgba(255, 255, 255, 0.72);
  color: #6a5439;
  font: inherit;
  font-size: 0.86rem;
  cursor: pointer;
}

.stage-chip--active {
  background: #5d4322;
  border-color: #5d4322;
  color: #fff8eb;
}

.board-count {
  margin: 0;
  font-size: 0.88rem;
  color: #6a5439;
}

.board-count strong {
  color: #913d2f;
  font-size: 1rem;
}

.volume-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.volume-card {
  display: block;
  padding: 18px;
  border-radius: 20px;
  background: #f4ebda;
  border: 1px solid rgba(109, 80, 40, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.volume-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(100, 73, 34, 0.14);
}

.volume-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.volume-code {
  color: #82684b;
  letter-spacing: 0.06em;
}

.volume-card h4 {
  margin: 10px 0 4px;
  font-size: 1.06rem;
}

.volume-pages {
  margin: 0 0 12px;
  color: #6a5439;
  font-size: 0.9rem;
}

.volume-meta {
  display: grid;
  gap: 10px;
  margin: 0;
}

.volume-meta dt {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #82684b;
  margin-bottom: 4px;
}

.volume-meta dd {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.volume-number {
  font-size: 1.3rem;
  font-weight: 700;
  color: #913d2f;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  font-size: 0.84rem;
  color: #5c4a33;
}

.meta-tag--missing {
  background: #efd0c9;
  color: #913d2f;
  font-weight: 700;
}

.meta-tag--missing::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #b85a45;
}

.risk-pill {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
}

.risk-pill--high {
  background: #efd0c9;
  color: #913d2f;
}

.risk-pill--medium {
  background: #f6e5b9;
  color: #8b6314;
}

.risk-pill--low {
  background: #d9ead9;
  color: #366338;
}

.volume-detail-link {
  display: inline-block;
  margin-top: 14px;
  font-size: 0.88rem;
  color: #5d4322;
  font-weight: 700;
}

.board-empty {
  padding: 26px 22px;
  border-radius: 18px;
  border: 1px dashed rgba(109, 80, 40, 0.35);
  background: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.board-empty-title {
  display: block;
  font-size: 1rem;
  color: #5d4322;
}

.board-empty-text {
  margin: 8px auto 14px;
  max-width: 460px;
  color: #6a5439;
  font-size: 0.92rem;
}

.board-empty-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.board-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  background: #5d4322;
  color: #fff8eb;
  font-size: 0.88rem;
  text-decoration: none;
  border: none;
  font: inherit;
  font-size: 0.88rem;
  cursor: pointer;
}

@media (max-width: 900px) {
  .volume-grid {
    grid-template-columns: 1fr;
  }
}
</style>
