<template>
  <div class="container">

    <v-navigation-drawer v-model="drawer" class="onglet" temporary app right width="500">
      <v-list three-line>
        <v-list-item
          v-for="notif in notifications"
          :key="notif.id_notification"
        >
          <v-list-item-content
            class="pink--text"
            :style="'background-color:' + notif.color"
          >
            <v-list-item-title v-text="notif.head"></v-list-item-title>
            <v-list-item-subtitle v-text="notif.text"></v-list-item-subtitle>
            <v-divider class="mt-2"></v-divider>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-fab-transition>
      <v-btn
        :color="color()"
        style="align-self: flex-end"
        class="mr-10 mb-16 fab"
        dark
        bottom
        right
        fab
        @click="updateNotifications"
      >
        <v-icon>mdi-alarm-light-outline </v-icon>
      </v-btn>
    </v-fab-transition>
    <v-row justify="center">
    <img src="../../assets/logoBlanc.svg" alt="" class="white-logo" />
    
    <div class="wrapper">
      <div class="menu-container">
        <v-menu-client></v-menu-client>
      </div>
      <!-- <div class="flex"> -->
      <div class="title-select">
        <h1>Autour de chez moi :</h1>
        <div class="select-wrapper">
          <v-select
            ref="addr"
            class="select-accueil"
            v-model="adresse"
            label="Changer l'adresse"
            required
            :items="customers"
            :item-text="(item) => item.road + ' ' + item.zip + ' ' + item.nom"
            :item-value="(item) => item"
            @change="search"
          ></v-select>
          <v-select
            class="select-accueil"
            width="12"
            :items="items"
            :item-text="item=>item.text"
            :item-value="item=>item.value"
            label="Trier par : "
            v-model="selectValue"
          >
          </v-select>
        </div>
      </div>

      <!-- </div> -->
      <div class="runner-cards">
        <v-card
          v-for="runner in orderBy(runnersTable, selectValue)"
          :key="runner.id_product"
          class="card-runner ma-5"
          style="border-radius:25px"
          width = "250"
        >
          <v-img
            v-if="runner.name == 'Fines Herbes'"
            height="200"
            width="250"
            src="../../assets/musk.jpeg"
          ></v-img>
          <v-img
            v-if="runner.name == 'Champignons'"
            height="200"
            width="250"
            src="../../assets/toad.jpg"
          ></v-img>
          <v-img
            v-if="runner.name == 'Vitamines'"
            height="200"
            width="250"
            src="../../assets/bad.jpg"
          ></v-img>
          <v-card-title>
            {{ runner.label }}
          </v-card-title>
          <v-card-subtitle>
            {{ runner.name }} <br />
            {{ runner.price }} €/gr <br>
            {{runner.description}}
          </v-card-subtitle>

          <v-card-text>
            <v-icon>mdi-moped</v-icon> {{ runner.firstname }}
            {{ runner.lastname }} <br />
            Stock : {{ runner.stock }} gr<br />
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              dark
              color="pink"
              rounded
              class="mr-4"
              @click="commander(runner, runner.id_runner)"
            >
              Commander</v-btn
            >
          </v-card-actions>
        </v-card>
        <span v-if="empty" class=""><v-icon color="secondary" class="mb-2 mr-2 ml-2">mdi-emoticon-sad-outline</v-icon>{{ empty }}</span>
      </div>
      <v-dialog v-model="dialog" max-width="1000">
        <v-card class="dialog">
          <v-app-bar color="secondary" dark>
            Commander du {{ commande.name_product }}
            <v-spacer />
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon></v-btn
            >
          </v-app-bar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="commande.quantity"
                :label="'Quantité (' + commande.max_quantity + ')'"
                required
                type="number"
                min="0"
                :max="commande.max_quantity"
                class="quantite-commande"
              ></v-text-field>
              <p>
                Prix :
                <span v-if="commande.quantity"
                  >{{
                    (commande.prix = commande.quantity * commande.prix_init)
                  }}
                </span>
                <span v-else>
                  0
                </span>
                  €
              </p>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" text @click="orderPruduct()">
                  commander</v-btn
                >
              </v-card-actions>
            </v-form>
            <span v-if="message" class="alert">
              <img
                id="warning-icon"
                src="../../assets/warning.svg"
                alt="warning logo"
              />{{ message }}
            </span>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-if="!$store.state.addrCustomerId" v-model="dialogConfirm" class="dialog" persistent max-width="600">
        <v-card class="carte">
          <v-app-bar dark color="primary">
            Bienvenue sur l'application !
          </v-app-bar>
          <v-card-title>
            Commencez par choisir l'adresse à laquelle vous souhaitez etre
            livré(e) :</v-card-title
          >
          <v-row justify="center" class="ma-0 pa-0">
            <v-select
              ref="addr"
              class="select-accueil"
              v-model="adresse"
              label="Adresse de livraison"
              required
              :items="customers"
              :item-text="(item) => item.road + ' ' + item.zip + ' ' + item.nom"
              :item-value="(item) => item"
              @change="search"
            ></v-select>
          </v-row>
          <v-card-title> Ou ajoutez une nouvelle adresse :</v-card-title>
          <v-row justify="center" class="ma-0 pa-0">
            <router-link :to="{ name: 'Client Profil' }">
              <v-btn color="warning" dark>Créer une nouvelle adresse</v-btn>
            </router-link>
          </v-row>

          <v-card-actions>
            <v-spacer />
          </v-card-actions> </v-card
      ></v-dialog>
    </div>
    </v-row>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VMenuClient from "@/components/DashboardClient/VMenuClient";
