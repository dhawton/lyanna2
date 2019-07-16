<template>
  <div>
    <License :showedit="true" v-if="prepared" v-bind:documents="documents" :character="character" />
    <b-row>
      <b-col md="12">
        <Record v-if="prepared" v-bind:items="documents" />
        <div v-if="!prepared" class="text-center">
          <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner" />
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import License from "@/components/shared/License";
import Record from "@/components/shared/Record";
import { GET_CHARACTER_DOCUMENTS } from "@/store/queries/legal";
import { GET_CHARACTER } from "../../store/queries/civ";

export default {
  name: "CivProfile",
  components: {
    License,
    Record
  },
  data() {
    return {
      prepared: false,
      documents: [],
      updateTimer: undefined
    };
  },
  computed: {
    ...mapGetters(["character"])
  },
  created() {
    this.updateDocuments();
    this.updateTimer = setInterval(this.update, 60000);
  },
  beforeDestroy() {
    clearInterval(this.updateTimer);
  },
  methods: {
    update() {
      this.updateDocuments();
      this.updateCharacter();
    },
    updateCharacter() {
      this.$apollo
        .query({
          query: GET_CHARACTER,
          variables: {
            id: this.character.id
          }
        })
        .then(r => {
          this.$store.commit("character", r.data.Character);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateDocuments() {
      this.$apollo
        .query({
          query: GET_CHARACTER_DOCUMENTS,
          variables: {
            id: this.character.id
          }
        })
        .then(r => {
          const docs = r.data.documentsByCharacter;
          docs.forEach((v, i) => {
            if (!Array.isArray(docs[i].violations)) {
              docs[i].violations = JSON.parse(docs[i].violations);
            }
            docs[i].violations.forEach((v2, i2) => {
              if (typeof vs !== "string") {
                docs[i].violations[i2] = `${v2.code} ${v2.title} [${v2.type}]`;
              }
            });
            docs[i].violationList = docs[i].violations.join("<br/>");
            let dt = new Date(docs[i].created_at).toLocaleString("en-US", {
              timeZone: "America/Anchorage",
              hour12: false
            });
            dt = dt.substr(0, dt.length - 3);
            docs[i].created_at = dt.replace(",", "");
          });
          this.documents = docs;
          this.prepared = true;
        })
        .catch(err => {
          console.error(err);
          this.prepared = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
