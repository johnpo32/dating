<template>
  <div data-app light>
    <Navbar />
    <v-container style="min-height: 100vh;">
      <v-row>
        <v-col cols="12">
          <v-card class="mx-auto letra" width="100%">
            <v-card-title>{{usuario.nombre}}</v-card-title>
            <v-img class="alinFoto" width="200px" :src="usuario.foto"></v-img>
            <v-card-actions>
              <v-progress-circular
                class="alinFoto"
                v-if="loading"
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </v-card-actions>
            <v-file-input
              :rules="rules"
              class="espacioIcon"
              accept="image/png, image/jpeg, image/bmp"
              placeholder="Pick an avatar"
              prepend-icon="mdi-camera-plus"
              loading
              clear-icon
              label="Avatar"
              @change="imagenUpload($event)"
            ></v-file-input>
            <!-- <v-btn icon class="espacioIcon" color="indigo" align="left">
              <v-icon>mdi-camera-plus</v-icon>
            </v-btn>-->
            <v-card-subtitle>Email: {{usuario.email}}</v-card-subtitle>

            <v-card-subtitle>{{usuario.rol}}</v-card-subtitle>
            <v-divider></v-divider>
            <v-card-subtitle v-if="usuario.b != '0'">{{usuario.fechaNac}} años</v-card-subtitle>
            <v-card-text>
              <div>Acerca de mi</div>

              <div>{{usuario.descripcion}}</div>
            </v-card-text>
            <v-card-actions>
              <v-card-text>Mi Perfil</v-card-text>
              <UpdatePerfil  />
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
import UpdatePerfil from "~/components/UpdatePerfil";
import realtimeUser from "~/plugins/realtimeUser";
import userPerfil from "~/plugins/userPerfil"

export default {
  middleware: "auth",
  mixins: [realtimeUser, userPerfil],
  components: { Navbar, Footer, UpdatePerfil },
  data: () => ({
    loading: false,
    rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ]
  }),
  methods: {
    refthum() {
      console.log(this.usuario.foto);
    },
    imagenUpload(file) {
      this.loading = true;
      var storageRef = this.$fireStorage.ref();
      var fec = Date.now();

      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child("perfil/" + fec + file.name).put(file);

      var uploadThumb = storageRef.child("perfil/thumb_" + fec + file.name);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        this.$fireStorageObj.TaskEvent.STATE_CHANGED, // or 'state_changed'
        snapshot => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case this.$fireStorageObj.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case this.$fireStorageObj.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        },
        error => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;

            case "storage/canceled":
              // User canceled the upload
              break;

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
              this.loading = false;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL

          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(downloadURL => {
              setTimeout(() => {
                uploadThumb
                  .getDownloadURL()
                  .then(downloadURL => {
                    console.log("miniatura", downloadURL);
                    this.loading = false;
                    this.usuario.foto = downloadURL;
                    var cityRef = this.$fireStore
                      .collection("usuarios")
                      .doc(this.$store.getters["localStorage/userID"]);

                    cityRef.set(
                      {
                        foto: downloadURL
                      },
                      { merge: true }
                    );
                  })
                  .catch(error => {
                    this.loading = false;
                  });
              }, 6000);
            })
            .catch(error => {
              this.loading = false;
            });
        }
      );
    },
    photo() {
      console.log("hola");
    },
    inicio() {
      this.$router.push("/");
    },
  },
  async fetch() {
    await this.userActivo();
    console.log(Date.parse("1986-04-28T20:23:01.804Z"));
  }
};
</script>

<style>
.alinFoto {
  margin-left: auto;
  margin-right: auto;
}
.fondo {
  margin-left: auto;
  margin-right: auto;
  margin-top: 0em;
}
.addPhoto {
  padding-top: 50%;
  z-index: 40;
  align-items: center;
}
.letra {
  font-family: "Montserrat", sans-serif;
}
.espacio {
  padding-left: 2em;
}
.espacioIcon {
  margin-left: 80%;
}
</style>