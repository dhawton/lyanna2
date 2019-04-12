<template>
  <b-row>
    <b-col md="3">
      <Flags :documents="documents"/>
    </b-col>
    <b-col md="5">
      <table
        class="table table-info table-sm table-borderless licensetable licensebg2"
        style="color: #000 !important;"
      >
        <tr>
          <td rowspan="2" style="width: 100px; text-align: center; padding: 0;">
            <img
              :src="
                character.photo !== null
                  ? `${character.photo}?v=${ new Date().getTime() }`
                  : 'https://www.synbio.cam.ac.uk/images/avatar-generic.jpg/image'
              "
              id="profilepic"
              style="width: 140px;"
              ref="pic"
            >
            <br>
            <h2
              v-if="character.licensestatus != 'Valid'"
              class="label"
            >{{ character.licensestatus }}</h2>
            <span class="signature">{{ character.firstname }} {{ character.lastname }}</span>
          </td>
          <td style="text-align: right;" class="licensebg">
            <h1>San Andreas</h1>
            <br>
            <span>
              {{ licenseType }}
              <br>
              <b>{{ character.idnumber}}</b>
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 0;">
            <table
              border="0"
              style="background: unset; color: #000; border: 0 !important; width: 100%;"
            >
              <tr>
                <td>
                  <b class="label">DATE OF BIRTH</b>
                  <br>
                  {{ character.dob }}
                </td>
                <td>
                  <b class="label">SEX</b>
                  <br>
                  {{ character.gender }}
                </td>
                <td>
                  <b class="label">HEIGHT</b>
                  <br>
                  {{ character.height_feet }}-{{ character.height_inches}}
                </td>
                <td>
                  <b class="label">WEIGHT</b>
                  <br>
                  {{ character.weight}}
                </td>
                <td>
                  <b class="label">HAIR</b>
                  <br>
                  {{ character.haircolor }}
                </td>
              </tr>
              <tr>
                <td>
                  {{ character.firstname }} {{ character.lastname }}
                  <br>
                  {{ character.address }}
                  <br>
                  {{ character.city }}, SA
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr v-if="showedit">
          <td colspan="2" style="padding-left: 10px; padding-right: 10px;">
            <b-input-group>
              <b-form-select id="dmvlicensestatus" v-model="licensestatus">
                <option v-for="(status, i) in commonLicenseStatus" :key="i">{{ status }}</option>
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
    character: {
      default: undefined
    }
  },
  computed: {
    licenseType() {
      if (this.licensestatus === "Learner's Permit") return this.licensestatus;
      if (this.licensestatus === "ID Card") return "ID Card";
      return "Driver License";
    }
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
table.licensetable {
  border-collapse: collapse;
  /*   border-radius: 10px; */
  border-style: hidden; /* hide standard table (collapsed) border */
  border-color: unset !important;
  box-shadow: 0 0 0 1px #000000; /* this draws the table border  */
  background-color: #fff;
}

.licensebg {
  background: url("../../assets/licensebg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom left;
  border-bottom: 1px solid darkblue;
}
.licensebg2 {
  background: url("../../assets/licensebg2.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom left;
}

.label {
  color: rgb(0, 20, 200);
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
