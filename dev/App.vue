<template>
  <div>
    {{ name }}
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    setup() {
      const name = ref('sdsdf')
      return {
        name
      }
    }
  })
</script>
