<template>
  <div class="container">
    <v-navigation-drawer v-model="drawer" absolute temporary right width="500">
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
        class="mr-10 mb-16"
        dark
        bottom
        right
        fab
        @click="updateNotifications"
      >
        <v-icon>mdi-alarm-light-outline </v-icon>
      </v-btn>
    </v-fab-transition>

    <img src="../../assets/logoBlanc.svg" alt="" class="white-logo" />
    <div class="wrapper">
      <div class="menu-container">
        <v-menu-client></v-menu-client>
      </div>
      <h1>Autour de chez moi : </h1>
      <v-select
            width="10"
              v-model="commande.id_address"
              label="Adresse de livraison"
              required
              :items="customers"
              :item-text="(item) => item.road + ' ' + item.zip + ' ' + item.nom"
              :item-value="(item) => item.id_address"
            ></v-select>
      <v-select 
            :items="items"
            label="Trier par : "
            v-model="selectValue"></v-select>
      <div class="runner-cards">
        <v-card
            v-for="runner in orderBy(runnersTable,selectValue)"
            :key="runner.id_product"
            class="card-runner"
          >
              <v-card-title>
                {{ runner.firstname }} {{ runner.lastname }}
              </v-card-title>
              <v-card-subtitle>
                {{ runner.name }}
              </v-card-subtitle>
              <p class="ma-auto">
                Produit : {{runner.label}} <br />
                En stock : {{ runner.stock }} <br />
                Prix : {{ runner.price }} €
              </p>
              <v-btn
                color="primary"
                class="mr-4"
                @click="commander(runner, runner.id_runner)"
              >
                Commander</v-btn
              >
          </v-card>
        </div>
          
          <!-- <v-row v-for="product of runner.products" :key="product.id_product">
            <v-col cols="2" v-if="runner.products.length > 0 && product.stock != 0">
              {{ runner.lastname }} {{ runner.firstname }}
            </v-col>
            <v-col cols="2" v-if="runner.products.length > 0 && product.stock != 0"> {{ product.name }} {{ product.label }}</v-col>
            <v-col cols="2" v-if="runner.products.length > 0 && product.stock != 0"> {{ product.stock }} g</v-col>
            <v-col cols="2" v-if="runner.products.length > 0 && product.stock != 0"> {{ product.price }} €/g</v-col>
            <v-btn 
              v-if="runner.products.length > 0 && product.stock != 0"
              color="primary"
              class="mr-4"
              @click="commander(product, runner.id_runner)"
            >
              Commander</v-btn
            >
          </v-row> -->
    </div>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-app-bar color="secondary" dark>
          Commander du {{ commande.name_product }}
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon></v-btn
          >
        </v-app-bar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-select
            width="10"
              v-model="commande.id_address"
              label="Adresse de livraison"
              required
              :items="customers"
              :item-text="(item) => item.road + ' ' + item.zip + ' ' + item.nom"
              :item-value="(item) => item.id_address"
            ></v-select>
            <v-text-field
              v-model="commande.quantity"
              :label="'Quantité (' + commande.max_quantity + ')'"
              required
              type="number"
              min="0"
              :max="commande.max_quantity"
            ></v-text-field>
            <p>
              Prix :
              <span v-if="commande.quantity"
                >{{
                  (commande.prix = commande.quantity * commande.prix_init)
                }}
                €</span
              >
            </p>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="orderPruduct()">
                commander</v-btn>
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
  </div>
</template>

<script>
import Vue from 'vue'
import axios from "axios";
import VMenuClient from "@/components/DashboardClient/VMenuClient";
import Vue2Filters from 'vue2-filters'; 

Vue.use(Vue2Filters); 
export default {

  mixins: [Vue2Filters.mixin],
  name: "dashboard",
  components: {
    VMenuClient,
  },

  data() {
    return {
      drawer: false,
      valid: false,
      items: ['name', 'price'],
      selectValue:'',
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
      // required: [(v) => !!v || "requis"],
    };
  },
  mounted() {
    // si l'utilisateur est pas connecté rentourne à l'accueil
    if (!this.$store.state.customerId) {
      this.$router.push("/");
    } else {
      this.id = this.$store.state.customerId;
      // On recupere les info de l'utilisateur pour pouvoir les afficher
      let url = `http://localhost:5000/customers/${this.id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            axios
              .get(`http://localhost:5000/notifications/${this.id}`)
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
            this.search();
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
    }


    // this.findAddr()
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
  methods: {
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
    // fonction pour update un adresse
    updateAddr(id) {
      this.$store.commit("addAddrCustomer", id);
      this.$router.push({ name: "UpadteAddrClient" });
    },
    updateNotifications() {
      this.drawer = !this.drawer;
      axios
        .put(`http://localhost:5000/notifications/update/${this.id}`)
        .then((response) => {
          if (response.data) {
            console.log("read notifications");
          }
        });
    },
    // fonction poour modifier le mail, le numero de tel et le password
    updateProfil() {
      this.$router.push({ name: "UpadteProfilClient" });
    },
    // fonction d'ajout d'adresse
    addAddr() {
      this.$router.push({ name: "AddAddrClient" });
    },
    // fonction de suppression d'addresse
    deleteAddr(id) {
      if (this.customers.length <= 1) {
        return (this.message = "Vous devez avoir on moins une adresse");
      }
      axios({
        method: "DELETE",
        url: `http://localhost:5000/addrCustomers/${id}`,
        headers: { "Content-Type": "application/json" },
      });
      this.reloadAddr();
    },
    reloadAddr() {
      let url = `http://localhost:5000/customers/${this.id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            // console.log("ADDRCUSTOMER", response.data)
            this.customers = response;
            this.search();
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
    },
    search() {
      let url = `http://localhost:5000/runners/from/${this.customers[0].id_department}`;
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
                this.runnersTable.push(item)
                // console.log(this.runnersTable)
              });
            });
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
    },
    commander(produit, runner) {
      this.commande.name_product = produit.label;
      this.commande.id_product = produit.id_product;
      this.commande.max_quantity = produit.stock;
      this.commande.prix_init = produit.price;
      this.commande.id_runner = runner;
      this.commande.addrRunner;
      this.dialog = true;
      console.log(this.runnersTable)
      // let url = `http://localhost:5000/adresseOrder/${this.id}/${this.commande.addrRunner}`;
      // axios
      //   .get(url)
      //   .then((response) => {
      //     if (response.data) {
      //       console.log("addr Order", response.data)
      //       // this.customers = response.data;
      //     }
      //   })
      //   .catch((error) => {
      //     console.log("ERREUR", error);
      //   });this.dialog = true;
    },
    orderPruduct() {
      let url = "http://localhost:5000/orders/add";
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

        url = `http://localhost:5000/productsOrder/${this.commande.id_product}`;
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
        this.runnersTable = []
        this.search();

        this.dialog = false;
        // document.location.reload()
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
  display: flex;
  flex-direction: column;
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
  top: 3vh;
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
  display:flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .card-runner{
    width: 25vw;
    height: 20vh;
    margin: 2.2vw;
  }
}
.v-input{
  margin: 0px;
  padding: 0px;
  display: block !important;
  max-width: 20%;
  flex: none!important;

}
</style>