<template>
  <div>
    <table class="table table-bordered text-uppercase">
      <thead>
        <tr>
          <th style="width: 50px;">Identifier</th>
          <th style="width: 50px;">Agency</th>
          <th style="width: 150px;">Name</th>
          <th style="width: 250px;">Status</th>
          <th>Assigned Call</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in this.units" :key="unit.id">
          <td>{{ unit.session_identifier }}</td>
          <td :class="'bg-' + unit.dept.role">{{ agencyAbbreviations[unit.dept.role] }}</td>
          <td>{{ unit.session_name }}</td>
          <td :class="'status-' + unit.status.split(' ').join('').toLowerCase()">{{ unit.status }}</td>
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
    units: {
      get() {
        const data = this.$store.getters.units.filter(
          u => u.status !== "Out of Service"
        );
        // eslint-disable-next-line no-nested-ternary
        return data.sort((a, b) => (a.session_identifier > b.session_identifier
            ? 1
            : b.session_identifier > a.session_identifier
            ? -1
            : 0));
      }
    },
    ...mapGetters(["calls"])
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
  background-color: #ffd700;
  color: black;
}
td.bg-sheriff {
  color: #ffd700;
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
td.bg-fire {
  background-color: rgb(100, 0, 0);
  color: white;
}
td.status-available {
  color: darkgreen;
}
td.status-busy {
  color: #ef6c00;
}
td.status-outofservice {
  color: rgb(150, 0, 0);
}
td.status-en-route {
  color: skyblue;
}
td.status-onscene {
  color: white;
}
</style>
