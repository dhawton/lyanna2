<template>
  <div>
    <div v-if="processing" style="text-align: center;">
      <b-spinner variant="primary" style="height: 3rem; width: 3rem;"/>
    </div>
    <div v-if="!processing">
      <b-form @submit.prevent="doSearch">
        <b-form-row>
          <b-form-group class="col-md-1" label="Unit Prefix" label-for="plate">
            <b-select v-model="prefix">
              <option value selected>&nbsp;</option>
              <option v-for="p in unitPrefixes" :key="p">{{ p }}</option>
            </b-select>
          </b-form-group>
          <b-form-group class="col-md-1" label="Identifier" label-for="plate">
            <b-form-input v-model="identifier"/>
          </b-form-group>
          <b-form-group class="col-md-8" label="Department" label-for="make">
            <b-select v-model="dept" @change="checkPrefix">
              <option value="highway">San Andreas State Police</option>
              <option value="sheriff">Blaine County Sheriff's Office</option>
              <option value="police">Los Santos Police Department</option>
              <option
                value="intel"
                v-if="hasRole('intel')"
                @change="checkPrefix"
              >San Andreas Department of Intelligence</option>
            </b-select>
          </b-form-group>
          <b-form-group class="col-md-2" style="margin-top: auto;">
            <b-button @click="doChange" variant="darkblue" block>Change</b-button>
          </b-form-group>
        </b-form-row>
      </b-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { unitPrefixes } from "@/utils/commondata";
import { CHANGE_SIGNON } from "@/store/queries/user";

export default {
  name: "LEOChangeDept",
  data() {
    return {
      unitPrefixes,
      prefix: "",
      dept: "",
      identifier: "",
      processing: false
    };
  },
  computed: {
    ...mapGetters(["department", "me", "server", "signon", "roles"])
  },
  methods: {
    hasRole(role) {
      let has = false;
      this.roles.forEach(v => {
        if (v === role) has = true;
      });
      return has;
    },
    doChange() {
      this.$apollo
        .mutate({
          mutation: CHANGE_SIGNON,
          variables: {
            identifier: this.signon.identifier,
            new_identifier: this.prefix + this.identifier,
            dept: this.dept
          }
        })
        .then(() => {
          this.$router.push("/mdt");
        });
    },
    checkPrefix() {
      if (this.dept === "intel") {
        this.prefix = "I";
      }
    }
  },
  created() {
    this.identifier = this.$store.state.identifier;
    this.dept = this.department.role;
    this.prefix = this.signon.session_identifier.replace(this.identifier, "");
  }
};
</script>

<style scoped>
.btn-darkblue {
  background-color: rgb(0, 0, 40);
  color: #fff;
  border: 1px solid rgb(0, 0, 255);
}
.btn-darkblue:hover {
  background-color: rgb(0, 0, 100);
  color: #fff;
}
</style>
