<template>
  <div>
    <table class="table table-borderless table-sm" style="margin: .5rem !important;">
      <tbody>
        <tr>
          <td style="text-align: right">
            <select class="bg-dispatch border-teal-input" v-model="filter">
              <option value="ALL">ALL</option>
              <option value="LSPD">LSPD</option>
              <option value="BCSO">BCSO</option>
              <option value="SASP">SASP</option>
              <option value="FIRE">SAFR</option>
              <option value="SADI">SADI</option>
              <option value="OOS">OOS</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table table-sm" v-if="dispatchInitial">
      <tr>
        <td class="text-center">
          <b-spinner style="height: 3rem; width: 3rem;" variant="primary"/>
        </td>
      </tr>
    </table>
    <UnitBox v-for="unit in unitsFiltered()" :key="unit.session_identifier" :unit="unit"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UnitBox from "./unitbox";
import { EventBus } from "@/EventBus";

export default {
  name: "Units",
  components: {
    UnitBox
  },
  data() {
    return {
      filter: "ALL"
    };
  },
  computed: {
    ...mapGetters(["units", "dispatchInitial"])
  },
  created() {
    EventBus.$on("unit-filter", msg => {
      this.filter = msg;
    });
  },
  methods: {
    unitsFiltered() {
      if (this.filter === "ALL") {
        return this.units
          .filter(a => a.status !== "Out of Service")
          .sort((a, b) => (a.session_identifier > b.session_identifier ? 1 : -1));
      }
      if (this.filter === "OOS") {
        return this.units
          .filter(a => a.status === "Out of Service")
          .sort((a, b) => (a.session_identifier > b.session_identifier ? 1 : -1));
      }
      return this.units
        .filter(
          a => a.dept.role === this.filter && a.status !== "Out of Service"
        )
        .sort((a, b) => (a.session_identifier > b.session_identifier ? 1 : -1));
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-filter {
  padding: 0;
  margin: 0;
  padding-left: 5px;
  padding-right: 5px;
  color: #00a0dd;
  border: 1px solid rgb(0, 0, 150);
}
.table-border-teal tr td {
  border: 1px solid rgb(0, 0, 150);
  color: white;
}
.btn-hollow {
  background: unset;
}
.border-teal-input {
  border: 1px solid rgb(0, 0, 150);
}

.bg-dispatch {
  background-color: #001743 !important;
  color: #00a0dd;
}
</style>
