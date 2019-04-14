<template>
  <b-container fluid class="fill">
    <b-row class="justify-content-center vertical-center">
      <b-col col md="4">
        <div style="width: 100%; text-align: center">
          <b-img src="../../assets/logo.png" style="width: 200px;" class="pb-2"/>
        </div>
        <b-card header="Select Department">
          <div v-if="!prepared" class="text-center">
            <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"/>
          </div>
          <div v-else-if="prepared">
            <div
              v-for="department in departments"
              :key="department.id"
              style="margin-bottom: -5px;"
            >
              <b-button
                block
                variant="black"
                :class="'btn-' + department.role"
                v-if="hasRole(department.role)"
                @click="selectDepartment(department)"
              >{{ department.name }}</b-button>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_DEPARTMENTS_AND_ROLES } from "../../store/queries/misc";

export default {
  name: "Departments",
  beforeCreate() {
    document.body.className = "login";
  },
  data() {
    return {
      prepared: false,
      departments: []
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    this.$apollo
      .query({
        query: GET_DEPARTMENTS_AND_ROLES
      })
      .then(r => {
        this.departments = r.data.departments;
        const roles = [];
        r.data.me.roles.forEach(v => {
          roles.push(v.role);
        });
        this.$store.commit("roles", roles);
        this.$store.commit("me", {
          identifier: r.data.me.community_identifier,
          name: r.data.me.name
        });
        this.prepared = true;
      })
      .catch(err => console.error(err));
  },
  methods: {
    clearError() {
      this.error = undefined;
    },
    hasRole(role) {
      let has = false;
      this.$store.getters.roles.forEach(v => {
        if (v === role) has = true;
      });
      return has;
    },
    selectDepartment(department) {
      this.$store.commit("department", department);
      this.$router.push({ path: "/login/characters" });
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  color: red;
}
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
  margin-bottom: 1rem;
}

.btn-black:hover {
  color: lightgray;
}
.btn-civ:hover {
  background-color: rgb(0, 50, 0);
}
.btn-police:hover,
.btn-sheriff:hover,
.btn-highway:hover {
  background-color: rgb(0, 0, 50);
}
.btn-fire:hover {
  background-color: rgb(50, 0, 0);
}
.btn-dispatch:hover {
  background-color: rgb(50, 0, 50);
}
.btn-intel:hover {
  background-color: rgb(104, 74, 0);
}
.btn-court:hover {
  background-color: darkgoldenrod;
}

.btn-gray {
  background-color: rgba(40, 40, 40, 0.8);
  color: white;
}
</style>
