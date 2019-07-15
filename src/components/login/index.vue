<template>
  <b-container fluid class="fill">
    <b-row class="justify-content-center vertical-center">
      <b-col col md="4">
        <div style="width: 100%; text-align: center">
          <h2 style="color: white;">Big Island Role Play</h2>
          <!-- <b-img src="../../assets/logo.png" style="width: 200px;" class="pb-2"/> -->
        </div>
        <b-card header="Lyanna Login">
          <div v-if="!prepared" class="text-center">
            <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner" />
          </div>
          <div v-else-if="prepared && !myLoggedIn">
            <b-alert
              variant="danger"
              dismissible
              v-model="showDismissibleAlert"
              @dismissed="clearError"
            >Login failed. Please check your email address and password and try again.</b-alert>
            <b-form @submit.prevent="onSubmit">
              <b-form-group
                id="fieldsetHorizontal"
                label-cols-sm="2"
                label="Email"
                label-for="email"
              >
                <b-form-input
                  id="email"
                  type="email"
                  v-model="form.email"
                  placeholder="Enter Email"
                />
              </b-form-group>
              <b-form-group
                id="fieldsetHorizontal"
                label-cols-sm="2"
                label="Password"
                label-for="password"
              >
                <b-form-input
                  id="password"
                  type="password"
                  v-model="form.password"
                  placeholder="Enter Password"
                />
              </b-form-group>
              <b-button v-if="!loggingIn" type="submit" variant="black" block>Submit</b-button>
              <b-button v-else variant="black" block disabled>
                <b-spinner small />
              </b-button>
            </b-form>
            <p
              class="mb-0"
            >If you have forgotten your password, please seek assistance on our Discord.</p>
            <p class="mb-0">
              <b-button to="https://dashboard.bigislandrp.org/register" variant="black" block>Register</b-button>
            </p>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <div
      style="border: 1px solid black; border-radius: 99px; position: absolute; width: 200px; bottom: 5px; right: 5px;"
    >
      <img src="../../assets/logo.png" style="width: 198px;" />
    </div>
  </b-container>
</template>

<script>
import { CHECK_AUTH, LOGIN } from "@/store/queries/user";

export default {
  name: "Login",
  beforeCreate() {
    document.body.className = "login";
  },
  data() {
    return {
      prepared: false,
      myLoggedIn: false,
      loggingIn: false,
      error: undefined,
      showDismissibleAlert: false,
      form: {
        email: "",
        password: ""
      }
    };
  },
  created() {
    if (
      window.localStorage.getItem("t") !== null &&
      window.localStorage.getItem("te") !== null &&
      Math.floor(new Date().getTime() / 1000) <
        window.localStorage.getItem("te") - 300
    ) {
      this.$apollo
        .query({
          query: CHECK_AUTH
        })
        .then(r => {
          if (r.data.me.id !== undefined) {
            this.prepared = true;
            this.myLoggedIn = true;
            this.$store.commit("loggedIn", true);
            this.$router.push("/login/servers");
          }
        })
        .catch(() => {
          this.prepared = true;
          this.myLoggedIn = false;
          window.localStorage.setItem("t", "");
          window.localStorage.setItem("te", "");
        });
    } else {
      this.prepared = true;
      this.myLoggedIn = false;
      window.localStorage.setItem("t", "");
      window.localStorage.setItem("te", "");
    }
  },
  methods: {
    onSubmit() {
      this.loggingIn = true;
      this.$apollo
        .mutate({
          mutation: LOGIN,
          variables: { email: this.form.email, password: this.form.password }
        })
        .then(r => {
          window.localStorage.setItem("t", r.data.Login.token);
          window.localStorage.setItem("te", r.data.Login.expiresAt);
          this.myLoggedIn = true;
          this.loggingIn = false;
          this.$store.commit("loggedIn", true);
          this.$router.push("/login/servers");
        })
        .catch(err => {
          this.error = err.debugMessage;
          this.showDismissibleAlert = true;
          this.loggingIn = false;
          this.password = "";
        });
    },
    clearError() {
      this.error = undefined;
    }
  }
};
</script>

<style scoped>
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
  background-color: rgba(255, 255, 255, 0.6);
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
  background-color: rgba(50, 50, 50, 0.8);
  color: darkgray;
  margin-bottom: 1rem;
}
</style>
