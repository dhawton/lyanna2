<template>
  <div>
    <b-alert variant="danger" dismissible v-model="showDismissibleAlert" @dismissed="clearError">
      {{
      error
      }}
    </b-alert>

    <b-form-group
      label-cols-sm="4"
      label-cols-lg="3"
      label="License Plate"
      label-for="licenseplate"
      label-align="right"
    >
      <b-form-input id="licenseplate" type="text" readonly v-model="vehicleInfo.licenseplate" />
    </b-form-group>
    <b-form-group
      label-cols-sm="4"
      label-cols-lg="3"
      label="Make"
      label-for="make"
      label-align="right"
    >
      <b-form-input id="make" type="text" v-model="vehicleInfo.make" />
    </b-form-group>
    <b-form-group
      label-cols-sm="4"
      label-cols-lg="3"
      label="Model"
      label-for="model"
      label-align="right"
    >
      <b-form-input id="model" type="text" v-model="vehicleInfo.model" />
    </b-form-group>
    <b-form-group
      label-cols-sm="4"
      label-cols-lg="3"
      label="Color"
      label-for="color"
      label-align="right"
    >
      <b-form-input id="color" type="text" v-model="vehicleInfo.color" />
    </b-form-group>
    <b-form-group
      label-cols-sm="4"
      label-cols-lg="3"
      label="Has Insurance?"
      label-for="insurance"
      label-align="right"
    >
      <b-form-checkbox switch id="insurance" v-model="vehicleInfo.insurance" />
    </b-form-group>
    <b-form-group
      label-cols-sm="4"
      label-cols-lg="3"
      label="Stolen?"
      label-for="stolen"
      label-align="right"
    >
      <b-form-checkbox switch id="stolen" v-model="vehicleInfo.stolen" />
    </b-form-group>
    <b-button variant="black" @click="saveCar">Save</b-button>
    <b-button variant="red" @click="cancelCar" class="ml-1">Cancel</b-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { EDIT_VEHICLE } from "@/store/queries/civ";

export default {
  name: "EditCar",
  data() {
    return {
      processing: false,
      vehicleInfo: {
        id: 0,
        licenseplate: "",
        oldlicenseplate: "0",
        make: "",
        model: "",
        color: "",
        insurance: true,
        stolen: false
      },
      showDismissibleAlert: false,
      error: ""
    };
  },
  props: {
    vehicle: {
      default: {}
    }
  },
  computed: {
    ...mapGetters(["character"])
  },
  created() {
    // If we're editing a car, merge the objects together
    // if it's new, there will be nothing to overright
    this.vehicleInfo = { ...this.vehicleInfo, ...this.vehicle };
    this.vehicleInfo.oldlicenseplate =
      this.vehicle.licenseplate || this.vehicleInfo.oldlicenseplate;
  },
  methods: {
    saveCar() {
      this.processing = true;
      this.$apollo
        .mutate({
          mutation: EDIT_VEHICLE,
          variables: {
            oldlicenseplate: this.vehicleInfo.oldlicenseplate
              .replace(" ", "")
              .toUpperCase(),
            licenseplate: this.vehicleInfo.licenseplate
              .replace(" ", "")
              .toUpperCase(),
            make: this.vehicleInfo.make,
            model: this.vehicleInfo.model,
            color: this.vehicleInfo.color,
            insurance: this.vehicleInfo.insurance,
            stolen: this.vehicleInfo.stolen,
            character_id: this.character.id
          }
        })
        .then(r => {
          if (r.errors) {
            this.error = r.errors[0].debugMessage;
            this.showDismissibleAlert = true;
          } else {
            this.processing = false;
            this.$emit("done-edit");
          }
        })
        .catch(err => {
          this.showDismissibleAlert = true;
          this.error = err.debugMessage;
          console.dir(err);
        });
    },
    cancelCar() {
      this.$emit("done-edit");
    },
    clearError() {
      this.showDismissibleAlert = false;
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
