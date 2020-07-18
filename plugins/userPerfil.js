export default {
  data: () => ({
    usuario: [],
  }),
  methods: {
    async userActivo() {
      this.$fireAuth.onAuthStateChanged(user => {
        if (user) {
          var uid = user.uid;
          var usersRef = this.$fireStore.doc("/usuarios/" + uid);
          usersRef.get().then(doc => {
            if (doc.exists) {
              var a = this.$moment(Date.now());
              var b = this.$moment(doc.data().fechaNac);
              var c = a.diff(b, "years");
              this.usuario = {
                b : doc.data().fechaNac,
                id: doc.id,
                nombre: doc.data().nombre,
                foto: doc.data().foto,
                email: doc.data().email,
                municipio: doc.data().municipio,
                ubicacion: doc.data().ubicacion,
                descripcion: doc.data().descripcion,
                fecha: doc.data().fecha,
                fechaNac: c
              };
            } else {
              console.log("Error getting documents: ");
            }
          });
        } else {
          console.log("fail perfol");
        }
      });
    }
  },
  mounted() {
    this.userActivo();
  }
};
