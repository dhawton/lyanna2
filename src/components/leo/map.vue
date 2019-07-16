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
    <l-tile-layer :url="url" :attribution="null" />
    <div v-for="dept in ['police','sheriff','highway','fire']" :key="dept">
      <l-marker
        v-for="marker in markers[dept]"
        :key="marker.id"
        :lat-lng.sync="marker.position"
        :icon="icon(dept)"
      >
        <l-tooltip :options="{permanent: true, direction: 'top'}" :content="showname(marker.id)" />
      </l-marker>
    </div>
  </l-map>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LTooltip, LMarker } from "vue2-leaflet";

export default {
  name: "MDTMap",
  components: {
    LMap,
    LTileLayer,
    LTooltip,
    LMarker
  },
  data() {
    return {
      url: "https://dashboard.bigislandrp.org/img/maps/{z}/{x}/{y}.png",
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
      },
      policeIcon: L.icon({
        iconUrl: "/img/maps/icons/police.png",
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      }),
      sheriffIcon: L.icon({
        iconUrl: "/img/maps/icons/sheriff.png",
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      }),
      highwayIcon: L.icon({
        iconUrl: "/img/maps/icons/highway.png",
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      }),
      fireIcon: L.icon({
        iconUrl: "/img/maps/icons/fire.png",
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      }),
      civIcon: L.icon({
        iconUrl: "/img/maps/icons/civ.png",
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      })
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
    },
    markers() {
      const markers = {
        police: [],
        sheriff: [],
        highway: [],
        civ: [],
        fire: []
      };
      this.$store.getters.mapPlayers.forEach(v => {
        if (v.job === "police") {
          markers.police.push({
            id: v.identifier,
            position: {
              lng: v.x / 200,
              lat: v.y / 200 - 5
            }
          });
        } else if (v.job === "sheriff") {
          markers.sheriff.push({
            id: v.identifier,
            position: {
              lat: v.y / 200 - 5,
              lng: v.x / 200
            }
          });
        } else if (v.job === "highway") {
          markers.highway.push({
            id: v.identifier,
            position: {
              lat: v.y / 200 - 5,
              lng: v.x / 200
            }
          });
        } else if (v.job === "fire") {
          markers.fire.push({
            id: v.identifier,
            position: {
              lat: v.y / 200 - 5,
              lng: v.x / 200
            }
          });
        } else {
          markers.civ.push({
            id: v.identifier,
            position: {
              lat: v.y / 100 - 5,
              lng: v.x / 100
            }
          });
        }
      });
      return markers;
    }
  },
  methods: {
    icon(dept) {
      switch (dept) {
        case "police":
          return this.policeIcon;
        case "highway":
          return this.highwayIcon;
        case "sheriff":
          return this.sheriffIcon;
        case "fire":
          return this.fireIcon;
        default:
          return this.civIcon;
      }
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showname(steam) {
      if (
        this.$store.getters.units.filter(unit => unit.steam === steam)
          .length === 0
      ) {
        return steam;
      }
      return this.$store.getters.units.filter(unit => unit.steam === steam)[0]
        .session_identifier;
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
