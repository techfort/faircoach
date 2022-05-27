<template>  
  <div class="form-check form-switch">
    <input class="form-check-input appearance-none w-9 -ml-10 rounded-full h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-400 focus:outline-none cursor-pointer shadow-sm" 
    type="checkbox" role="switch" id="flexSwitchCheckDefault" v-bind="switchValueB" v-model="switchValueB">
    <label class="form-check-label inline-block m-1" for="flexSwitchCheckDefault">{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({ 
  name: 'ToggleSwitch',
  props: { 
    'switchValue': Boolean, 
    'label': String,
  },
  emits: ['update:switchValue'],
  setup(props: any, { emit }) { 
    const switchValueB = computed({ 
      get: () => props.switchValue, 
      set: (value) => emit('update:switchValue', value) 
    })
    return { 
      switchValueB,
    } 
  }
})
</script>
