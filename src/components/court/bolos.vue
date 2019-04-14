<template>
  <div>
    <table class="table table-bordered text-uppercase">
      <tr class="table-info">
        <td colspan="2">BOLOs</td>
      </tr>
      <tr v-if="bolos.length===0">
        <td colspan="2">No active BOLOs.</td>
      </tr>
      <tr v-for="bolo in bolos" :key="bolo.id">
        <td colspan="2">
          <b>
            <u>BOLO</u>
            ISSUED ON {{ bolo.created_at.substring(5, 16).replace("T", " AT ").replace("-", "/") }}
          </b>
          <p v-if="bolo.person_info !== null">
            <b>SUSPECT INFO:</b>
            {{ bolo.person_info }}
          </p>
          <p v-if="bolo.vehicle_info !== null">
            <b>VEHICLE INFO:</b>
            {{ bolo.vehicle_info }}
          </p>
          <p>
            <b>DETAILS:</b>
            {{ bolo.details }}
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "LEOBOLOs",
  computed: {
    ...mapGetters(["bolos"])
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
table td {
  color: #fff;
}
.table-info td {
  background-color: rgb(0, 0, 100);
  border: 1px solid white;
}
</style>
