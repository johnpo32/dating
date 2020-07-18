<template>
  <v-row>
    <!-- <v-col cols="12" align="center" class="letraHot">Hot</v-col> -->
    <!-- pantalla pequeña -->
    <v-col v-show="$vuetify.breakpoint.xs" xs12 sm="12" md="12" lg="12" class="card d-sm-flex">
      <div v-for="(item, index) in usuarios" :key="index">
        <NuxtLink :to="'/usuario/'+item.idAuth">
        <v-avatar style="z-index: -1;" class="sepAvatar" size="60">
          <v-img v-if="index < 10" :src="item.foto" :alt="item.nombre" />
        </v-avatar>
        </NuxtLink>
      </div>
      <v-btn icon>
        <v-icon>mdi-chevron-double-right</v-icon>
      </v-btn>
    </v-col>
    <!-- pantallas medianas a grandes -->
    <v-col
      v-show="$vuetify.breakpoint.smAndUp"
      xs12
      sm="12"
      md="12"
      lg="12"
      class="cardlg d-sm-flex"
    >
      <div v-for="(item, index) in usuarios" :key="index">
        <NuxtLink :to="'/usuario/'+item.idAuth">
          <v-avatar v-ripple style="z-index: -1;" class="sepAvatar" size="60">
            <v-img v-if="index < 10" :src="item.foto" :alt="item.nombre" />
          </v-avatar>
        </NuxtLink>
      </div>
      <v-btn icon>
        <v-icon>mdi-chevron-double-right</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    usuarios: []
  }),
  methods: {
    lista() {
      this.$fireStore
        .collection("usuarios")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.usuarios.push({
              idAuth: doc.id,
              id: doc.data().id,
              nombre: doc.data().nombre,
              foto: doc.data().foto,
              municipio: doc.data().municipio,
              ubicacion: doc.data().ubicacion
            });
          });
          console.log(this.usuarios[0].ubicacion.Rc); //latitud Rc, longitud Aci
        });
    }
  },
  async fetch() {
    await this.lista();
  }
};
</script>

<style>
.sepAvatar {
  margin-right: 10px;
}
.cardlg {
  overflow-x: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  overflow-x: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.card::-webkit-scrollbar {
  display: none;
}
.letraHot {
  color: #353535;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 0.85em;
}
</style>