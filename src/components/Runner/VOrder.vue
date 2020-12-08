<template>
  <div class="ma-16">
    <v-data-table
      :headers="headers"
      :items="orders"
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
            :key="item.id_order"
            class="item-row"
            @click="handleClick(item)"
          >
            <td>{{ item.id_order }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.date }}</td>
            <v-chip
              :color="color(item.workflow)"
              dark
              class="mt-2"
              style="width: 100px; justify-content: center"
            >
              {{ item.workflow }}
            </v-chip>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="headers.length" style="text-align: center">
              Pas de commande ? Patience, proposez vos meilleurs produit !
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <v-pagination
      v-model="page"
      color="#515bae"
      :length="pageCount"
    ></v-pagination>

    <v-dialog v-model="dialogConfirm" persistent max-width="600">
      <v-card>
        <v-app-bar color="secondary" dark>
          Commande numéro {{ order.id }} - {{ order.workflow }}
          <v-spacer />
          <v-btn icon @click="dialogConfirm = false">
            <v-icon>mdi-close</v-icon></v-btn
          >
        </v-app-bar>

        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title class="headline">
              {{ order.product.name }}</v-card-title
            >
            <v-card-text>
              Quantité commandée: {{ order.product.qtte }} grammes<br />
              Prix total : {{ order.product.total }} € <br />
              Adresse de livraison : <br />{{ order.customerName }} <br />{{
                order.road
              }}
              <br />
              {{ order.zip }}
            </v-card-text>
          </div>

          <v-avatar class="ma-3" size="200" tile>
            <v-img src="../../assets/marijuana.jpg"></v-img>
          </v-avatar>
        </div>

        <v-card-actions v-if="order.workflow == 'En attente'">
          <v-btn color="primary" dark @click="updateWorkflow('Validée')">
            Valider la commande
          </v-btn>
          <v-spacer />
          <v-btn color="warning" dark @click="updateWorkflow('Annulée')">
            Annuler la commande</v-btn
          >
        </v-card-actions>
        <v-card-actions v-if="order.workflow == 'Validée'">
          <v-spacer />
          <v-btn color="warning" dark @click="updateWorkflow('Annulée')">
            Annuler la commande</v-btn
          >
        </v-card-actions>
      </v-card></v-dialog
    >
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    orders: {},
    runner: {},
  },

  data() {
    return {
      dialogConfirm: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      order: {
        id: "",
        workflow: "",
        customerName: "",
        product: {
          name: "",
          qtte: "",
          total: "",
        },
        road: "",
        zip: "",
        id_customer: "",
      },
      headers: [
        {
          text: "n° de commande",
          align: "left",
          value: "id_order",
        },
        { text: "Client", value: "name" },
        { text: "Date", value: "date" },
        { text: "Statut", value: "workflow" },
      ],
    };
  },
  methods: {
    handleClick(e) {
      console.log("order", e);
      this.order = {
        id: e.id_order,
        workflow: e.workflow,
        customerName: e.name,
        product: {
          name: e.label,
          qtte: e.qtte,
          total: e.prix,
        },
        id_customer:e.id_customer,
        road: e.road,
        zip: e.zip,
      };
      this.dialogConfirm = true;
    },
    color(workflow) {
      if (workflow == "Validée") return "primary";
      if (workflow == "En attente") return "orange";
      if (workflow == "Annulée") return "warning";
    },
    initOrder() {
      this.order = {
        id: "",
        workflow: "",
        customerName: "",
        product: {
          name: "",
          qtte: "",
          total: "",
        },
        road: "",
        zip: "",
        id_customer: "",
      };
    },
    updateWorkflow(workflow) {
      let head;
      let text;
      if (workflow == "Annulée") {
        head = "Commande annulée";
        text =
          "Votre commande n°" +
          this.order.id +
          " a malheureusement été annulée par le livreur " +
          this.runner.firstname +
          " " +
          this.runner.lastname +
          ". \n N'hésitez pas à commander auprès d'un autre de nos partenaire.";
      }
      if (workflow == "Validée") {
        head = "Commande validée";
        text =
          "Votre commande n°" +
          this.order.id +
          " a bien été validée ! " +
          this.runner.firstname +
          " " +
          this.runner.lastname +
          " livrera votre commande d'ici peu.";
      }
      console.log(this.order)
      let url = `https://brocoliserver.herokuapp.com/order/updateWorkflow/${this.order.id}`;
      axios
        .put(url, {
          workflow: workflow,
        })
        .then(() => {
          axios
            .post(`https://brocoliserver.herokuapp.com/notification/add`, {
              head:head,
              text:text,
              id_customer: this.order.id_customer,
              read: false
            })
            .then((response) => {
              console.log("Updated Order Workflow", response.data)
              this.dialogConfirm = false
              this.initOrder()
              this.$emit("reload")
            });
        })
        .catch((error) => console.log("Order error ", error));
    },
  },
};
</script>

<style>
</style>