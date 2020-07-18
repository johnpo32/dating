<template>
  <div>
    <!-- Smartphones -->
    <div class="text-center" v-show="$vuetify.breakpoint.xs">
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn width="100%" color="dark" v-bind="attrs" v-on="on">Filtros</v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>John Leider</v-list-item-title>
                <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-select
                  v-model="items.id"
                  :items="items"
                  attach
                  chips
                  label="Ubicacion"
                  item-text="title"
                  item-value="id"
                ></v-select>
              </v-list-item-action>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <!--   <v-select
                  v-model="value.title"
                  :items="value"
                  attach
                  chips
                  label="Ubicacion"
                  item-text="title"
                ></v-select>-->

                <v-btn
                  @click="getKilometros(19.439710,-99.066419,19.26356892106044,-99.64782997594243)"
                >kilometros</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="menu = false">Cancel</v-btn>
            <v-btn color="primary" text @click="(menu = false), ss()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
    <!-- Tablets y mayores -->
    <div v-show="$vuetify.breakpoint.smAndUp">
      <v-row>
        <v-col md="4" lg="6" align="right">
          <v-select filled :items="items" label="Edad" item-text="title"></v-select>
        </v-col>
        <v-col md="4" lg="6" align="left">
          <v-select filled :items="items" label="Ubicacion" item-text="title"></v-select>
        </v-col>
      </v-row>
    </div>
    <v-container>
      <v-row dense>
        <v-col cols="6" xm="6" sm="3" md="2" lg="2" v-for="m in usuarios" :key="m.idAuth">
          <v-card style="z-index: 1;">
            <NuxtLink :to="'/usuario/'+m.idAuth">
              <v-img
                v-ripple
                :src="m.foto"
                class="white--text align-end mb-0"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200"
              >
                <v-icon
                  color="#298736"
                  size="11"
                  class="iconPos"
                  v-if="m.state === 'online'"
                >mdi-checkbox-blank-circle</v-icon>
              </v-img>
            </NuxtLink>

            <v-card-title
              :class="{
                  'colorNomxs': $vuetify.breakpoint.xs,
                  'colorNomup': $vuetify.breakpoint.smAndUp
                }"
            >{{ m.nombre }}</v-card-title>

            <v-card-subtitle
              style="margin-bottom: -1em;"
              :class="{
                  'colorNomxs': $vuetify.breakpoint.xs,
                  'colorNomup': $vuetify.breakpoint.smAndUp
                }"
            >{{ m.municipio }}</v-card-subtitle>
            <v-card-actions>
              <v-btn icon>
                <v-icon size="20" color="#d47800">mdi-camera</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon size="20" color="#d47800">mdi-heart</v-icon>
              </v-btn>

              <v-card-subtitle v-if="m.b != '0' " class="fechaNacAlign">{{m.fechaNac}}</v-card-subtitle>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-btn @click="pagLista">more</v-btn>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    usuarios: [],
    lastVisible: {},
    online: [],
    items: [
      { title: "0 a 20 km ", id: 1 },
      { title: "20 a 50 km", id: 2 },
      { title: "50 a 100 km", id: 3 },
      { title: "mas de 100 km", id: 4 },
      { title: "All", id: 5 }
    ],
    value: [
      { title: "foo" },
      { title: "bar" },
      { title: "fizz" },
      { title: "buzz" }
    ],
    fav: true,
    menu: false,
    message: false,
    hints: true
  }),
  mounted() {
    this.lista();
  },

  methods: {
    async getKilometros(lat1, lon1, lat2, lon2) {
      var R = 6378.137; //Radio de la tierra en km
      var dLat = this.rad(lat2 - lat1);
      var dLong = this.rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.rad(lat1)) *
          Math.cos(this.rad(lat2)) *
          Math.sin(dLong / 2) *
          Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      console.log("k ", d);
      return d.toFixed(3); //Retorna tres decimales
    },
    rad(x) {
      return (x * Math.PI) / 180;
    },
    ss() {
      console.log(this.items.id);
    },
    pagLista() {
      if (this.lastVisible != undefined) {
        var next = this.$fireStore
          .collection("usuarios")
          .startAfter(this.lastVisible)
          .limit(25);

        next.get().then(documentSnapshots => {
          // Get the last visible document
          this.lastVisible =
            documentSnapshots.docs[documentSnapshots.docs.length - 1];
        });

        next.get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var a = this.$moment(Date.now());
            var b = this.$moment(doc.data().fechaNac);
            var c = a.diff(b, "years");
            this.usuarios.push({
              b: doc.data().fechaNac,
              idAuth: doc.id,
              id: doc.data().id,
              nombre: doc.data().nombre,
              foto: doc.data().foto,
              municipio: doc.data().municipio,
              ubicacion: doc.data().ubicacion,
              fecha: doc.data().fecha,
              fechaNac: c,
              state: "offline"
            });
            this.usuarios.sort(function(a, b) {
              return new Date(b.fecha) - new Date(a.fecha);
            });
          });
        });

        console.log("lastVisible ", this.lastVisible);
      }
    },
    lista() {
      var refDb = this.$fireStore.collection("usuarios").limit(6);
      //paginacion
      refDb.get().then(documentSnapshots => {
        // Get the last visible document
        this.lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
      });
      //consulta
      refDb
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var a = this.$moment(Date.now());
            var b = this.$moment(doc.data().fechaNac);
            var c = a.diff(b, "years");
            this.usuarios.unshift({
              b: doc.data().fechaNac,
              idAuth: doc.id,
              id: doc.data().id,
              nombre: doc.data().nombre,
              foto: doc.data().foto,
              municipio: doc.data().municipio,
              ubicacion: doc.data().ubicacion,
              fecha: doc.data().fecha,
              fechaNac: c,
              state: "offline"
            });
            this.usuarios.sort(function(a, b) {
              return new Date(b.fecha) - new Date(a.fecha);
            });
          });

          //console.log(this.usuarios[0].ubicacion.Rc); //latitud Rc, longitud Aci
          console.log(this.usuarios[0].fechaNac);
        })
        .then(() => {
          for (let data in this.usuarios) {
            var ref = this.$fireStore.doc(
              "/status/" + this.usuarios[data].idAuth
            );
            ref.get().then(doc => {
              if (doc.exists) {
                this.usuarios[data].state = doc.data().state;
              }
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.fechaNacAlign {
  padding-left: 39px;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
}
.iconPos {
  padding-left: 70%;
}
.searchMenu {
  background-color: #777777;
  color: #e4e4e4;
}
.colorNomxs {
  color: #353535;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  text-align: left;
  font-size: 0.85em;
}
.colorNomup {
  color: #353535;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  text-align: left;
  font-size: 1em;
}
</style>
