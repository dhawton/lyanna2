<template>
  <b-row>
    <b-col md="3">
      <Flags :documents="documents" />
    </b-col>
    <b-col md="5">
      <table class="table table-info table-sm table-borderless">
        <tr>
          <td colspan="2">
            <h3>San Andreas Department of Motor Vehicles</h3>
          </td>
        </tr>
        <tr>
          <td rowspan="6" style="width: 150px; text-align: center;">
            <img
              :src="(character.photo !== null) ? character.photo : 'https://www.synbio.cam.ac.uk/images/avatar-generic.jpg/image'"
              id="profilepic"
              style="width: 150px;"
              ref="pic"
            >
            <br>
            <h2
              v-if="character.licensestatus != 'Valid'"
              class="label"
            >{{ character.licensestatus }}</h2>
          </td>
          <td>
            4d
            <b class="label">LIC NO:</b>
            {{ character.idnumber }}
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b class="label">Status:</b>
            {{ character.licensestatus }}
          </td>
        </tr>
        <tr>
          <td>
            3
            <b class="label">DOB:</b>
            {{ character.dob }}
          </td>
        </tr>
        <tr>
          <td>
            1
            <b class="label">Last Name</b>
            {{ character.lastname }}
          </td>
        </tr>
        <tr>
          <td>
            2
            <b class="label">First Name</b>
            {{ character.firstname }}
          </td>
        </tr>
        <tr>
          <td>
            8
            <b class="label">Address</b>
            {{ character.address }}
            <br>
            {{ character.city }}, SA
          </td>
        </tr>
        <tr>
          <td>
            15
            <b class="label">SEX:</b>
            {{ character.gender }} 16
            <b class="label">HGT:</b>
            {{character.height_feet}}' {{character.height_inches}}"
          </td>
        </tr>
        <tr>
          <td class="signature">{{character.firstname}} {{character.lastname}}</td>
          <td>
            17
            <b class="label">WGT:</b>
            {{ character.weight }} lbs
            18
            <b class="label">RCE:</b>
            {{ character.race }}
            19
            <b class="label">HAIR:</b>
            {{ character.haircolor }}
          </td>
        </tr>
        <tr v-if="showedit">
          <td colspan="2" style="padding-left: 10px; padding-right: 10px;">
            <b-input-group>
              <b-form-select id="dmvlicensestatus" v-model="licensestatus">
                <option v-for="(status, i) in commonLicenseStatus" :key="i">{{status}}</option>
              </b-form-select>
              <b-input-group-addon>
                <b-button v-if="!processing" variant="black" @click="edit">Change</b-button>
                <b-button v-else variant="black" disabled>
                  <b-spinner small/>
                </b-button>
                <b-button variant="grey" @click="editInfo">Edit Info</b-button>
              </b-input-group-addon>
            </b-input-group>
          </td>
        </tr>
      </table>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
import Flags from "./Flags";
import { licensestatus as commonLicenseStatus } from "@/utils/commondata";
import { EDIT_CHARACTER } from "@/store/queries/civ";

export default {
  name: "License",
  components: {
    Flags
  },
  data() {
    return {
      processing: false,
      licensestatus: "Valid",
      commonLicenseStatus
    };
  },
  props: {
    showedit: {
      type: Boolean,
      default: false
    },
    documents: {
      default: undefined
    },
  },
  computed: {
    ...mapGetters(["character"])
  },
  created() {
    this.licensestatus = this.character.licensestatus;
  },
  methods: {
    edit() {
      this.processing = true;
      this.$apollo
        .mutate({
          mutation: EDIT_CHARACTER,
          variables: {
            id: this.character.id,
            licensestatus: this.licensestatus
          }
        })
        .then(r => {
          this.$store.commit("character", r.data.editCharacter);
          this.processing = false;
        })
        .catch(err => {
          console.error(err);
          this.processing = false;
        });
    },
    editInfo() {
      this.$router.push("/civ/edit");
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-black {
  background-color: rgba(0, 0, 0, 1);
  color: white;
}
.btn-grey {
  background-color: rgba(30, 30, 30, 1);
  color: white;
}
.btn-black:hover {
  color: lightgray;
  background-color: rgba(50, 50, 50, 1);
}
.btn-grey:hover {
  color: lightgray;
  background-color: rgba(50, 50, 50, 1);
}
.table-info {
  background-color: rgb(200, 200, 200);
  color: black;
}
table tr:first-child td {
  padding-top: 15px;
}
table tr:first-child td:first-child,
table tr:nth-child(2) td:first-child {
  padding-left: 15px;
}
table tr td:last-child {
  padding-right: 15px;
}
table tr:last-child td {
  padding-bottom: 15px;
}
table {
  border-collapse: collapse;
  border-radius: 10px;
  border-style: hidden; /* hide standard table (collapsed) border */
  box-shadow: 0 0 0 1px #000000; /* this draws the table border  */
  background: url("../../assets/licensebg.png");
  background-size: cover;
}

td {
  border: 1px solid #ccc;
}

.label {
  color: rgba(200, 0, 0, 1);
}

.small-select {
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.375rem 0.375rem 0.375rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  vertical-align: middle;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
.signature {
  font-family: "Homemade Apple", cursive;
  text-align: center;
  font-size: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
}
</style>
