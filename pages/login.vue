<template>
  <v-app id="inspire">
    <v-main class="fondo">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" dark>
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-text align="center">
                <img src="/logo.png" alt="Vuetify.js" class="mb-0" />
                <v-alert v-if="alert" type="error">{{errorMessage}}</v-alert>
                <v-btn class="minifondo" v-on:click="loginGoogle" :loading="loading">
                  <img src="/google.png" alt="Vuetify.js" class="logosize mb-0" /> Accede con Google
                </v-btn>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
                

<script>
import realtimeUser from "~/plugins/realtimeUser";
export default {
  mixins: [realtimeUser],
  data: () => ({
    model: {
      email: "prueba@correo.com",
      password: "blackmetal"
    },
    fixed: false,
    loading: false,
    alert: false,
    errorMessage: ""
  }),
  methods: {
    comprobar() {
      console.log(this.$store.getters["localStorage/isLoggedIn"]);
    },
    crearUser() {},
    async loginGoogle() {
      this.loading = true;
      let provider = new this.$fireAuthObj.GoogleAuthProvider();
      this.$fireAuth
        .signInWithPopup(provider)
        .then(result => {
          var user = result.user;
          var userId = user.uid;
          var userEmail = user.email;
          this.$store.dispatch("localStorage/onAuthStateChanged", {
            uid: user.uid,
            email: user.email
          });
          // Verificar si existe o no el usuario

          var usersRef = this.$fireStore.doc("/usuarios/" + userId);

          usersRef.get().then(docSnapshot => {
            if (!docSnapshot.exists) {
              usersRef.set({
                idAuth: "",
                nombre: "user-" + Date.now(),
                foto:
                  "https://firebasestorage.googleapis.com/v0/b/dating-1c86d.appspot.com/o/default%2Fnot-found.png?alt=media&token=d3e8663a-b8ee-44e5-b9ac-e654365c0065",
                email: userEmail,
                fecha: Date.now(),
                id: "",
                municipio: "",
                ubicacion: "",
                descripcion: "",
                genero: "",
                rol: "",
                fechaNac: "0"
              });
            }
          });

          //
          this.$router.push("/");
        })
        .catch(error => {
          this.errorMessage = error.message;
          var credential = error.credential;
          this.alert = true;
          this.loading = false;
        });
    },
    async login() {
      try {
        this.loading = true;
        const auth = await this.$fireAuth
          .signInWithEmailAndPassword(this.model.email, this.model.password)
          .catch(error => {
            this.errorMessage = error.code;
          });
        this.$store.dispatch("localStorage/onAuthStateChanged", {
          uid: auth.user.uid,
          email: auth.user.email
        });
        this.$router.push("/");
      } catch (error) {
        this.alert = true;
        this.loading = false;
      }
    }
  },
  created: function() {
    if (this.$store.getters["localStorage/isLoggedIn"]) this.$router.push("/");
  }
};
</script>
<style scoped>
.fondo {
  background-color: #070707;
  background-image: url("~assets/imagenes/lingote.png");
  background-repeat: round;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.minifondo {
  background-image: url("~assets/imagenes/patronDor.png");
  background-repeat: repeat-x;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.logosize {
  width: 30px;
  margin-right: 10px;
}
</style>