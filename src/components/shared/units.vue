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
        <tr
          v-for="unit in unitsByRole(['police','sheriff','highway','intel','fire'])"
          :key="unit.id"
        >
          <td class="text-center">{{ morphIdentifier(unit) }}</td>
          <td
            class="text-center"
            :class="'bg-' + unit.dept.role"
          >{{ agencyAbbreviations[unit.dept.role] }}</td>
          <td>{{ unit.session_name }}</td>
          <td
            class="text-center"
            :class="'status-' + unit.status.split(' ').join('').toLowerCase()"
          >{{ unit.status }}</td>
          <td>{{ call(unit.session_identifier) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  agencyAbbreviations,
  fireshortname,
  fireunitid
} from "@/utils/commondata";

export default {
  name: "ActiveUnits",
  data() {
    return {
      agencyAbbreviations,
      fireshortname,
      fireunitid
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
    ...mapGetters(["calls"]),
    police: {
      get() {
        return this.units.filter(u => u.dept.role === "police");
      }
    },
    sheriff: {
      get() {
        return this.units.filter(u => u.dept.role === "sheriff");
      }
    },
    state: {
      get() {
        return this.units.filter(u => u.dept.role === "highway");
      }
    },
    fire: {
      get() {
        return this.units.filter(u => u.dept.role === "fire");
      }
    }
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
    },
    unitsByRole(roles) {
      let units = [];
      roles.forEach(v => {
        units = [
          ...units,
          ...this.units
            .filter(u => u.dept.role === v)
            // eslint-disable-next-line no-nested-ternary
            .sort((a, b) => (a.session_identifier > b.session_identifier
                ? 1
                : b.session_identifier > a.session_identifier
                ? -1
                : 0))
        ];
      });
      return units;
    },
    morphIdentifier(unit) {
      if (unit.dept.role !== "fire") return unit.session_identifier;

      const letter = unit.session_identifier.substr(0, 1);
      let app = null;
      Object.keys(this.fireunitid).forEach(i => {
        if (this.fireunitid[i] === letter) app = i;
      });
      if (!app) return unit.session_identifier;

      return `${this.fireshortname[app]} ${unit.session_identifier.substr(1)}`;
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
