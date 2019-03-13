<template>
  <div v-if="assignedCall === null">You do not have an assigned call.</div>
  <div v-else>
    <table class="table table-bordered text-uppercase">
      <tr class="table-info">
        <td colspan="2">Assigned Call</td>
      </tr>
      <tr>
        <td colspan="2">
          <b>CN:</b>
          {{ assignedCall.callnumber }}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <b>ADDRESS:</b>
          {{ assignedCall.address }}, {{ assignedCall.city }}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <b>TYPE:</b>
          {{ assignedCall.type }}
          <br>
          <br>
          <b>DESCRIPTION:</b>
          {{ assignedCall.description }}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <button class="btn btn-primary btn-darkblue">Clear Call</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MDTCall",
  computed: {
    ...mapGetters(["assignedCall"])
  }
};
</script>

<style lang="scss" scoped>
.btn-darkblue {
  background-color: rgb(0, 0, 40);
  color: #fff;
  border: 1px solid rgb(0, 0, 255);
}
.btn-darkblue:hover {
  background-color: rgb(0, 0, 100);
  color: #fff;
}
</style>
