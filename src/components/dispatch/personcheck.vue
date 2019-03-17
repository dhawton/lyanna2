<template>
  <div>
    <b-form @submit.prevent="doSearch">
      <b-form-row>
        <b-form-group class="col-md-2" label="ID Number" label-for="idnumber">
          <b-form-input v-on:keyup.enter="doSearch" v-model="idnumber"/>
        </b-form-group>
        <b-form-group class="col-md-2" label="First Name" label-for="firstname">
          <b-form-input ref="firstname" v-on:keyup.enter="doSearch" v-model="firstname"/>
        </b-form-group>
        <b-form-group class="col-md-2" label="Last Name" label-for="lastname">
          <b-form-input v-on:keyup.enter="doSearch" v-model="lastname"/>
        </b-form-group>
        <b-form-group class="col-md-2" label="Date of Birth" label-for="dob">
          <b-form-input v-on:keyup.enter="doSearch" type="date" v-model="dob"/>
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
          <th style="width: 150px;">Photo</th>
          <th>ID Number</th>
          <th>Name and Flags</th>
          <th>Address</th>
          <th>License Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="character in results" :key="character.id" @click="showCharacter(character)">
          <td>
            <img
              :src="
                character.photo || 'https://www.synbio.cam.ac.uk/images/avatar-generic.jpg/image'
              "
              alt="Character Photo"
              style="max-height: 150px; max-width: 150px;"
            >
          </td>
          <td>{{ character.idnumber }}</td>
          <td>
            {{ character.firstname }} {{ character.lastname }}
            <br>
            <Flags :documents="character.documents" tiny="true"/>
          </td>
          <td>
            {{ character.address }}
            <br>
            {{ character.city }}, SA
          </td>
          <td>{{ character.licensestatus }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { SEARCH_CHARACTERS } from "@/store/queries/civ";
import Flags from "@/components/shared/Flags";

export default {
  name: "PersonCheck",
  components: {
    Flags
  },
  data() {
    return {
      loadingResults: false,
      results: undefined
    };
  },
  computed: {
    idnumber: {
      get() {
        return this.$store.state.forms.personcheck.idnumber;
      },
      set(value) {
        this.$store.commit("forms", { personcheck: { idnumber: value } });
      }
    },
    firstname: {
      get() {
        return this.$store.state.forms.personcheck.firstname;
      },
      set(value) {
        this.$store.commit("forms", { personcheck: { firstname: value } });
      }
    },
    lastname: {
      get() {
        return this.$store.state.forms.personcheck.lastname;
      },
      set(value) {
        this.$store.commit("forms", { personcheck: { lastname: value } });
      }
    },
    dob: {
      get() {
        return this.$store.state.forms.personcheck.dob;
      },
      set(value) {
        this.$store.commit("forms", { personcheck: { dob: value } });
      }
    }
  },
  created() {
    // Set focus on firstname input on component creation
    this.$nextTick(() => this.$refs.firstname.select());
    if (
      this.idnumber !== null ||
      this.firstname !== null ||
      this.lastname !== null ||
      this.dob !== null
    ) {
      this.doSearch();
    }
  },
  methods: {
    doSearch() {
      this.loadingResults = true;
      this.$apollo
        .query({
          query: SEARCH_CHARACTERS,
          variables: {
            idnumber: this.idnumber,
            firstname: this.firstname,
            lastname: this.lastname,
            dob: this.dob
          }
        })
        .then(r => {
          this.results = r.data.CharacterSearch;
          this.loadingResults = false;
        })
        .catch(err => {
          console.error(err);
        });
    },
    showCharacter(character) {
      this.$store.commit("leocharacter", character);
      this.$router.push({
        path: `/cad/pc/${character.idnumber}`
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
  background-color: rgb(0, 0, 40);
  color: #fff;
  border: 1px solid rgb(0, 0, 150);
  text-transform: uppercase;
}
thead tr th,
tbody tr td {
  border-color: rgb(0, 45, 112);
  color: rgb(206, 222, 255);
  text-transform: uppercase;
}
tbody tr td:hover {
  cursor: pointer;
}
.btn {
  text-transform: uppercase;
  padding: 5px;
}
.btn.disabled,
.btn:disabled {
  opacity: unset;
}
.btn-yellow,
.btn-yellow:disabled,
.btn-yellow.disabled {
  background-color: rgb(255, 255, 0);
}
</style>
