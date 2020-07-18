<template>
  <v-container id="app" data-app class>
    <v-row>
      <v-col>
        <v-list>
          <!-- si el escritopor es igual al actual user -->
          <v-list-item v-if="mensajes.length == 0">Sin mensajes</v-list-item>
          <v-list-item v-for="item in mensajes" :key="item.mensajes">
            <v-row>
              <v-col :cols="item.autor == usuarioact ? 12 : 2"></v-col>
              <v-col class>
                <div>
                  <v-list-item-action-text
                    :class="[classLetraMen, item.autor == usuarioact ? 'fondoletraChat': 'fondoletraChat2']"
                  >{{item.mensaje}}</v-list-item-action-text>
                  <v-list-item-action-text :class="classLetraFec">{{item.fecha}}</v-list-item-action-text>
                </div>
              </v-col>
            </v-row>
          </v-list-item>
          <v-list-item>
            <v-row>
              <v-col style="margin-bottom: -2em;" :cols="ultimoElem.autor == usuarioact ? 12 : 2"></v-col>
              <v-col class>
                <div>
                  <v-list-item-action-text
                    :class="[classLetraMen, ultimoElem.autor == usuarioact ? 'fondoletraChat': 'fondoletraChat2']"
                    id="element"
                  >{{ultimoElem.mensaje}}</v-list-item-action-text>
                  <v-list-item-action-text :class="classLetraFec">{{ultimoElem.fecha}}</v-list-item-action-text>
                </div>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueScrollTo from "vue-scrollto";

export default {
  data: () => ({
    mensajes: [],
    mensajesPre: [],
    ultimoElemPre: {},
    ultimoElem: {},
    notificacion: false
  }),
  computed: {
    classLetraMen() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return "letramdlg";
      }
      if (this.$vuetify.breakpoint.smAndDown) {
        return "letrasmxs";
      }
    },
    classLetraFec() {
      return {
        letraFecmdlg: this.$vuetify.breakpoint.mdAndUp,
        letraFecsmxm: this.$vuetify.breakpoint.smAndDown
      };
    }
  },
  methods: {
    classLetrafec() {},
    cargarMen() {
      this.$fireStore
        .doc("/chats/" + this.$route.params.id)
        .collection("chat")
        .limit(20)
        .orderBy("fecha", "desc")
        .onSnapshot(doc => {
          var x = 0;
          this.mensajesPre = [];
          doc.forEach(element => {
            var fec = this.$moment(element.data().fecha).format(
              "MM DD YYYY, h:mm:ss a"
            );
            this.mensajesPre.unshift({
              autor: element.data().escritoPor,
              mensaje: element.data().mensaje,
              fecha: fec
            });
            x++;
          });
          //renderiza dos veces
          if (this.mensajesPre.length > 0) {
            this.ultimoElemPre = this.mensajesPre.pop();

            this.mensajes = this.mensajesPre;
            this.ultimoElem = this.ultimoElemPre;
            // VueScrollTo.scrollTo("#element");
            // console.log('llego un msm')

          }
        });
    },
    escucharChats() {},
  },
  fetch() {
    //console.log(this.$route.params.id);
    this.cargarMen();
    this.usuarioact = this.$store.getters["localStorage/userID"];
  },
  mounted: function() {
    this.$nextTick(function() {
      setTimeout(() => {
        VueScrollTo.scrollTo("#element");
      }, 1000);
    });
  }
};
</script>

<style>
.letramdlg {
  font-size: 1em;
}
.letrasmxs {
  font-size: 0.8em;
}
.letraFecmdlg {
  font-size: 0.65em;
}
.letraFecsmxm {
  font-size: 0.53em;
}
.textAlign {
  align-items: center;
}
.espaciomensajes {
  padding: 0em;
}
.fondoletraChat {
  background-color: #dbffdf;
  padding: 0.2em;
  border-radius: 5%;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}
.fondoletraChat2 {
  background-color: #ffeafe;
  padding: 0.2em;
  border-radius: 5%;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}
.borde {
  background-color: #e7e7e7;
}
.scrollable {
  overflow: hidden;
  overflow-y: scroll;
  height: calc(100vh - 20px);
}
</style>