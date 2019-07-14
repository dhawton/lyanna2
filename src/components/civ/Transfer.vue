<template>
  <div>
    <h1>DMV Title Transfer</h1>
    <p>Transferring the title of {{vehicle.color}} {{vehicle.make}} {{vehicle.model}}, SA/{{vehicle.plate}} to:</p>
    <b-form-select v-model="character" class="mb-3">
      <option
        v-for="c in characters"
        :key="c.idnumber"
        :value="c.idnumber"
      >{{c.idnumber}} - {{c.firstname}} {{c.lastname}}</option>
    </b-form-select>
    <p>Or:</p>
    <b-form-group
      id="fieldset-horizontal"
      label-cols-sm="2"
      label-cols-lg="2"
      description="Driver License Number"
      label="DL Number:"
      label-for="input-horizontal"
    >
      <b-form-input id="input-horizontal"></b-form-input>
    </b-form-group>
    <b-button variant="black" @click="transfer">Transfer</b-button>
    <b-button variant="red" @click="cancel">Cancel</b-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import { EDIT_VEHICLE } from "@/store/queries/civ";

export default {
  name: "DMVTransfer",
  data() {
return {
    character: null
  };
},
  computed: {
    ...mapGetters(["dmvVehicle", "characters"])
  },
  created() {
    this.character = this.$store.getters("character").idnumber;
  },
  methods: {
    transfer() {
      // /civ/dmv

    }
  }
};
</script>

<style>
</style>
