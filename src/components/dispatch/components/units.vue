<template>
  <div>
    <table class="table table-borderless table-sm" style="margin: .5rem !important;">
      <tbody>
        <tr>
          <td style="text-align: right">
            <select class="bg-dispatch border-teal-input" v-model="filter">
              <option value="ALL">ALL</option>
              <option value="police">LSPD</option>
              <option value="sheriff">BBPD</option>
              <option value="highway">SASP</option>
              <option value="fire">SAFD</option>
              <option value="intel">SADI</option>
              <option value="OOS">OOS</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table table-borderless table-sm" v-if="dispatchInitial">
      <tr>
        <td class="text-center">
          <b-spinner style="height: 3rem; width: 3rem;" variant="primary"/>
        </td>
      </tr>
    </table>
    <UnitBox v-for="unit in unitsFiltered()" :key="unit.session_identifier" :unit="unit"/>
    <b-modal
      id="unitedit"
      title="Edit Unit"
      ref="unitedit"
      v-model="unitEdit.show"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      lazy
      @ok="doEdit"
    >
      <div v-if="unitEdit.field === 'identifier'">
        <b-form-group
          class="col-md-12"
          :label="`Identifier for ${unitEdit.id}`"
          label-for="idnumber"
        >
          <b-form-input v-model="unitEdit.data"/>
        </b-form-group>
      </div>
      <div v-if="unitEdit.field === 'status'">
        <b-form-group class="col-md-12" :label="`Status for ${unitEdit.id}`" label-for="idnumber">
          <b-form-select v-model="unitEdit.data">
            <option value="Available">AVAILABLE</option>
            <option value="Busy">BUSY</option>
            <option value="Out of Service">OUT OF SERVICE</option>
            <option value="En-Route">EN-ROUTE</option>
            <option value="On Scene">ON SCENE</option>
          </b-form-select>
        </b-form-group>
      </div>
      <div v-if="unitEdit.field === 'dept'">
        <b-form-group
          class="col-md-12"
          :label="`Department for ${unitEdit.id}`"
          label-for="idnumber"
        >
          <b-form-select v-model="unitEdit.data">
            <option v-for="(agency, k) in agencyLongNames" :key="k" :value="k">{{agency}}</option>
          </b-form-select>
        </b-form-group>
      </div>
      <div v-if="unitEdit.field === 'callnumber'">
        <b-form-group
          class="col-md-12"
          :label="`Assigned Call for ${unitEdit.id}`"
          label-for="idnumber"
        >
          <b-form-select v-model="unitEdit.data">
            <option value="00000000">UNASSIGNED</option>
            <option
              v-for="(call) in this.$store.getters.calls"
              :key="call.callnumber"
              :value="call.callnumber"
            >{{call.callnumber}} // {{call.type}}</option>
          </b-form-select>
        </b-form-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UnitBox from "./unitbox";
import { EventBus } from "@/EventBus";
import { agencyLongNames } from "@/utils/commondata";

export default {
  name: "Units",
  components: {
    UnitBox
  },
  data() {
    return {
      filter: "ALL",
      agencyLongNames,
      unitEdit: {
        id: null,
        identifier: null,
        field: null,
        data: null,
        show: false,
        unit: null
      }
    };
  },
  computed: {
    ...mapGetters(["units", "dispatchInitial", "calls"])
  },
  created() {
    EventBus.$on("unit-filter", msg => {
      this.filter = msg;
    });
    EventBus.$on("unit-edit", msg => {
      this.unitEdit.id = msg.identifier;
      this.unitEdit.identifier = msg.identifier;
      this.unitEdit.field = msg.field;
      this.unitEdit.show = true;
      [this.unitEdit.unit] = this.units.filter(
        u => u.session_identifier === msg.identifier
      );
      switch (this.unitEdit.field) {
        case "identifier":
          this.unitEdit.data = this.unitEdit.unit.session_identifier;
          break;
        case "dept":
          this.unitEdit.data = this.unitEdit.unit.dept.role;
          break;
        case "status":
          this.unitEdit.data = this.unitEdit.unit.status;
          break;
        case "call":
          this.unitEdit.data = this.getAssignedCall(
            this.unitEdit.unit.session_identifier
          );
          break;
        default:
          this.unitEdit.data = undefined;
          break;
      }
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
    },
    doEdit() {
      let console;
      switch (this.unitEdit.field) {
        case "identifier":
          console = `${this.unitEdit.id} I ${this.unitEdit.data.toUpperCase()}`;
          break;
        case "dept":
          console = `${this.unitEdit.id} D ${this.unitEdit.data.toUpperCase()}`;
          break;
        case "status":
          console = `${this.unitEdit.id} S ${this.unitEdit.data.toUpperCase()}`;
          break;
        case "callnumber":
          if (this.unitEdit.data === "00000000") {
            console = `${this.getAssignedCall(this.unitEdit.id)} U ${
              this.unitEdit.id
            }`;
          } else {
            console = `${this.unitEdit.data.toUpperCase()} A ${
              this.unitEdit.id
            }`;
          }
          break;
        default:
          break;
      }
      EventBus.$emit("console-override", console);
    },
    getAssignedCall(id) {
      let ret = "00000000";
      this.calls.forEach(v => {
        if (v.assigned.length > 0) {
          v.assigned.forEach(v2 => {
            if (v2 === id) {
              ret = v.callnumber;
            }
          });
        }
      });
      return ret;
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
