<template>
  <div>
    <button
      style="width: 120px; height: 45px; border-radius: 3px; background-color: #e3e2e2;"
      @click="store.commit('changeName', 'aaaaa')"
    >
      CHANGE
    </button>
    <h1>{{ store.state.name }}</h1>
    <h1>{{ name }}</h1>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { createStore } from '../src'



  export default defineComponent({
    setup(){
      const name = ref('sdsdf')
      const store = createStore({
        state: {
          name: ''
        },
        mutations: {
          changeName(state, name) {
            state.name = name
          }
        },
        actions: {
          getName() {
            return true
          }
        }
      })

      console.log(store.commit('changeName', null))
      return {
        store,
        name
      }
    }
  })
</script>
