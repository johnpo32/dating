<template>
  <div>
    <Navbar class="position" />
    <v-container style="padding: 0;" fluid>
      <!-- Dispositivos pequeños -->
      <div v-show="$vuetify.breakpoint.xs">
        <v-row no-gutters>
          <v-col>
            <div>{{mensaje}}</div>
          </v-col>
        </v-row>
      </div>
      <!-- fin -->

      <!-- dispositivos grandes -->
      <div v-show="$vuetify.breakpoint.smAndUp">
        <v-row no-gutters>
          <v-col md="3" sm="4">
            <!-- <div>{{mensajes}}</div> -->

            <div class="position espacio scrollable">
              <v-card :width="cardWidth" flat tile>
                <v-list>
                  <v-subheader>Recent chat</v-subheader>
                  <v-list-item-group v-model="selected" active-class="pink--text">
                    <template v-for="(item, index) in usersChat">
                      <NuxtLink :key="item.id" class="nuxtlink" :to="'/chat/'+item.id">
                        <v-list-item>
                          <template v-slot:default="{ active }">
                            <v-list-item-avatar>
                              <v-img :src="item.foto"></v-img>
                            </v-list-item-avatar>

                            <v-list-item-title
                              :class="{
                                'colorNomxs': $vuetify.breakpoint.mdAndDown,
                                'colorNomup': $vuetify.breakpoint.mdAndUp                }"
                              v-text="item.nombre"
                            ></v-list-item-title>

                            <v-list-item-action>
                              <v-list-item-action-text v-text="item.action"></v-list-item-action-text>
                              <v-icon v-if="!active" color="grey lighten-1"></v-icon>

                              <v-icon v-else color="#a32121" size="15">mdi-alpha-m-circle</v-icon>
                            </v-list-item-action>

                            <v-list-item-action>
                              <v-list-item-action-text v-text="item.action"></v-list-item-action-text>
                              <v-icon v-if="!active" color="grey lighten-1">check</v-icon>

                              <v-icon v-else color="yellow">mdi-check-all</v-icon>
                            </v-list-item-action>
                          </template>
                        </v-list-item>

                        <v-divider v-if="index + 1 < usersChat.length" :key="index"></v-divider>
                      </NuxtLink>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </div>
          </v-col>
          <v-col md="9" sm="8">
            <div ref="chatContainer" class="margenTextFiel">
              <NuxtChild style="position:relative; margin-top:1.2em" :key="$route.params.id" />
            </div>
            <div class="typer position">
              <v-row>
                <v-col cols="11">
                  <v-text-field
                    placeholder="escriba aquí"
                    @keyup.enter="envMensaje"
                    :rules="rules"
                    v-model="mensaje"
                  ></v-text-field>
                </v-col>
                <v-col cols="1">
                  <v-btn v-if="mensaje.length != 0" @click="envMensaje" class="mr-4" icon>
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </div>
      <!-- fin -->
    </v-container>
  </div>
</template>

<script>
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
export default {
  components: { Navbar, Footer },
  data: () => ({
    selected: null,
    usersChat: [],
    /* mensajes: "", */
    mensaje: "",
    rules: [
      /*  value => !!value || "Required.", */
      value => (value || "").length <= 300 || "Max 300 characters"
    ]
  }),
  computed: {},
  methods: {
    async salasDisponibles() {
      // emisor Mensaje
      var emisor = await this.$store.getters["localStorage/userID"];
      // Referencia a la base de datos
      var chatRef = await this.$fireStore.collection("chats");
      // Consultar salas disponibles
      // emisor
      chatRef.where("emisor", "==", emisor).onSnapshot(doc => {
        var x = 0; //para identificar el elemento seleccionado
        doc.forEach(element => {
          if (element.id == this.$route.params.id) {
            this.selected = x;
          }
          this.usersChat.push({
            id: element.id,
            nombre: element.data().nomRecep,
            foto: element.data().fotoRecep
          });
          x++;
        });
      });
      // receptor

      chatRef.where("receptor", "==", emisor).onSnapshot(doc => {
        var x = 0; //para identificar el elemento seleccionado
        doc.forEach(element => {
          if (element.id == this.$route.params.id) {
            this.selected = x;
          }
          this.usersChat.push({
            id: element.id,
            nombre: element.data().nomEmisor,
            foto: element.data().fotoEmisor
          });
          x++;
        });
      });
    },
    async envMensaje() {
      if (this.mensaje == "") return;
      // emisor Mensaje
      var emisor = await this.$store.getters["localStorage/userID"];
      // add Mensaje
      this.$fireStore
        .doc("/chats/" + this.$route.params.id)
        .collection("chat")
        .add({
          mensaje: this.mensaje,
          escritoPor: emisor,
          fecha: Date.now()
        })
        .then(() => {
          this.mensaje = "";
        });
    }
  },
  fetch() {
    this.salasDisponibles();
  },
  mounted() {
    this.mensaje = "";
    console.log(this.$refs.chatContainer.scrollHeight);
  },
  computed: {
    cardWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "150px";
        case "sm":
          return "230px";
        case "md":
          return "280px";
        case "lg":
          return "340px";
        case "xl":
          return "90%px";
      }
    }
  }
};
</script>

<style>
.colorNomxs {
  color: #353535;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  text-align: left;
  font-size: 0.85em;
  margin-left: 0.1em;
}
.colorNomup {
  color: #353535;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  text-align: left;
  font-size: 1em;
  margin-left: 0.1em;
}
.espacio {
  margin-top: 2.8em;
}
.position {
  position: fixed;
  margin-bottom: 0.6em;
}
.margenTextFiel {
  margin-bottom: 4em;
}
.nuxtlink {
  color: #161516;
  text-decoration: none;
}
.letra {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9em;
  margin-left: 1.4em;
}
.typer {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  width: 74%;
  margin-left: 1em;
  background-color: #fff;
  box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.2);
}
.scrollable {
  overflow-y: auto;
}
.chat-container {
  box-sizing: border-box;
  height: calc(100vh - 8.5rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f2f2f2;
}
.chat-container .content {
  padding: 8px;
  background-color: lightgreen;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12);
  max-width: 50%;
  word-wrap: break-word;
}
@media (max-width: 480px) {
  .chat-container .content {
    max-width: 60%;
  }
}
</style>