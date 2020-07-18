<template>
  <div id="app" data-app>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon>
            <v-icon>mdi-pen</v-icon>
          </v-btn>
        </template>
        <v-card light>
          <v-card-title>
            <span class="headline">User Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field v-model="usuario.nombre" label="nombre usuario" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <!-- Fecha de cumpleaños -->
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Fecha de Cumpleaños"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="date"
                      :max="new Date().toISOString().substr(0, 10)"
                      min="1950-01-01"
                      @change="save"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    name="input-7-1"
                    label="Acerca de mi"
                    v-model="usuario.descripcion"
                    hint="Hint text"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false, fechaNacd()">Close</v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false, submit()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import userPerfil from "~/plugins/userPerfil";
export default {
  mixins: [userPerfil],
  data: () => ({
    dialog: false,
    date: null,
    menu: false
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  methods: {
    submit() {
      if (this.usuario.nombre == "") {
        this.usuario.nombre = "user" + Date.now();
      }
      var cityRef = this.$fireStore.collection("usuarios").doc(this.$store.getters["localStorage/userID"]);

      cityRef.set(
        {
          nombre: this.usuario.nombre,
          fechaNac:  this.usuario.fechaNac,
          descripcion: this.usuario.descripcion
        },
        { merge: true }
      );
      location.reload();
    },
    fechaNacd(){console.log(this.usuario.fechaNac)},
    save(date) {
      console.log(date)
      this.$refs.menu.save(date);
      if (date != null) {
        this.usuario.fechaNac = date;
      }
    }
  },
  fetch() {
    console.log("hola update");
  }
};
</script>

<style>
</style>