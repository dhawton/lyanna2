<template>
  <b-container fluid class="fill">
    <b-row class="justify-content-center vertical-center">
      <b-col col md="6">
        <b-card header="San Andreas Fire Department">
          <b-row>
            <b-col md="6">
              <div class="form-row">
                <b-form-group class="col-md-12" label="Station" label-for="idnumber">
                  <b-select v-model="station" @change="apparatus = null; company = null;">
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
                    :disabled="station === null"
                    @change="company = null;"
                  >
                    <option
                      v-for="(c, i) in stationcompanies"
                      :key="i"
                      :value="c"
                    >{{ firefullname[c] }}</option>
                  </b-select>
                </b-form-group>
                <b-form-group class="col-md-4" label="Company" label-for="idnumber">
                  <b-select v-model="company" :disabled="apparatus === null">
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
                >Login</b-button>
                <p>
                  <b>Identifier:</b>
                  <br />
                  {{ fireunitid[apparatus] || '&nbsp;' }}{{company}}
                </p>
                <p>
                  <b>Radio Identifier:</b>
                  <br />
                  {{fireunitradio[apparatus] || '&nbsp;'}} {{company}}
                </p>
              </div>
            </b-col>
            <b-col md="6">
              <p>Units</p>
              <b-spinner v-if="!hasUnits" />
              <p v-if="units.length === 0">None.</p>
              <p v-for="u in units" :key="u.id">{{u.session_identifier}} - {{u.session_name}}</p>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <div
      style="border: 1px solid black; border-radius: 99px; position: absolute; width: 200px; bottom: 5px; right: 5px;"
    >
      <img src="../../assets/logo.png" style="width: 198px;" />
    </div>
  </b-container>
</template>

<script>
import {
  fire,
  fireunitid,
  fireunitradio,
  firefullname
} from "../../utils/commondata";
import { GET_USERS } from "../../store/queries/misc";
import { SIGNON } from "../../store/queries/user";

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
  created() {
    this.$apollo
      .query({
        query: GET_USERS,
        variables: {
          id: this.$store.getters.server.id
        }
      })
      .then(r => {
        this.units = r.data.server.signedons
          .filter(u => u.department.role === "fire")
          .filter(u => u.identifier !== this.$store.getters.me.identifier)
          .sort((a, b) => (a.session_identifier < b.session_identifier ? 1 : -1));
        this.hasUnits = true;
      });
  },
  methods: {
    login() {
      this.$apollo
        .mutate({
          mutation: SIGNON,
          variables: {
            identifier: this.$store.getters.me.identifier,
            department: this.$store.getters.department.id,
            server: this.$store.getters.server.id,
            character_id: this.$store.getters.character.id,
            session_identifier: `${fireunitid[this.apparatus]}${this.company}`
          }
        })
        .then(r => {
          r.data.signon.id = parseInt(r.data.signon.id, 10);
          this.$store.commit("fire", {
            station: this.station,
            apparatus: this.apparatus,
            company: this.company,
            id: `${fireunitid[this.apparatus]}${this.company}`,
            radio: `${fireunitradio[this.apparatus]} ${this.company}`
          });
          this.$store.commit("signon", r.data.signon);
          this.$router.push({ path: "/fire" });
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
.card-header {
  background-color: rgb(40, 44, 44);
  color: white;
}
.card {
  border: 0;
  background-color: rgba(255, 255, 255, 0.85);
}
.card-body {
  color: black;
}

.btn-black {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  margin-bottom: 1rem;
}

.btn-black:hover {
  color: lightgray;
  background-color: rgba(50, 50, 50, 0.8);
}

.list-group {
  max-height: 300px;
  margin-bottom: 10px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