import Vue2Filters from "vue2-filters";

Vue.use(Vue2Filters);
export default {
  mixins: [Vue2Filters.mixin],
  name: "dashboard",
  components: {
    VMenuClient,
  },

  data() {
    return {
      adressDialog: false,
      empty: "",
      drawer: false,
      dialogConfirm: true,
      valid: false,
      items: [
        {
          value: "name",
          text: "Catégorie",
        },
        { 
          value: "price", 
          text: "Prix" 
        },
      ],
      selectValue: "",
      message: null,
      customers: [
        {
          firstname: "",
          lastname: "",
        },
      ],
      commande: [
        {
          id_runner: null,
          id_address: null,
          id_product: null,
          date: null,
          quantity: null,
          prix: null,
          max_quantity: null,
          name_product: "",
          prix_init: null,
          addrRunner: null,
        },
      ],
      id: null,
      id_department: 1,
      runners: [],
      dialog: false,
      notifications: [],
      runnersTable: [],
      adresse: [],
      object: {
        id_department: "",
        road: "",
        zip: "",
      },
      CodePostalRules: [
        (v) =>
          /^(([0-8][0-9])|(9[0-5]))[0-9]{3}$/.test(v) || "Code Postal Valide",
      ],
      required: [(v) => !!v || "requis"],
      headers: [
        { text: "Rue", value: "name" },
        { text: "Code postal", value: "name" },
        { text: "Département", value: "name" },
      ],
      // required: [(v) => !!v || "requis"],
    };
  },
  mounted() {
    // si l'utilisateur est pas connecté rentourne à l'accueil
    if (!this.$store.state.customerId) {
      this.$router.push("/");
    } 
    if (this.$store.state.addrCustomerId){
      this.adresse.id_department
    }
    else {

      this.id = this.$store.state.customerId;
      // On recupere les info de l'utilisateur pour pouvoir les afficher
      let url = `http://brocoliserver.herokuapp.com/customers/${this.id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            axios
              .get(`http://brocoliserver.herokuapp.com/notifications/${this.id}`)
              .then((response2) => {
                if (response2.data) {
                  this.notifications = response2.data;
                  console.log(this.notifications);
                  this.notifications.forEach((notif) => {
                    if (!notif.read) {
                      notif.color = "pink";
                    } else notif.color = "white";
                  });
                }
              });
            this.customers = response.data;
            // console.log("customer", this.customers);
            // this.search();
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
    }

    this.date();
    // this.findAddr()
  },
  methods: {
    date() {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
      let hh = today.getHours();
      let m = today.getMinutes();
      let ss = today.getSeconds();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      if (hh < 10) {
        hh = "0" + hh;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (ss < 10) {
        ss = "0" + ss;
      }
      this.commande.date =
        yyyy + "-" + mm + "-" + dd + " " + hh + ":" + m + ":" + ss;
    },
    color() {
      let value = false;
      this.notifications.forEach((element) => {
        if (!element.read) value = true;
      });
      if (value) return "pink";
      else return "grey";
    },
    // fonction de deconnexion
    logout() {
      this.$store.commit("logoutCustomer");
      this.$router.push("/");
    },
    updateNotifications() {
      this.drawer = !this.drawer;
      axios
        .put(`http://brocoliserver.herokuapp.com/notifications/update/${this.id}`)
        .then((response) => {
          if (response.data) {
            console.log("read notifications");
          }
        });
    },
    newAdress() {},
    search() {
      this.runnersTable = [];
      let url = `http://brocoliserver.herokuapp.com/runners/from/${this.adresse.id_department}`;
      this.commande.id_address = this.adresse.id_address;
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            console.log("RUNNERs", response.data);
            this.runners = response.data;
            this.runners.forEach((element) => {
              element.products.forEach((product) => {
                let item = product;
                item.firstname = element.firstname;
                item.lastname = element.lastname;
                this.runnersTable.push(item);
              });
            });
            this.empty = null;
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
          this.empty =
            "Votre département ne dispose pas de livreur ! Miguel arrive bientôt !";
          //ajouter un message si null
        });
        this.dialogConfirm = false;
    },
    commander(produit, runner) {
      this.commande.name_product = produit.label;
      this.commande.id_product = produit.id_product;
      this.commande.max_quantity = produit.stock;
      this.commande.prix_init = produit.price;
      this.commande.id_runner = runner;
      this.commande.addrRunner;
      this.dialog = true;
      // console.log(this.runnersTable)
    },
    orderPruduct() {
      let url = "http://brocoliserver.herokuapp.com/orders/add";
      if (this.commande.quantity == 0) {
        this.message = "Vous ne pouvez pas commander 0g";
        return this.message;
      }
      if (this.commande.quantity > this.commande.max_quantity) {
        this.message = "Il n'y a pas assez de stock";
        return this.message;
      }
      if (this.$refs.form.validate()) {
        axios
          .post(url, {
            id_runner: this.commande.id_runner,
            id_customer: this.$store.state.customerId,
            id_address: this.commande.id_address,
            id_product: this.commande.id_product,
            date: this.commande.date,
            workflow: "En attente",
            qtte: this.commande.quantity,
            prix: this.commande.prix,
          })
          .then((response) => {
            console.log("COMMANDE", response);
            //faire une fonction reload
          })
          .catch((error) => {
            console.log("PAS COMMANDE", error);
            this.message = "bug commande";
          });

        url = `http://brocoliserver.herokuapp.com/productsOrder/${this.commande.id_product}`;
        axios
          .put(url, {
            id: this.commande.id_product,
            stock: this.commande.quantity,
          })
          .then((response) => {
            console.log("PRODUCT ", response.data);
            this.address = response.data;
          })
          .catch((error) => {
            console.log("ERREUR", error);
          });
        this.$router.push("/client/commandes");
        this.dialog = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  min-width: 100%;
  background: linear-gradient(180deg, #ffd1d1 0%, #ffaaaa 100%);
  padding: 0px !important;
  align-items: center;
  justify-content: center;
  .wrapper {
    background-color: white;
    height: 85vh;
    width: 90vw;
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    align-content: center;
    .menu-container {
      width: auto;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.white-logo {
  position: absolute;
  width: 10vmin;
  top: 8vh;
}
.alert {
  margin-top: 2em;
  // width: 60vmin;
  color: white;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border: solid 1px red;
  padding: 0.2em;
  background-color: red;
  border-radius: 5px;
  #warning-icon {
    width: 1.5em;
    margin-right: 0.5em;
  }
}

.runner-cards {
  width: 90vw;
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  justify-content: left;
  // .card-runner {
  //   width: 15vw;
  //   height: 20vh;
  //   margin: 2.2vw;
  // }
}

.v-input {
  margin: 0px;
  padding: 0px;
  display: block !important;
  max-width: 20%;
  flex: none !important;
}
.title-select {
  padding: 2.5vmin;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 20vmin;
  width: 50%;
}
.select-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 2vh;
}
.select-accueil {
  min-width: 15vw;
}
@media screen and (max-width: 600px) {
  .onglet{
    width:80vw !important;
  }
  h1{
    margin-top:110px!important;
    font-size:1.5em;
  }
  .fab{
    margin:8px !important;
  }
  .white-logo {
    width: 100px;
    top: 4vh;
  }
  .title-select{
    width:auto;
  }
    .dialog {
          width:fit-content!important;
    }
    .v-input {
    max-width: 48%;
  }
    .carte {
      // width:300px!important;
      justify-content: center;
    }
    .v-dialog{
      width:fit-content!important;

    }
    .v-dialog__content{
      width:fit-content!important;
    }
    .v-overlay__scrim{
      position:relative!important;
    }
    .runner-cards{
      width: 90vw;
      display: flex;
      overflow-y:hidden;
      justify-content: center;
      margin-top:50px;
    }
    .container {
      overflow-x:hidden;
    .wrapper {
      height: auto!important;
      width: 93vw;
      display: flex;
      align-content: center;
      .menu-container {
        width: auto;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .quantite-commande {
    margin-top: 4vh;
    max-width: 100%!important;
  }
}
</style>
