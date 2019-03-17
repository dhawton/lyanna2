<template>
  <table class="table table-border-teal table-sm" style="margin: 0;">
    <tr>
      <td
        rowspan="2"
        style="width: 60px; text-align: center; vertical-align: middle;"
        @click="EventBus.$emit('unit-edit', { identifier: unit.session_identifier, field: 'identifier'})"
        class="hovercursor"
      >{{unit.session_identifier}}</td>
      <td colspan="2">{{unit.session_name}}</td>
      <td
        style="width: 50px;"
        class="hovercursor"
        :class="`dept-${agencySuperShort[unit.dept.role]}`"
        @click="EventBus.$emit('unit-edit', { identifier: unit.session_identifier, field: 'dept'})"
      >{{ agencySuperShort[unit.dept.role] }}</td>
    </tr>
    <tr>
      <td
        class="hovercursor"
        :class="`stat-${formatClass(unit.status)}`"
        @click="EventBus.$emit('unit-edit', { identifier: unit.session_identifier, field: 'status'})"
      >{{unit.status}}</td>
      <td
        colspan="2"
        :class="callnumber() === '00000000' ? 'invis' : ''"
        @click="EventBus.$emit('unit-edit', { identifier: unit.session_identifier, field: 'callnumber'})"
        class="hovercursor"
      >{{callnumber()}}</td>
    </tr>
  </table>
</template>

<script>
import { mapGetters } from "vuex";
import { agencySuperShort } from "@/utils/commondata";
import { EventBus } from "@/EventBus";

export default {
  name: "UnitBox",
  props: ["unit"],
  data() {
    return {
      agencySuperShort,
      EventBus
    };
  },
  computed: {
    ...mapGetters(["calls"])
  },
  created() {},
  methods: {
    callnumber() {
      let ret = "00000000";
      this.calls.forEach(v => {
        if (v.assigned.length > 0) {
          v.assigned.forEach(v2 => {
            if (v2 === this.unit.session_identifier) {
              ret = v.callnumber.substr(4);
            }
          });
        }
      });
      return ret;
    },
    formatClass(status) {
      status = status.toLowerCase();
      status = status.split("-").join("");
      status = status.split(" ").join("");
      return status;
    }
  }
};
</script>

<style scoped>
.invis {
  color: #0a0f28 !important;
}
.table-border-teal tr td {
  border: 1px solid rgb(0, 45, 112) !important;
  color: rgb(206, 222, 255);
}
.dept {
  text-align: center;
}
.dept-SP {
  background-color: #ffd700;
  color: #000 !important;
}
.dept-BC {
  background-color: #000;
  color: #ffd700;
}
.dept-PD {
  background-color: #00a0dd;
  color: #000000 !important;
}
.dept-DI {
  background-color: darkgreen;
  color: #000 !important;
}
.dept-FIRE {
  background-color: darkred;
  color: white;
}
.stat {
  text-align: center;
}
.stat-available {
  background-color: rgb(0, 61, 0);
  color: white;
}
.stat-busy {
  background-color: rgb(110, 0, 0);
  color: white !important;
}
.stat-outofservice {
  background-color: rgb(50, 50, 50);
  color: white;
}
.stat-enroute {
  background-color: rgb(50, 50, 120);
  color: white;
}
.stat-onscene {
  background-color: rgb(117, 117, 0);
  color: white !important;
}
</style>
