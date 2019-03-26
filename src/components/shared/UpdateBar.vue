<template>
  <div v-if="updateReady" class="updateDiv">
    Lyanna has received an upgrade. Finish what you're doing and refresh this screen to load the new
    changes.
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "UpdateBar",
  computed: {
    ...mapGetters(["updateReady"])
  }
};
</script>

<style lang="scss" scoped>
.updateDiv {
  height: 40px;
  line-height: 40px;
  background-color: #cc0000;
  color: white;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  opacity: 1;
  z-index: 999999;
}
</style>
