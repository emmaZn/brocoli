<template>
  <div style="height:600px" class="scroll">
    <v-btn block dark color="primary" class="mb-8 mt-8" @click="edit()"
      >Ajouter un nouveau produit</v-btn
    >
    <v-card v-for="(product, index) in products" class="ma-3" :key="index" :color="color(product)">
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <v-card-title class="headline"
            >{{ product.label }} - {{ product.name }}</v-card-title
          >

          <v-card-subtitle v-text="product.description"></v-card-subtitle>
          <v-card-text>
            En stock : {{ product.stock }} grammes<br />
            Prix au gramme : {{ product.price }} €
          </v-card-text>

          <v-card-actions>
            <v-btn
              class="ml-2 mt-5"
              rounded
              color="primary"
              @click="edit(product)"
            >
              Modifier
            </v-btn>
            <v-btn
              class="ml-2 mt-5"
              outlined
              rounded
              color="warning"
              @click="ask(product)"
            >
              Supprimer
            </v-btn>
          </v-card-actions>
        </div>

        <v-avatar v-if="!product.image" class="ma-3" size="200" tile>
          <v-img src="../../assets/marijuana.jpg"></v-img>
        </v-avatar>
      </div>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="1000">
      <v-card>
        <v-app-bar v-if="add" color="secondary" dark>
          Création d'un produit
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon></v-btn
          >
        </v-app-bar>
        <v-app-bar v-else color="secondary" dark>
          Edition du produit
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon></v-btn
          >
        </v-app-bar>
        <v-card-text>
          <v-text-field
            v-model="newProduct.label"
            label="Nom du produit"
            required
          ></v-text-field>
          <v-text-field
            v-model="newProduct.description"
            label="Description"
            required
          ></v-text-field>
          <v-select
            v-model="newProduct.id_category"
            label="Catégorie"
            :items="categories"
            :item-text="(item) => item.name"
            :item-value="(item) => item.id_category"
          ></v-select>
          <v-text-field
            v-model="newProduct.stock"
            label="Quantité disponible"
            required
            type="number"
            suffix="gr"
          ></v-text-field>
          <v-text-field
            v-model="newProduct.price"
            label="Prix"
            required
            type="number"
            suffix="€/gr"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="add" color="warning" text @click="addProduct()">
            Ajouter</v-btn
          >
          <v-btn v-else color="warning" text @click="updateProduct()">
            Modifier</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogConfirm" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">
          Etes-vous sur de vouloir supprimer ce produit ?
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogConfirm = false">
            Annuler
          </v-btn>
          <v-btn color="warning" text @click="remove()">
            Supprimer ce produit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    products: {},
  },
  data() {
    return {
      add: true,
      categories: [],
      dialog: false,
      dialogConfirm: false,
      toDeleteId: Number,
      newProduct: {
        id_product: Number,
        label: "",
        stock: 0,
        description: "",
        price: 0,
        photo: "",
        id_category: 1,
      },
    };
  },
  methods: {
    addProduct() {
      let url = "https://brocoliserver.herokuapp.com/products/new";
      axios
        .post(url, {
          label: this.newProduct.label,
          stock: this.newProduct.stock,
          description: this.newProduct.description,
          price: this.newProduct.price,
          photo: this.newProduct.photo,
          id_category: this.newProduct.id_category,
          id_runner: this.$store.state.runnerId,
        })
        .then((response) => {
          console.log("New Product", response.data);
          this.dialog = false;
          this.initProduct();
          this.$emit("reload");
        })
        .catch((error) => console.log("Categories error ", error));
    },
    color(product){
      if (product.stock==0) return '#E1E1E1'
      else return 'white'
    },
    edit(product) {
      let url = "https://brocoliserver.herokuapp.com/categories";
      axios
        .get(url)
        .then((response) => {
          console.log("Categories", response.data);
          this.categories = response.data;
        }) //c'est un objet
        .catch((error) => console.log("Product error ", error));
      if (product) {
        this.newProduct = product;
        console.log(this.newProduct);
        this.add = false;
      } else {
        this.add = true;
      }
      this.dialog = true;
    },
    ask(product) {
      this.toDeleteId = product.id_product;
      console.log("product Id to delete", this.toDeleteId)
      this.dialogConfirm = true;
      // let url = `https://brocoliserver.herokuapp.com/products/${product.id_product}`;
      // axios
      //   .delete(url)
      //   .then((response) => {
      //     console.log("Product deleted", response.data);

      //   }) //c'est un objet
      //   .catch((error) => console.log("error ", error));
    },
    remove() {
      let id=this.toDeleteId
      console.log("ID", id)
      let url = `https://brocoliserver.herokuapp.com/products/${id}`;
      axios
        .delete(url)
        .then((response) => {
          console.log("Product deleted", response.data)
          this.toDeleteId=0
          this.dialogConfirm=false
          this.$emit("reload")
        }) //c'est un objet
        .catch((error) => console.log("error ", error))
    },
    initProduct() {
      this.newProduct.id_product = 0;
      this.newProduct.label = "";
      this.newProduct.stock = 0;
      this.newProduct.description = "";
      this.newProduct.price = 0;
      this.newProduct.photo = "";
      this.newProduct.id_category = 1;
    },

    updateProduct() {
      let url = `https://brocoliserver.herokuapp.com/products/${this.newProduct.id_product}`;
      axios
        .put(url, {
          id: this.newProduct.id_product,
          label: this.newProduct.label,
          stock: this.newProduct.stock,
          description: this.newProduct.description,
          price: this.newProduct.price,
          photo: this.newProduct.photo,
          id_category: this.newProduct.id_category,
          idRunner: this.$store.state.runnerId,
        })
        .then((response) => {
          console.log("Updated Product", response.data);
          this.dialog = false;
          this.initProduct();
          this.$emit("reload");
        })
        .catch((error) => console.log("Product error ", error));
    },
  },
};
</script>

<style>
</style>