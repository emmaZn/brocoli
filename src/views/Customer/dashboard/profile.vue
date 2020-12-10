<template>
  <div class="container">
    <img src="../../../assets/logoBlanc.svg" class="white-logo" />

    <div class="wrapper">
      <div class="menu-container">
        <v-menu-client></v-menu-client>
      </div>
      <div class="body-wrapper">
        <v-profile-infos></v-profile-infos>
        <v-profile-address></v-profile-address>
      </div>
      
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VMenuClient from "@/components/DashboardClient/VMenuClient";
import VProfileAddress from "../../../components/DashboardClient/VProfileAddress.vue";
import VProfileInfos from "../../../components/DashboardClient/VProfileInfos.vue";
export default {
  name: "dashboard",
  components: {
    VMenuClient,
    VProfileAddress,
    VProfileInfos,
  },

  data() {
    VMenuClient;
    return {
      valid: false,

      message: "",
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
        },
      ],
      id: null,
      id_department: 1,
      runners: [],
      dialog: false,
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
      let url = `http://brocoliserver.herokuapp.com/customers/${this.id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            // console.log("ADDRCUSTOMER", response.data)
            this.customers = response.data;
            this.search();
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
    }
  },
  methods: {
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
        url: `http://brocoliserver.herokuapp.com/addrCustomers/${id}`,
        headers: { "Content-Type": "application/json" },
      });
      this.reloadAddr();
    },
    reloadAddr() {
      let url = `http://brocoliserver.herokuapp.com/customers/${this.id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            // console.log("ADDRCUSTOMER", response.data)
            this.customers = response.data;
            this.search();
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
    },
    search() {
      let url = `http://brocoliserver.herokuapp.com/runners/from/${this.customers[0].id_department}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            // console.log("RUNNERs", response.data)
            this.runners = response.data;
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
      this.dialog = true;
    },
    orderPruduct() {
      // console.log('ADRESSE ', this.commande.id_address)
      let url = "http://brocoliserver.herokuapp.com/orders/add";
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

        // if (this.) {}
        url = `http://brocoliserver.herokuapp.com/productsOrder/${this.commande.id_product}`;
        axios
          .put(url, {
            id: this.commande.id_product,
            stock: this.commande.quantity,
          })
          .then((response) => {
            if (response.data) {
              console.log("PRODUCT ", response.data);
              // this.address = response.data
            }
          })
          .catch((error) => {
            console.log("ERREUR", error);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0px !important;
  min-width: 100%;
  min-height: 100%;
  background: linear-gradient(180deg, #ffd1d1 0%, #ffaaaa 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .wrapper {
    background: white;
    border-radius: 25px;
    display: block;
    height: 80%;
    width: 90%;
  }
}
.white-logo {
  position: absolute;
  width: 10vmin;
  top: 6vh;
}
.menu-container {
  display: flex;
  justify-content: flex-end;
}
.body-wrapper{
  padding: 2vmin;
}


@media screen and (max-width: 767px) and (max-height: 1027px) {
  .wrapper {
    margin-top: 3vh;
    min-height: 98%!important;
  }
  .white-logo{
    top:2vh;
    width: 15vmin;
  }
}
</style>
