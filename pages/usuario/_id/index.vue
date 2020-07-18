<template>
  <div>
    <Navbar />
    <HotList class="mb-5" />
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="mx-auto letra" :width="cardWidth">
            <v-card-title>{{usuarioPerfil.nombre}}</v-card-title>
            <v-img class="alinFoto" width="200px" :src="usuarioPerfil.foto"></v-img>
            <v-card-subtitle>{{usuarioPerfil.rol}}</v-card-subtitle>
            <v-divider></v-divider>
            <v-card-subtitle v-if="usuarioPerfil.b != '0'">{{usuarioPerfil.fechaNac}} años</v-card-subtitle>
            <v-card-text>
              <div>Acerca de mi</div>

              <div>{{usuarioPerfil.descripcion}}</div>
            </v-card-text>
            <v-card-actions v-if="usuarioPerfil.id !== usuarioact">
              <v-btn class="alinFoto" @click="salaChat">Enviar Mensaje</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Footer />
  </div>
</template>

<script>
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import userPerfil from "../../../plugins/userPerfil";
import HotList from "~/components/HotList";

export default {
  mixins: [userPerfil],
  components: {
    Navbar,
    Footer,
    HotList
  },
  data: () => ({
    usuarioPerfil: {},
    mensaje: "",
    usuarioact: "",
    checkChat: false,
    urlChat: ""
  }),
  methods: {
    async userProfile() {
      var usersRef = this.$fireStore.doc("/usuarios/" + this.$route.params.id);
      usersRef.get().then(doc => {
        if (doc.exists) {
          var a = this.$moment(Date.now());
          var b = this.$moment(doc.data().fechaNac);
          var c = a.diff(b, "years");
          this.usuarioPerfil = {
            b: doc.data().fechaNac,
            id: doc.id,
            nombre: doc.data().nombre,
            foto: doc.data().foto,
            email: doc.data().email,
            municipio: doc.data().municipio,
            ubicacion: doc.data().ubicacion,
            fecha: doc.data().fecha,
            fechaNac: c,
            descripcion: doc.data().descripcion,
            rol: doc.data().rol
          };
        } else {
          console.log("Error getting documents: ");
        }
      });
    },
    async salaChat() {
      var emisor = await this.$store.getters["localStorage/userID"];
      var receptor = await this.$route.params.id;

      var charRef = await this.$fireStore.collection("chats");

      charRef
        .where("emisor", "==", emisor)
        .where("receptor", "==", receptor)
        .get()
        .then(doc => {
          doc.forEach(doc => {
            this.urlChat = doc.id;
            this.checkChat = true;
          });
          if (this.checkChat) {
            this.$router.push("/chat/" + this.urlChat);
          } else {
            charRef
              .add({
                emisor: emisor,
                receptor: receptor,
                nomRecep: this.usuarioPerfil.nombre,
                fotoRecep: this.usuarioPerfil.foto,
                nomEmisor: this.usuario.nombre,
                fotoEmisor: this.usuario.foto,
                fechaInicial: Date.now()
              })
              .then(docRef => {
                this.$router.push("/chat/" + docRef.id);
              })
              .catch(error => {
                console.error("Error adding document: ", error);
              });
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  },
  async fetch() {
    this.userProfile();
    this.usuarioact = this.$store.getters["localStorage/userID"];
  },

  computed: {
    cardWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "100%";
        case "sm":
          return "100%";
        case "md":
          return "100%";
        case "lg":
          return "100%";
        case "xl":
          return "840px";
      }
    }
  }
};
</script>

<style>
.alinFoto {
  margin-left: auto;
  margin-right: auto;
}
.letra {
  font-family: "Montserrat", sans-serif;
}
.letraRol {
  color: rgba(0, 0, 0, 0.6);
}
</style>