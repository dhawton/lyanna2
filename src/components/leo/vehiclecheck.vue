<template>
  <div>
    <b-form @submit.prevent="doSearch">
      <b-form-row>
        <b-form-group class="col-md-2" label="License Plate" label-for="plate">
          <b-form-input
            ref="licenseplate"
            v-on:keyup.enter="doSearch"
            id="plate"
            v-model="licenseplate"
          />
        </b-form-group>
        <b-form-group class="col-md-2" label="Make" label-for="make">
          <b-form-input v-on:keyup.enter="doSearch" id="make" v-model="make"/>
        </b-form-group>
        <b-form-group class="col-md-2" label="Model" label-for="model">
          <b-form-input v-on:keyup.enter="doSearch" id="model" v-model="model"/>
        </b-form-group>
        <b-form-group class="col-md-2" label="Color" label-for="color">
          <b-form-input v-on:keyup.enter="doSearch" id="color" v-model="color"/>
        </b-form-group>
        <b-form-group class="col-md-2" style="margin-top: auto;">
          <b-button @click="doSearch" variant="darkblue" block>Search</b-button>
        </b-form-group>
      </b-form-row>
    </b-form>
    <!-- Form results -->
    <div v-if="loadingResults" style="text-align: center;">
      <b-spinner variant="primary" style="height: 3rem; width: 3rem;"/>
    </div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>Plate</th>
          <th>Make, Model, Color</th>
          <th>Registered Owner</th>
          <th>Flags</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vehicle in results" :key="vehicle.id" @click="showVehicle(vehicle)">
          <td>{{vehicle.licenseplate}}</td>
          <td>{{vehicle.make}}, {{vehicle.model}}, {{vehicle.color}}</td>
          <td>
            {{vehicle.character.firstname}} {{vehicle.character.lastname}}
            <br>
            {{vehicle.character.address}}, {{vehicle.character.city}}, SA
          </td>
          <td>
            <b-button variant="danger" v-if="vehicle.stolen" disabled>Stolen</b-button>
            <b-button variant="warning" v-if="!vehicle.insurance" disabled>No Insurance</b-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { SEARCH_VEHICLE } from "@/store/queries/civ";

export default {
  name: "VehicleCheck",
  data() {
    return {
      loadingResults: false,
      results: undefined
    };
  },
  computed: {
    licenseplate: {
      get() {
        return this.$store.state.forms.vehiclecheck.licenseplate;
      },
      set(value) {
        this.$store.commit("forms", { vehiclecheck: { licenseplate: value } });
      }
    },
    make: {
      get() {
        return this.$store.state.forms.vehiclecheck.make;
      },
      set(value) {
        this.$store.commit("forms", { vehiclecheck: { make: value } });
      }
    },
    model: {
      get() {
        return this.$store.state.forms.vehiclecheck.model;
      },
      set(value) {
        this.$store.commit("forms", { vehiclecheck: { model: value } });
      }
    },
    color: {
      get() {
        return this.$store.state.forms.vehiclecheck.color;
      },
      set(value) {
        this.$store.commit("forms", { vehiclecheck: { color: value } });
      }
    }
  },
  created() {
    this.$nextTick(() => this.$refs.licenseplate.select());
  },
  methods: {
    doSearch() {
      document.activeElement.blur();
      this.loadingResults = true;
      this.$apollo
        .query({
          query: SEARCH_VEHICLE,
          variables: {
            licenseplate: this.licenseplate,
            make: this.make,
            model: this.model,
            color: this.color
          }
        })
        .then(r => {
          this.results = r.data.VehicleSearch;
          this.loadingResults = false;
        })
        .catch(err => {
          console.error(err);
        });
    },
    showVehicle(vehicle) {
      this.$store.commit("leovehicle", vehicle);
      this.$router.push({
        path: `/mdt/vc/${vehicle.licenseplate}`
      });
    }
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
input,
input:focus {
  background-color: rgb(0, 0, 0);
  color: #fff;
}
thead tr th {
  color: #fff;
}
tbody tr td {
  color: #fff;
}
tbody tr td:hover {
  cursor: pointer;
}
</style>
