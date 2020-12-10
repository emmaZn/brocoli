<template>
<div class="container">
  <div class="wrapper">
    <v-row justify="center"><h1 >Mes commandes : </h1></v-row>
     
    <v-data-table
      :headers="headers"
      :items="orders"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="elevation-1 mt-2 datas"
      @page-count="pageCount = $event"
    >
      <template v-slot:body="{ items }">
        <tbody name="list" is="transition-group" v-if="items.length">
          <tr v-for="item in items" :key="item.id_order" class="item-row" @click="handleClick(item)">
            <td class="number mt">{{ item.id_order }}</td>
            <td class="lala"><span>{{ item.firstname }} </span><span>{{ item.lastname }}</span></td>
            <td>{{ item.label }}</td>
            <td>{{ item.qtte }} gr</td>
            <td>{{ item.prix }} €</td>
            <td>{{ item.date }}</td>
            <v-chip
              :color="color(item.workflow)"
              dark
              class="mt-2 chip"
            >
                {{ item.workflow }}
            </v-chip>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="headers.length" style="text-align: center">
              Pas de commande ? <router-link :to="{name: 'Dashboard Client'}">Commandez dés maintenant !</router-link> 
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <v-pagination
      v-model="page"
      color="primary"
      :length="pageCount"
      class="mt-3"
    ></v-pagination>

  </div>
</div>

</template>

<script>
// import moment from 'moment'
import axios from "axios"

export default {
  name:'VHistorique', 
  data() {
    return {
      dialogConfirm: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      order : {
        id_order: "",
        workflow: "",
        name: "",
        label: "",
        qtte: "",
        prix: "",
        date: "",
      },
      orders : [],
      headers: [
        {
          text: "n° de commande",
          align: "left",
          value: "id_order",
        },
        { text: "Livreur", value: "name" },
        { text: "Produit", value: "label" },
        { text: "Quantité", value: "qtte" },
        { text: "Prix", value: "prix" },
        { text: "Date", value: "date" },
        { text: "Statut", value: "workflow" },
      ],
    }
  },
  mounted(){
    const moment = require('moment')
    let url = `http://brocoliserver.herokuapp.com/orders/${this.$store.state.customerId}`
    let val=false
    while(!val){
      this.sleep(2000)
      val=true
    }
    axios
    .get(url)
    .then((response) => {
        if (response.data) {
            // console.log("ADDRCUSTOMER", response.data)
            this.orders = response.data
            this.orders.forEach((order) => {
              order.date = moment(order.date).format("DD/MM/YYYY H:mm:ss");
            });
        }
    })
    .catch((error) => {
        console.log("ERREUR", error)
    })
  },
  methods: {
    handleClick(e) {
      console.log("order", e)
      this.order = {
        id_order: e.id_order,
        workflow: e.workflow,
        name: e.firstname,
        label: e.label,
        qtte: e.qtte,
        prix: e.prix,
        date: e.date
      }
      this.dialogConfirm = true
    },
    color(workflow) {
      if (workflow == "Validée") return "primary";
      if (workflow == "En attente") return "orange";
      if (workflow == "Annulée") return "warning";
    },
    initOrder() {
      this.order = {
        id_order: "",
        workflow: "",
        name: "",
        label: "",
        qtte: "",
        prix: "",
        date: "",
      }
    },
   sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }
      },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@600&display=swap');

td{
  font-family: 'rubik', sans-serif;
}
.chip{
  width: 100px; justify-content: center;
}
@media screen and (max-width: 767px) and (max-height: 1027px){
  h1{
    font-size: 1.5em;
  }
  .datas{
  }
  .container{
  padding:0px !important; 
  }
  td{
    font-weight:500; 
    font-size: 10px !important;
    padding:0px !important; 
    margin: 4p;
  }
  .chip{
    font-size: 10px;
    width: 60px; 
    justify-content: center;
  }
  .number{
    display:none; 
  }
  .lala{
    display: flex;
    flex-direction:column;
    align-items: center;
  }
  tr{
    display:flex; 
    justify-content: space-between;

  }
}
</style>