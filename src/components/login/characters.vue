<template>
  <b-container fluid class="fill">
    <b-row class="justify-content-center vertical-center">
      <b-col col md="4">
        <div style="width: 100%; text-align: center">
          <h2 style="color: white;">Big Island Role Play</h2>
          <!-- <b-img src="../../assets/logo.png" style="width: 200px;" class="pb-2"/> -->
        </div>
        <b-card header="Select Character">
          <div v-if="!prepared" class="text-center">
            <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner" />
          </div>
          <div v-else-if="prepared">
            <div v-if="!['civ','dispatch','fire','court'].includes(department.role)" class="mb-2">
              Unit Identifier
              <select v-model="prefix" class="small-select">
                <option value selected>&nbsp;</option>
                <option v-for="p in unitPrefixes" :key="p">{{ p }}</option>
              </select>
              - {{ ident }}
            </div>
            <b-list-group>
              <b-list-group-item
                v-for="character in characters"
                :key="character.id"
                block
                variant="black"
                class="d-flex justify-content-between align-items-center"
              >
                <span
                  class="hover-pointer-cursor"
                  @click="selectCharacter(character)"
                >{{ character.firstname }} {{ character.lastname }}</span>
                <span class="hover-pointer-cursor text-danger" @click="deleteCharacter(character)">
                  <i class="fa fa-trash-alt" />
                </span>
              </b-list-group-item>
              <b-list-group-item>
                <b-button
                  block
                  variant="black"
                  @click="$router.push('/login/characters/new')"
                >Create Character</b-button>
              </b-list-group-item>
            </b-list-group>
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
import { mapGetters } from "vuex";
import { CIV_CHARACTER_LIST, DELETE_CHARACTER } from "../../store/queries/civ";
import { SIGNON } from "@/store/queries/user";
import { unitPrefixes } from "@/utils/commondata";

export default {
  name: "Characters",
  beforeCreate() {
    document.body.className = "login";
  },
  data() {
    return {
      prepared: false,
      characters: [],
      prefix: "",
      unitPrefixes,
      ident: 0
    };
  },
  computed: {
    ...mapGetters(["department", "me", "server"]),
    deptIdentifier() {
      if (
        this.department.role === "intel" ||
        this.department.role === "highway" ||
        this.department.role === "state"
      ) {
        return 1;
      }
      if (this.department.role === "sheriff") return 5;
      return 3;
    }
  },
  created() {
    if (!/^\d+$/.test(this.me.identifier)) {
      this.prefix = this.me.identifier.substring(0, 1);
      this.ident = this.me.identifier.substring(1);
    } else {
      this.prefix = "";
      this.ident = this.me.identifier;
      if (this.department.role === "intel") this.prefix = "I";
    }

    this.$apollo
      .query({
        query: CIV_CHARACTER_LIST
      })
      .then(r => {
        this.characters = r.data.me.characters;
        this.prepared = true;
      })
      .catch(err => console.error(err));
  },
  methods: {
    clearError() {
      this.error = undefined;
    },
    deleteCharacter(character) {
      this.prepared = false;
      this.$apollo
        .mutate({
          mutation: DELETE_CHARACTER,
          variables: { id: character.id }
        })
        .then(r => {
          this.characters = this.characters.filter(
            c => c.id !== r.data.deleteCharacter.id
          );
          this.prepared = true;
        })
        .catch(err => console.error(err));
    },
    selectCharacter(character) {
      this.$store.commit("character", character);
      if (!["civ", "fire"].includes(this.department.role)) {
        this.$apollo
          .mutate({
            mutation: SIGNON,
            variables: {
              identifier: this.me.identifier,
              department: this.department.id,
              server: this.server.id,
              prefix: this.prefix,
              session_identifier: `${this.prefix}${this.ident}`,
              character_id: character.id
            }
          })
          .then(r => {
            r.data.signon.id = parseInt(r.data.signon.id, 10);
            this.$store.commit("signon", r.data.signon);
          });
      }
      switch (this.department.role) {
        case "civ":
          this.$router.push("/civ");
          break;
        case "police":
        case "sheriff":
        case "highway":
        case "intel":
          this.$router.push("/mdt");
          break;
        case "dispatch":
          this.$router.push("/cad");
          break;
        case "fire":
          this.$router.push("/login/fire");
          break;
        case "court":
          this.$router.push("/court");
          break;
        default:
          this.$router.push("/signout");
          break;
      }
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
  margin-bottom: 1rem;
}

.btn-black:hover {
  color: lightgray;
  background-color: rgba(50, 50, 50, 0.8);
}

.list-group {
  max-height: 300px;
  margin-bottom: 10px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
