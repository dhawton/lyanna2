<template>
  <div>
    <b-list-group v-if="isPrepared" :class="{ smallitem: tiny === 'true' }">
      <b-list-group-item variant="danger" v-if="isFelon">Felon</b-list-group-item>
      <b-list-group-item variant="danger" v-if="isArmedAndDangerous">Armed And Dangerous</b-list-group-item>
      <b-list-group-item variant="danger" v-if="isWanted">Wanted</b-list-group-item>
      <b-list-group-item variant="warning" v-if="isRunner">Runner</b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: "Flags",
  data() {
    return {
      isPrepared: false,
      isFelon: false,
      isArmedAndDangerous: false,
      isWanted: false,
      isRunner: false
    };
  },
  props: ["documents", "tiny"],
  created() {
    let battery = 0;
    let murder = 0;
    let weapon = 0;
    let eluding = 0;
    let warrant = 0;
    let felony = 0;
    let escape = 0;
    if (this.documents === undefined || this.documents.length < 1) return;
    this.documents.forEach(k => {
      if (k.type === "Warrant" && k.warrant_active) {
        warrant += 1;
      }
      if (typeof k.violations === "string") {
        try {
          k.violations = JSON.parse(k.violations);
        } catch {
          k.violations = k.violations.split("<br/>");
        }
      }

      if (k.type !== "Warrant") {
        k.violations.forEach(k2 => {
          if (k2.code !== undefined) {
            k2 = `${k2.code} ${k2.title} [${k2.type}]`;
          }
          if (k2.match(/\[F[1-4X]\]/gi)) {
            felony += 1;
          }
          if (k2.match(/Battery/gi)) {
            battery += 1;
          }
          if (k2.match(/murder/gi)) {
            murder += 1;
          }
          if (
            k2.match(
              /Unlawful use of weapons|Reckless discharge of a firearm|Possession of a firearm by a street gang member|Unlawful possession of farms|Use of a stolen firearm in the|Possession of a stolen weapon|Aggravated discharge of a firearm/gi
            )
          ) {
            weapon += 1;
          }
          if (k2.match(/720 SACS 5\/31-6/gi)) {
            escape += 1;
          }
          if (k2.match(/Fleeing or attempting to elude/gi)) {
            eluding += 1;
          }
        });
        console.dir({
          felony,
          battery,
          murder,
          weapon,
          escape,
          eluding
        });
      }
    });
    if (felony > 0) {
      this.isFelon = true;
    }
    if ((battery > 0 || murder > 0) && weapon >= 1) {
      this.isArmedAndDangerous = true;
    }
    if (warrant > 0) {
      this.isWanted = true;
    }
    if (eluding > 2 || escape > 0) {
      this.isRunner = true;
    }
    this.isPrepared = true;
  }
};
</script>

<style lang="scss" scoped>
.list-group-item {
  font-weight: bold;
  text-align: right;
}
.list-group-item-danger {
  background-color: rgb(200, 0, 0);
  color: white;
}
.list-group-item-warning {
  background-color: rgb(255, 200, 0);
  color: black;
}
.smallitem {
  padding: 6px;
  & .list-group-item {
    padding: 6px;
    text-align: center;
  }
}
</style>
