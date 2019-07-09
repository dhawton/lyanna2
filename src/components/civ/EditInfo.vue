<template>
  <b-row>
    <b-col md="6" offset-md="3">
      <table class="table table-info table-sm table-borderless">
        <tr>
          <td colspan="2">
            <h3>San Andreas Department of Motor Vehicles</h3>
            <b-alert
              variant="danger"
              dismissible
              v-model="showDismissibleAlert"
              @dismissed="clearError"
            >{{ error }}</b-alert>
          </td>
        </tr>
        <tr>
          <input type="hidden" id="photo" value />
          <td rowspan="7" style="width: 150px;">
            <img
              :src="
                character.photo !== null
                  ? character.photo
                  : 'https://www.synbio.cam.ac.uk/images/avatar-generic.jpg/image'
              "
              id="profilepic"
              style="width: 150px;"
              ref="pic"
            />
            <br />
            <input
              type="file"
              ref="file"
              id="newphoto"
              style="display: none;"
              @change="photoChanged"
            />
            <b-button variant="black" @click="launchFilePicker">Upload</b-button>
          </td>
          <td>
            4d
            <b class="label">LIC NO:</b>
            <b class="label">Auto Generated</b>
          </td>
        </tr>
        <tr>
          <td>
            3
            <b class="label">DOB:</b>
            <input
              type="date"
              class="form-control"
              id="dob"
              placeholder="YYYY-MM-DD"
              v-model="character.dob"
            />
          </td>
        </tr>
        <tr>
          <td>
            1
            <b class="label">Last Name</b>
            <b-form-input
              type="text"
              id="lastname"
              placeholder="Lastname"
              required
              v-model="character.lastname"
            />
          </td>
        </tr>
        <tr>
          <td>
            2
            <b class="label">First Name</b>
            <input
              type="text"
              class="form-control"
              id="firstname"
              placeholder="Firstname"
              v-model="character.firstname"
              required
            />
          </td>
        </tr>
        <tr>
          <td>
            8
            <b class="label">Address</b>
            <input
              type="text"
              class="form-control"
              id="address"
              v-model="character.address"
              required
            />
            <b class="label">City</b>
            <select id="city" v-model="character.city" class="mt-2 small-select">
              <option v-for="(city, i) in commonCities" :key="i">{{ city }}</option>
            </select>, SA
          </td>
        </tr>
        <tr>
          <td>
            15
            <b class="label">SEX:</b>
            <select v-model="character.gender" class="small-select" size="1" required>
              <option>M</option>
              <option>F</option>
            </select>
            16
            <b class="label">HGT:</b>
            <select id="height_feet" v-model="character.height_feet" class="small-select">
              <option v-for="height in [4, 5, 6]" :key="height">{{ height }}</option>
            </select>' -
            <select id="height_inches" v-model="character.height_inches" class="small-select">
              <option v-for="inches in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]" :key="inches">
                {{
                inches
                }}
              </option>
            </select>"
          </td>
        </tr>
        <tr>
          <td>
            17
            <b class="label">WGT:</b>
            <b class="label">
              <input
                type="text"
                id="weight"
                v-model="character.weight"
                class="small-select"
                size="5"
                required
              />
              lbs
            </b>
            18
            <b class="label">RCE:</b>
            <b class="label">
              <input
                type="text"
                id="race"
                v-model="character.race"
                class="small-select"
                size="15"
                required
              />
            </b>
            19
            <b class="label">HAIR:</b>
            <b class="label">
              <input
                type="text"
                id="haircolor"
                v-model="character.haircolor"
                class="small-select"
                size="15"
                required
              />
            </b>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <b-input-group class="mb-3">
              <b-form-select id="dmvlicensestatus" v-model="character.licensestatus">
                <option v-for="(status, i) in commonLicenseStatus" :key="i">{{ status }}</option>
              </b-form-select>
              <b-input-group-addon>
                <b-button v-if="!processing" variant="primary" @click="editCharacter">Save</b-button>
                <b-button v-else variant-black disabled>
                  <b-spinner small />
                </b-button>
                <b-button variant="red" @click="$router.push('/civ')">Cancel</b-button>
              </b-input-group-addon>
            </b-input-group>
          </td>
        </tr>
      </table>
    </b-col>
  </b-row>
</template>

<script>
import {
  cities as commonCities,
  licensestatus as commonLicenseStatus
} from "@/utils/commondata";
import { mapGetters } from "vuex";
import { EDIT_CHARACTER } from "../../store/queries/civ";

export default {
  name: "EditInfo",
  data() {
    return {
      processing: false,
      commonCities,
      commonLicenseStatus,
      error: undefined,
      showDismissibleAlert: false,
      hasChangedPhoto: false
    };
  },
  computed: {
    ...mapGetters(["character"])
  },
  methods: {
    launchFilePicker() {
      this.$refs.file.click();
    },
    photoChanged() {
      const reader = new FileReader();
      this.hasChangedPhoto = true;
      reader.addEventListener(
        "load",
        () => {
          this.character.photo = reader.result;
        },
        false
      );
      if (this.$refs.file.files[0]) {
        reader.readAsDataURL(this.$refs.file.files[0]);
      }
    },
    editCharacter() {
      this.processing = true;
      if (this.validForm()) {
        const variables = {
              id: this.character.id,
              firstname: this.character.firstname,
              lastname: this.character.lastname,
              address: this.character.address,
              city: this.character.city,
              gender: this.character.gender,
              race: this.character.race,
              dob: this.character.dob,
              haircolor: this.character.haircolor,
              height_feet: this.character.height_feet,
              height_inches: this.character.height_inches,
              weight: this.character.weight,
              licensestatus: this.character.licensestatus,
            };
        if (this.hasChangedPhoto) variables.photo = this.character.photo;
        this.$apollo
          .mutate({
            mutation: EDIT_CHARACTER,
            variables
          })
          .then(() => {
            this.$router.push("/civ");
          })
          .catch(err => {
            this.error = err.debugMessage;
            this.showDismissibleAlert = true;
            this.processing = false;
          });
      } else {
        this.processing = false;
      }
    },
    validForm() {
      if (this.character.firstname.length < 1) {
        this.error = "Firstname is required.";
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.character.lastname.length < 1) {
        this.error = "Last name is required.";
        this.showDismissibleAlert = true;
        return false;
      }
      if (!this.character.address.match(/^\d+ .+/)) {
        this.error =
          "Address does not meet format requirements. Please format as street address.";
        this.showDismissibleAlert = true;
        return false;
      }
      if (
        this.character.gender.toUpperCase() !== "M" &&
        this.character.gender.toUpperCase() !== "F"
      ) {
        this.error = "Invalid sex (M or F)";
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.character.race.length < 1) {
        this.error = "Invalid race";
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.character.haircolor.length < 1) {
        this.error = "Invalid hair color";
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.character.weight < 80) {
        this.error = "Invalid weight, please define in pounds.";
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.character.photo === null) {
        this.error =
          "Photos are not optional. If you need a good screenshot program, look up LightShot.";
        this.showDismissibleAlert = true;
        return false;
      }
      return true;
    },
    clearError() {
      this.error = undefined;
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
}
.btn-red {
  background-color: rgba(100, 0, 0, 1);
  color: white;
}
.btn-black:hover {
  color: lightgray;
  background-color: rgba(50, 50, 50, 0.8);
}
.btn-red:hover {
  color: lightgray;
  background-color: rgba(100, 100, 100, 1);
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
  color: #fff;
}

.label {
  color: rgba(255, 255, 255, 1);
}
</style>
