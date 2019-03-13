<template>
  <div>
    <table class="table table-bordered text-uppercase">
      <thead>
        <tr>
          <th style="width: 50px;">Identifier</th>
          <th style="width: 50px;">Agency</th>
          <th style="width: 150px;">Name</th>
          <th style="width: 150px;">Status</th>
          <th>Assigned Call</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="unit in this.units.sort(
            (a, b) => (a.session_identifier > b.session_identifier) ?
             1
             : (a.session_identifier === b.session_identifier) ?
              ((a.session_name > b.session_name) ? 1 : -1) : -1 ) "
          :key="unit.id"
        >
          <td>{{ unit.session_identifier }}</td>
          <td :class="'bg-' + unit.dept.role">{{ agencyAbbreviations[unit.dept.role] }}</td>
          <td>{{ unit.session_name }}</td>
          <td>{{ unit.status }}</td>
          <td>{{ call(unit.session_identifier) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { agencyAbbreviations } from "@/utils/commondata";

export default {
  name: "ActiveUnits",
  data() {
    return {
      agencyAbbreviations
    };
  },
  computed: {
    ...mapGetters(["units", "calls"])
  },
  methods: {
    call(id) {
      let ret = "No call assigned";
      this.calls.forEach(v => {
        if (v.assigned.includes(id)) {
          ret = `${v.callnumber} // ${v.type} // ${v.address}, ${v.city}`;
        }
      });
      return ret;
    }
  }
};
</script>

<style lang="scss" scoped>
table td,
table th {
  color: #fff;
}
td.bg-highway {
  background-color: darkgoldenrod;
  color: black;
}
td.bg-sheriff {
  color: darkgoldenrod;
  background-color: black;
}
td.bg-police {
  background-color: skyblue;
  color: black;
}
td.bg-intel {
  background-color: darkgreen;
  color: black;
}
</style>
