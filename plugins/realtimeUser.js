export default {
  data: () => ({
    usuarioOnline: []
  }),
  methods: {
    realtime() {
      this.$fireAuth.onAuthStateChanged(user => {
        if (user) {
          var uid = user.uid;
          var userStatusDatabaseRef = this.$fireDb.ref("/status/" + uid);

          // We'll create two constants which we will write to
          // the Realtime database when this device is offline
          // or online.
          var isOfflineForDatabase = {
            state: "offline",
            last_changed: this.$fireDbObj.ServerValue.TIMESTAMP
          };

          var isOnlineForDatabase = {
            state: "online",
            last_changed: this.$fireDbObj.ServerValue.TIMESTAMP
          };

          this.$fireDb.ref(".info/connected").on("value", function(snapshot) {
            // If we're not currently connected, don't do anything.
            if (snapshot.val() == false) {
              return;
            }

            userStatusDatabaseRef
              .onDisconnect()
              .set(isOfflineForDatabase)
              .then(function() {
                userStatusDatabaseRef.set(isOnlineForDatabase);
              });
          });

          /* firestore docs */

          var userStatusFirestoreRef = this.$fireStore.doc("/status/" + uid);

          // Firestore uses a different server timestamp value, so we'll
          // create two more constants for Firestore state.
          var isOfflineForFirestore = {
            state: "offline",
            last_changed: this.$fireStoreObj.FieldValue.serverTimestamp()
          };

          var isOnlineForFirestore = {
            state: "online",
            last_changed: this.$fireStoreObj.FieldValue.serverTimestamp()
          };

          this.$fireDb.ref(".info/connected").on("value", snapshot => {
            if (snapshot.val() == false) {
              userStatusFirestoreRef.set(isOfflineForFirestore);
              return;
            }

            userStatusDatabaseRef
              .onDisconnect()
              .set(isOfflineForDatabase)
              .then(() => {
                userStatusDatabaseRef.set(isOnlineForDatabase);
                // We'll also add Firestore set here for when we come online.
                userStatusFirestoreRef.set(isOnlineForFirestore);
              });
          });
        }
      });
    }
  },
  mounted() {
    this.realtime();
  }
};
