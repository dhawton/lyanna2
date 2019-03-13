<template>
  <b-container fluid class="fill">
    <b-row class="justify-content-center vertical-center">
      <b-col col md="6">
        <table class="table table-info table-sm table-borderless">
          <tr>
            <td colspan="2">
              <h3>San Andreas Department of Motor Vehicles</h3>
              <b-alert
                variant="danger"
                dismissible
                v-model="showDismissibleAlert"
                @dismissed="clearError"
              >
                {{ error }}
              </b-alert>
            </td>
          </tr>
          <tr>
            <input type="hidden" id="photo" value />
            <td rowspan="7" style="width: 150px;">
              <img
                :src="
                  photo !== null
                    ? photo
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
                v-model="dob"
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
                v-model="lastname"
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
                v-model="firstname"
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              8
              <b class="label">Address</b>
              <input type="text" class="form-control" id="address" v-model="address" required />
              <b class="label">City</b>
              <select id="city" v-model="city" class="mt-2 small-select">
                <option v-for="(city, i) in commonCities" :key="i">{{ city }}</option> </select
              >, SA
            </td>
          </tr>
          <tr>
            <td>
              15
              <b class="label">SEX:</b>
              <input
                type="text"
                id="gender"
                v-model="gender"
                class="small-select"
                size="1"
                maxsize="1"
                required
              />
              16
              <b class="label">HGT:</b>
              <select id="height_feet" v-model="height_feet" class="small-select">
                <option v-for="height in [4, 5, 6]" :key="height">{{ height }}</option> </select
              >' -
              <select id="height_inches" v-model="height_inches" class="small-select">
                <option v-for="inches in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]" :key="inches">{{
                  inches
                }}</option> </select
              >"
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
                  v-model="weight"
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
                  v-model="race"
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
                  v-model="haircolor"
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
                <b-form-select id="dmvlicensestatus" v-model="licensestatus">
                  <option v-for="(status, i) in commonLicenseStatus" :key="i">{{ status }}</option>
                </b-form-select>
                <b-input-group-addon>
                  <b-button v-if="!processing" variant="black" @click="createCharacter"
                    >Create</b-button
                  >
                  <b-button v-else variant-black disabled><b-spinner small/></b-button>
                  <b-button variant="red" @click="$router.push('/login/characters')"
                    >Cancel</b-button
                  >
                </b-input-group-addon>
              </b-input-group>
            </td>
          </tr>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { cities as commonCities, licensestatus as commonLicenseStatus } from '@/utils/commondata';
import { CREATE_CHARACTER } from '@/store/queries/civ';

export default {
  name: 'NewCharacter',
  data() {
    return {
      processing: false,
      firstname: '',
      lastname: '',
      address: '',
      city: 'Los Santos',
      gender: '',
      race: '',
      dob: new Date().toDateString(),
      haircolor: '',
      height_feet: 5,
      height_inches: 0,
      weight: 0,
      photo: null,
      licensestatus: 'Valid',
      commonCities,
      commonLicenseStatus,
      error: undefined,
      showDismissibleAlert: false
    };
  },
  methods: {
    launchFilePicker() {
      this.$refs.file.click();
    },
    photoChanged() {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          this.photo = reader.result;
        },
        false
      );
      if (this.$refs.file.files[0]) {
        reader.readAsDataURL(this.$refs.file.files[0]);
      }
    },
    createCharacter() {
      this.processing = true;
      if (this.validForm()) {
        this.$apollo
          .mutate({
            mutation: CREATE_CHARACTER,
            variables: {
              firstname: this.firstname,
              lastname: this.lastname,
              address: this.address,
              city: this.city,
              gender: this.gender,
              race: this.race,
              dob: this.dob,
              haircolor: this.haircolor,
              height_feet: this.height_feet,
              height_inches: this.height_inches,
              weight: this.weight,
              licensestatus: this.licensestatus,
              photo: this.photo
            }
          })
          .then(() => {
            this.$router.push('/login/characters');
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
      if (this.firstname.length < 1) {
        this.error = 'Firstname is required.';
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.lastname.length < 1) {
        this.error = 'Last name is required.';
        this.showDismissibleAlert = true;
        return false;
      }
      if (!this.address.match(/^\d+ .+/)) {
        this.error = 'Address does not meet format requirements. Please format as street address.';
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.gender.toUpperCase() !== 'M' && this.gender.toUpperCase() !== 'F') {
        this.error = 'Invalid sex (M or F)';
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.race.length < 1) {
        this.error = 'Invalid race';
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.haircolor.length < 1) {
        this.error = 'Invalid hair color';
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.weight < 80) {
        this.error = 'Invalid weight, please define in pounds.';
        this.showDismissibleAlert = true;
        return false;
      }
      if (this.photo === null) {
        this.error =
          'Photos are not optional. If you need a good screenshot program, look up LightShot.';
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
  background-color: rgba(68, 76, 87, 0.8);
  color: white;
}

.label {
  color: rgba(200, 200, 200, 1);
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
</style>
