<template>
  <div>
    <License v-if="!showEdit" :showedit="true" />
    <b-row v-if="!showEdit">
      <b-col md="12">
        <table v-if="prepared" class="table table-striped">
          <thead>
            <tr>
              <th>License Plate</th>
              <th>Make, Model, Color</th>
              <th>Flags</th>
              <th>Actions <b-button variant="grey" style="float:right" @click="edit({})">Register</b-button></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vehicle in vehicles" :key="vehicle.id">
              <td>{{ vehicle.licenseplate }}</td>
              <td>{{ vehicle.make }}, {{ vehicle.model }}, {{ vehicle.color }}</td>
              <td>
                <b-button variant="danger" v-if="!vehicle.insurance">Not Insured</b-button>
                <b-button variant="danger" v-if="vehicle.stolen">Stolen</b-button>
                <span v-if="vehicle.insurance && !vehicle.stolen">None</span>
              </td>
              <td>
                <b-button variant="black" class="mr-1" @click="edit(vehicle)">Edit</b-button>
                <b-button v-if="delProcessing" variant="black" disabled>
                  <b-spinner small/>
                </b-button>
                <b-button v-if="!delProcessing" variant="red" @click="del(vehicle)">Delete</b-button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!prepared" class="text-center">
          <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"/>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="showEdit">
      <b-col md="6" offset-md="3">
        <EditCar v-bind:vehicle="this.vehicle" @done-edit="doneEdit()" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import License from "@/components/shared/License";
import EditCar from "@/components/civ/EditCar";
import { mapGetters } from 'vuex';
import { GET_CHARACTER_VEHICLES, DELETE_VEHICLE } from '../../store/queries/civ';

export default {
  name: "CivDMV",
  components: {
    License,
    EditCar
  },
  data() {
    return {
      prepared: false,
      vehicles: [],
      showEdit: false,
      vehicle: {},
      delProcessing: false
    };
  },
  computed: {
    ...mapGetters(['character'])
  },
  created() {
    this.$apollo.query({
        query: GET_CHARACTER_VEHICLES,
        variables: {
          id: this.character.id
        }
      }).then((r) => {
        this.vehicles = r.data.Character.vehicles;
        this.prepared = true;
      }).catch((err) => {
        console.error(err);
      });
  },
  methods: {
    edit(vehicle) {
      this.showEdit = true;
      this.vehicle = vehicle;
    },
    del(vehicle) {
      this.delProcessing = true;
      this.$apollo.mutate({
        mutation: DELETE_VEHICLE,
        variables: {
          licenseplate: vehicle.licenseplate
        }
      }).then((r) => {
        this.delProcessing = false;
        this.vehicles = this.vehicles.filter(v => v.id !== r.data.deleteVehicle.id);
      }).catch((err) => {
        console.error(err);
      });
    },
    doneEdit() {
      this.showEdit = false;
      this.vehicle = {};
      this.prepared = false;
      this.$apollo.query({
        query: GET_CHARACTER_VEHICLES,
        variables: {
          id: this.character.id
        }
      }).then((r) => {
        this.vehicles = r.data.Character.vehicles;
        this.prepared = true;
      }).catch((err) => {
        console.error(err);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-black {
  background-color: rgba(0, 0, 0, 1);
  color: white;
  &:hover {
    background-color: rgb(50, 50, 50);
    color: lightgray;
  }
}
.btn-grey {
  background-color: rgba(50, 50, 50, 1);
  color: white;
  &:hover {
    background-color: rgba(30, 30, 30, 1);
  }
}
.btn-red {
  background-color: rgba(100, 0, 0, 1);
  color: white;
  &:hover {
    color: lightgray;
    background-color: rgba(10, 0, 0, 1);
  }
}
</style>
