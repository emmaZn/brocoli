<template>
  
  
  <div class="addr_container">
    <div class="flex">
      <h1 class="adrr-title">Mes adresses</h1>  
      <v-btn fab x-small dark color="secondary"  class="ml-4 " @click="addAddr()" >
        <v-icon  >
          mdi-plus 
        </v-icon>
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="customers"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template v-slot:body="{ items }">
        <tbody name="list" is="transition-group" v-if="items.length">
          <tr
            v-for="item in items"
            :key="item.id_address"
            class="item-row"
          >
            <td>{{ item.road }}</td>
            <td>{{ item.zip }}</td>
            <td>{{ item.nom}}</td>
            <td>
              <v-btn icon color="primary" class="mr-4 button" @click="updateAddr(item),dialog=true" >
                <v-icon>
                mdi-pencil
                </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <v-pagination
      v-model="page"
      color="primary"
      :length="pageCount"
    ></v-pagination>

      <v-dialog v-if="dialog" class="update-form" v-model="dialog"  max-width="1000">
        <v-card>
          <v-app-bar color="secondary" dark>
            Modifier l'adresse
            <v-spacer />
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon></v-btn
            >
          </v-app-bar>
          <v-card-text>

            <v-text-field v-model="address.road" label="Rue"></v-text-field>
            <v-text-field
              v-model="address.zip"
              label="Code postal"
            ></v-text-field>
            <v-autocomplete
              v-model="address.id_department"
              :items="departments"
              :item-text="(item) => item.code + ' - ' + item.nom"
              :item-value="(item) => item.id_department"
              chips
              label="Departement"
            ></v-autocomplete>
          <v-btn color="primary" class="mr-4 button" @click="update(),dialog=false" >
            Modifier</v-btn
          >
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-if="addressDialog" class="update-form" v-model="addressDialog"  max-width="1000">
        <v-card class="">
          <v-app-bar color="secondary" dark>
            Ajouter une adresse
            <v-spacer />
            <v-btn icon @click="addressDialog = false">
              <v-icon>mdi-close</v-icon></v-btn
            >
          </v-app-bar>
          <v-form class="pa-4" ref="formAdd" v-model="valid" lazy-validation>

            <v-text-field
                v-model="object.road"
                :rules="required"
                label="Rue"
                required
            ></v-text-field>
            <v-text-field
            v-model="object.zip"
            :rules="CodePostalRules"
            label="Code Postal"
            required
            ></v-text-field>
            <v-autocomplete
                v-model="object.id_department"
                :items="departments"
                :item-text="(item) => item.code + ' - ' + item.nom"
                :item-value="(item) => item.id_department"
                chips
                :rules="required"
                required
                label="Departement"
                
            ></v-autocomplete>

            <v-btn color="primary" class="mr-4" @click="add(),addressDialog=false" >
              Ajouter</v-btn
            >
          </v-form>
        </v-card>
      </v-dialog>
  
  
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      addressDialog: null,
      dialog:false, 
      dialog1:false, 
      valid: false,
      address: [],
      message: "",
      departments: [],
      customers: [
        {
          firstname: "",
          lastname: "",
        },
      ],
      id: null,
      id_department: 1,
      object: {
        id_department: "",
        road: "",
        zip: "",
      },
      CodePostalRules:[
          (v) => /^(([0-8][0-9])|(9[0-5]))[0-9]{3}$/.test(v) || "Code Postal Valide", 
      ], 
      required: [(v) => !!v || "requis"],
      headers: [
        { text: "Rue", value: "road" },
        { text: "Code postal", value: "zip" },
        { text: "Département", value: "nom" },
        {text:"",value:"", align:'right'}
      ],
    };
  },
  mounted() {
    // si l'utilisateur est pas connecté rentourne à l'accueil
    this.id = this.$store.state.customerId;
    // On recupere les info de l'utilisateur pour pouvoir les afficher
    this.loadCustomer()
    this.getDepartments()
  },

  methods: {
    handleClick(e) {
      // console.log("order", e);
      this.customers = {
        nom: e.nom,
        road: e.road,
        zip: e.zip,
      };
      this.dialogConfirm = true;
    },
    loadCustomer() {
      let url = `http://brocoliserver.herokuapp.com/customers/${this.id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            console.log("Customer", response.data)
            this.customers = response.data;
            // this.search();
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
    },
    getDepartments() {
      let  url = "http://brocoliserver.herokuapp.com/departments";
      axios
        .get(url)
        .then((response) => {
          // console.log("Departements", response.data);
          this.departments = response.data;
        }) //c'est un objet
        .catch((error) => console.log(("Departments error ", error)));
    },
    // fonction de deconnexion
    logout() {
      this.$store.commit("logoutCustomer");
      this.$router.push("/");
    },
    add() {
      // fait appel a la requete add de l'api
      let url = "http://brocoliserver.herokuapp.com/addrCustomer/add"
      console.log(this.object)
      // if (this.$refs.formAdd.validate()) {
          axios
          .post(url, {
              road: this.object.road,
              zip: this.object.zip,
              id_department: this.object.id_department,
              id_customer: this.$store.state.customerId
          })
          .then(() => {
            this.loadCustomer()

          })
            //c'est un objet
          .catch((error) =>{
              console.log("PAS Ajouter:", error)
              this.message = "Erreur"
          })
      // }
    },
    // fonction pour update un adresse
    addAddr() {
      this.object = []
      this.addressDialog = true
    },
    update() {
      let url = `http://brocoliserver.herokuapp.com/addrCustomer/${this.address.id_address}`;
      // console.log(url);
      axios
        .put(url, {
          road: this.address.road,
          zip: this.address.zip,
          id_department: this.address.id_department,
        })
        .then(() => {
            this.loadCustomer()
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
      this.$store.commit("removeAddrCustomer");
      // document.location.reload(); 
    },
    updateAddr(customer) {
      console.log(customer)
      this.address = customer
    },
    // fonction poour modifier le mail, le numero de tel et le password
    updateProfil() {
      this.$router.push({ name: "UpadteProfilClient" });
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
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@600&display=swap');

.addr_container{
  margin-top: 4vh;
}

.flex {
  display: flex;
  align-items: center;
}

@media screen and (max-width: 767px) and (max-height: 1027px) {
  .addr_container{
    margin-top: 0;
  }
  tbody,th,td {
    padding: 1px!important;
  }
  h1 {
      font-size: 1.7em;
    }
}
</style>


