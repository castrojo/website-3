import { useWindowSize } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

const { width } = useWindowSize()

/**
 * Returns true, if the screen size is currently below 956px
 */
export const IS_TABLET = computed(() => {
  return width.value <= 956
})

/**
 * Fades in + slides up 150ms after mount. Used by KnuckleTitle and KnuckleDesc.
 */
export function useFadeInUp() {
  const isLoaded = ref(false)
  onMounted(() => {
    setTimeout(() => {
      isLoaded.value = true
    }, 150)
  })
  return { isLoaded }
}
