<template>
  <b-container fluid class="fill">
    <b-row class="justify-content-center vertical-center">
      <b-col col md="4">
        <b-img src="../../assets/logo_sq_white.png" fluid class="pb-2"/>
        <b-card header="Select Character">
          <div v-if="!prepared" class="text-center">
            <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"/>
          </div>
          <div v-else-if="prepared">
            <div v-if="department.role !== 'civ'" class="mb-2">
              Unit Identifier <select v-model="prefix" class="small-select">
              <option v-for="p in unitPrefixes" :key="p">{{p}}</option>
            </select> {{me.identifier}}
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
                  <font-awesome-icon :icon="['fal', 'trash-alt']"/>
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
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex';
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
      prefix: '',
      unitPrefixes
    };
  },
  computed: {
    ...mapGetters(['department', 'me', 'server'])
  },
  created() {
    if (this.department.role === "police") this.prefix = "P";
    if (this.department.role === "sheriff") this.prefix = "C";
    if (this.department.role === "highway" || this.department.role === "state") this.prefix = "S";
    this.$apollo.query({
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
      this.$apollo.mutate({
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
      if (this.department.role !== "civ") {
        this.$apollo.mutate({
          mutation: SIGNON,
          variables: {
            identifier: this.me.identifier,
            department: this.department.id,
            server: this.server.id,
            prefix: this.prefix,
            character_id: character.id
          }
        }).then((r) => {
          this.$store.commit('signon', r.data.signon);
        });
      }
      switch (this.department.role) {
        case "civ":
          this.$router.push("/civ");
          break;
        case "police":
        case "sheriff":
        case "highway":
          this.$router.push("/mdt");
          break;
        case "dispatch":
          this.$router.push("/cad");
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
