<template>
  <div>
    <div v-if="processing" style="text-align: center;">
      <b-spinner variant="primary" style="height: 3rem; width: 3rem;"/>
    </div>
    <div v-if="!processing">
      <b-form @submit.prevent="doSearch">
        <b-form-row>
          <b-form-group class="col-md-2" label="Identifier" label-for="plate">
            <b-form-input v-model="identifier"/>
          </b-form-group>
          <b-form-group class="col-md-10" label="Department" label-for="make">
            <b-select v-model="dept" @change="checkPrefix">
              <option v-for="(agency, k) in agencyLongNames" :key="k" :value="k">{{ agency }}</option>
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
import { unitPrefixes, agencyLongNames } from "@/utils/commondata";
import { CHANGE_SIGNON } from "@/store/queries/user";

export default {
  name: "LEOChangeDept",
  data() {
    return {
      unitPrefixes,
      prefix: "",
      dept: "",
      identifier: "",
      processing: false,
      agencyLongNames
    };
  },
  computed: {
    ...mapGetters(["department", "me", "server", "signon", "roles"]),
    deptIdentifier() {
      if (
        this.dept === "intel" ||
        this.dept === "highway" ||
        this.dept === "state"
      ) {
        return 1;
      }
      if (this.dept === "sheriff") return 5;
      return 3;
    },
    ident() {
      return `${this.deptIdentifier}-${this.prefix}`;
    }
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
            new_identifier: this.identifier,
            dept: this.dept
          }
        })
        .then(() => {
          this.$router.push("/mdt");
        });
    },
    checkPrefix() {
      let ident = this.signon.identifier;
      if (!/^\d+$/.test(ident)) {
        ident = ident.substring(1);
        this.prefix = this.signon.identifier.substring(0, 1);
      } else {
        this.prefix = this.signon.session_identifier.substring(2, 3);
      }
      this.identifier = `${this.deptIdentifier}${this.prefix}${ident}`;
      console.log("Changing identifier");
    }
  },
  created() {
    this.dept = this.department.role;
    let ident = this.signon.identifier;
    if (!/^\d+$/.test(ident)) {
      ident = ident.substring(1);
      this.prefix = this.signon.identifier.substring(0, 1);
    } else {
      this.prefix = this.signon.session_identifier.substring(2, 3);
      console.log(this.prefix);
    }
    this.identifier = `${this.deptIdentifier}${this.prefix}${ident}`;
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
