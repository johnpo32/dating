<template>
  <v-app-bar dense dark style="z-index: 2;">
    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
    <v-toolbar-title data-app>
      <v-btn @click="inicio" text ripple class="colorTitu">true love</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn @click="inicio" icon>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <!--     <v-btn icon>
      <v-icon color="#fff">mdi-magnify</v-icon>
    </v-btn>-->

    <v-btn @click="goChat" icon>
      <v-icon color="#fff">mdi-chat</v-icon>
    </v-btn>

    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="n in items"
          :key="n.id"
          @click="() => {if(n.id == 1){goPerfil()} else if (n.id == 2) {verificar()} else {salir()} }"
        >
          <v-list-item-title>{{ n.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: "Mi cuenta", id: 1 },
      { title: "verificar", id: 2 },
      { title: "Salir", id: 3 }
    ]
  }),
  methods: {
    goChat() {
      this.$router.push("/chat");
    },
    goPerfil() {
      this.$router.push("/perfil");
    },
    inicio() {
      this.$router.push("/");
    },
    verificar() {
      console.log("verificar ");
    },

    salir() {
      this.$fireAuth
        .signOut()
        .then(() => {
          this.$store.dispatch("localStorage/RESET");
          this.$router.push("/login");
        })
        .catch(function(error) {
          // An error happened.
        });
    }
  }
};
</script>

<style scoped>
.colorTitu {
  z-index: 2;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 1em;
  color: #d47800;
  text-transform: lowercase;
}
</style>