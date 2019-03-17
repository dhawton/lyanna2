<template>
  <l-map
    :zoom="currentZoom"
    :center="currentCenter"
    :options="mapOptions"
    style="height: 100%;"
    ref="mapbox"
    @update:center="centerUpdate"
    @update:zoom="zoomUpdate"
  >
    <l-tile-layer :url="url" :attribution="null"/>
  </l-map>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer } from "vue2-leaflet";

export default {
  name: "CADMap",
  components: {
    LMap,
    LTileLayer
  },
  data() {
    return {
      url: "https://dashboard.lakecountyrp.com/img/maps/{z}/{x}/{y}.png",
      extent: [-41.33258447, -62.33480126, 49.30103018, 59.53374276],
      bounds: L.latLngBounds([
        L.latLng([-62.33480126, -41.33258447]),
        L.latLng([59.53374276, 49.30103018])
      ]),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.1,
        minZoom: 3,
        maxZoom: 7
      }
    };
  },
  computed: {
    currentZoom: {
      get() {
        return this.$store.getters.mapZoom;
      },
      set(value) {
        this.$store.commit("mapZoom", value);
      }
    },
    currentCenter: {
      get() {
        return this.$store.getters.mapCenter;
      },
      set(value) {
        this.$store.commit("mapCenter", value);
      }
    }
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    }
  }
};
</script>

<style>
.leaflet-container {
  background: unset !important;
}
.leaflet-container .leaflet-control-attribution {
  display: none;
}
</style>
