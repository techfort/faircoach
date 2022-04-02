<template>
  <div class="home">
    <match-setup />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MatchSetup from '@/components/MatchSetup.vue';

export default defineComponent({
  name: "HomeView",
  setup() {
    const msg = 'is it working?';
    return {
      msg,
    };
  },
  components: {
    MatchSetup,
  },
});
</script>
