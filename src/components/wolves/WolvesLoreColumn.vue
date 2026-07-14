<script setup lang="ts">
import type { Component } from 'vue'
import type { LoreKind } from '../../data/wolves-lore-records'
import { computed } from 'vue'
import { loreRecords } from './lore'
import ChatlogLoreView from './lore/ChatlogLoreView.vue'
import QuoteLoreView from './lore/QuoteLoreView.vue'

const props = defineProps<{
  artifactId: string
  duration: number
  warning?: string
}>()

const NewsLoreView = ChatlogLoreView
const SourceLoreView = ChatlogLoreView
const CharacterSheetRouter = ChatlogLoreView
const FieldReportLoreView = ChatlogLoreView
const LocationDossierView = ChatlogLoreView
const GuardianBondLoreView = ChatlogLoreView

const loreViewByKind: Record<LoreKind, Component> = {
  'chatlog': ChatlogLoreView,
  'quote': QuoteLoreView,
  'news': NewsLoreView,
  'source': SourceLoreView,
  'character-sheet': CharacterSheetRouter,
  'field-report': FieldReportLoreView,
  'location-dossier': LocationDossierView,
  'guardian-bond': GuardianBondLoreView,
}

const currentRecord = computed(() =>
  loreRecords.find(record => record.id === props.artifactId) ?? null,
)

const selectedLoreView = computed(() =>
  currentRecord.value ? loreViewByKind[currentRecord.value.kind] : null,
)
</script>

<template>
  <div class="wolves-lore-column">
    <component
      :is="selectedLoreView"
      v-if="currentRecord"
      :record="currentRecord"
      :duration="duration"
      :warning="warning"
    />
  </div>
</template>

<style scoped lang="scss">
.wolves-lore-column {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    flex: 1;
    min-height: 0;
  }
}
</style>
