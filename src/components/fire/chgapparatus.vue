<template>
  <b-row>
    <b-col md="6">
      <div class="form-row">
        <b-form-group class="col-md-12" label="Station" label-for="idnumber">
          <b-select
            v-model="station"
            class="border-red bg-fire"
            @change="apparatus = null; company = null;"
          >
            <option
              v-for="s in fire"
              :key="s.station"
              :value="s"
              :disabled="s.closed === true"
            >Station {{s.station}} - {{ s.name }}{{ (s.closed) ? " [Closed]" : '' }}</option>
          </b-select>
        </b-form-group>
      </div>
      <div class="form-row">
        <b-form-group class="col-md-8" label="Apparatus" label-for="idnumber">
          <b-select
            v-model="apparatus"
            class="border-red bg-fire"
            :disabled="station === null"
            @change="company = null;"
          >
            <option v-for="(c, i) in stationcompanies" :key="i" :value="c">{{ firefullname[c] }}</option>
          </b-select>
        </b-form-group>
        <b-form-group class="col-md-4" label="Company" label-for="idnumber">
          <b-select v-model="company" class="border-red bg-fire" :disabled="apparatus === null">
            <option v-for="(c) in availablecompanies" :key="c" :value="c">{{c}}</option>
          </b-select>
        </b-form-group>
      </div>

      <div>
        <b-button
          variant="black"
          style="float: right"
          @click="login"
          :disabled="company === null"
        >Change</b-button>
        <p>
          <b>Identifier:</b>
          <br>
          {{ fireunitid[apparatus] || '&nbsp;' }}{{company}}
        </p>
        <p>
          <b>Radio Identifier:</b>
          <br>
          {{fireunitradio[apparatus] || '&nbsp;'}} {{company}}
        </p>
      </div>
    </b-col>
    <b-col md="6">
      <p>Units</p>
      <p v-if="fireunits.length === 0">None.</p>
      <p v-for="u in fireunits" :key="u.id">{{u.session_identifier}} - {{u.session_name}}</p>
    </b-col>
  </b-row>
</template>

<script>
import {
  fire,
  fireunitid,
  fireunitradio,
  firefullname
} from "../../utils/commondata";
import { CHANGE_SIGNON } from "@/store/queries/user";

export default {
  name: "LoginFire",
  data() {
    return {
      fire,
      fireunitid,
      fireunitradio,
      firefullname,
      hasUnits: false,
      units: [],
      station: null,
      apparatus: null,
      company: null
    };
  },
  computed: {
    fireunits: {
      get() {
        console.dir(this.$store.getters.units);
        return this.$store.getters.units.filter(u => u.dept.role === "fire");
      }
    },
    stationcompanies: {
      get() {
        const a = [];
        if (this.station === null) return [];
        Object.keys(this.station.companies).forEach(k => {
          if (this.station.companies[k] !== null) a.push(k);
        });
        return a;
      }
    },
    availablecompanies: {
      get() {
        if (this.apparatus === null) return [];
        const a = [];
        const app = this.station.companies[this.apparatus];
        app.forEach(v => {
          const i = this.units.filter(
            u => u.session_identifier === `${this.fireunitid[this.apparatus]}${v}`
          );
          if (i.length === 0) a.push(v);
        });

        return a;
      }
    }
  },
  created() {},
  methods: {
    login() {
      this.$apollo
        .mutate({
          mutation: CHANGE_SIGNON,
          variables: {
            id: this.$store.getters.signon.id,
            identifier: `${this.fireunitid[this.apparatus]}${this.company}`,
            dept: "fire"
          }
        })
        .then(() => {
          this.$store.commit("fire", {
            station: this.station,
            apparatus: this.apparatus,
            company: this.company,
            id: `${fireunitid[this.apparatus]}${this.company}`,
            radio: `${fireunitradio[this.apparatus]} ${this.company}`
          });
          this.$router.push("/fire");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.fill {
  min-height: 100%;
  height: 100%;
}
.vertical-center {
  min-height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.btn-black {
  background-color: rgba(70, 0, 0, 1);
  color: white;
  margin-bottom: 1rem;
}

.btn-black:hover {
  color: lightgray;
  background-color: rgba(150, 50, 50, 1);
}

.list-group {
  max-height: 300px;
  margin-bottom: 10px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.border-red {
  border: 1px solid rgb(150, 0, 0);
}

.bg-fire {
  background-color: rgb(30, 0, 0) !important;
  color: #fff;
}
</style>
