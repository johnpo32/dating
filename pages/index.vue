<template>
  <div>
    <!-- navbar -->
    <Navbar />
    <!-- container para body -->
    <v-container class="grey lighten-5" fluid>
      <v-row v-for="n in 2" :key="n" :class="n === 1 ? 'mb-6' : ''" no-gutters>
        <v-col>
          <!-- hot match -->
          <div v-if="n === 1" class="pa-2" outlined tile justify="center" align="center">
            <HotList />
          </div>

          <!-- user busqueda -->
          <div style="z-index: 0;" align="center" v-if="n === 2">
            <Search />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <Footer />
  </div>
</template>

<script>
import Search from "~/components/Search";
import Navbar from "~/components/Navbar";
import HotList from "~/components/HotList";
import Footer from "~/components/Footer";
import realtimeUser from "~/plugins/realtimeUser";

export default {
  middleware: "auth",
  mixins: [realtimeUser],
  data: () => ({}),
  components: {
    Search,
    Navbar,
    HotList,
    Footer
  },
  methods: {},
  computed: {
    cardWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "150px";
        case "sm":
          return "160px";
        case "md":
          return "200px";
        case "lg":
          return "220px";
        case "xl":
          return "240px";
      }
    }
  }
};
</script>
<style scoped>
</style>