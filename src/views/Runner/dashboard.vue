<template>
  <div
    style="
      background: linear-gradient(180deg, #9bc9ff 0%, #515bae 100%);
      height: 100%;
    "
  >
    <v-row>
      <v-spacer />
      <v-menu offset-y min-width="260" class="mr-10 mt-5">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            rounded
            v-on="on"
            x-large
            class="arrow-btn mr-10 mt-5"
            width="260"
            @click="rotate()"
          >
            <img
              width="50"
              height="50"
              class="mr-3"
              src="../../assets/avatar.png"
              alt="photo de profil"
            />
            {{ runner.lastname }}
            {{ runner.firstname }}
            <div class="pl-2">
              <svg
                id="arrow"
                width="20"
                height="51"
                viewBox="0 0 44 51"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32.9061 35.564L21.9373 22.8626L10.9686 35.564L6.58105 33.0237L21.9373 15.2417L37.2936 33.0237L32.9061 35.564Z"
                  fill="#000000"
                />
              </svg>
            </div>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            ><v-btn text class="link" @click="logout()"
              >Se deconnecter</v-btn
            ></v-list-item
          >
        </v-list>
      </v-menu>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" lg="10" md="10" class="mt-14">
      <img src="../../assets/logoBlanc.svg" alt="" class="white-logo" />
        <v-card height="750" style="border-radius: 25px" class="pt-10"
          ><v-tabs grow color="#515bae" v-model="tab" align-with-title>
            <v-tabs-slider color="#515bae"></v-tabs-slider>
            <v-tab class="ma-0"> Commande </v-tab>
            <v-tab> Produit </v-tab>
            <v-tab> Profil </v-tab>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-order :orders="runner.orders" :runner="runner" @reload="reload()"></v-order>
              </v-tab-item>
              <v-tab-item>
                <v-product :products="products" @reload="reload()"></v-product>
              </v-tab-item>
              <v-tab-item>
                <v-profil
                  :runner="runner"
                  @update="update"
                  @logout="logout"
                ></v-profil>
              </v-tab-item>
            </v-tabs-items> </v-tabs
        ></v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import VProfil from "../../components/Runner/VProfil";
import VProduct from "../../components/Runner/VProduct";
import VOrder from "../../components/Runner/VOrder";
export default {
  components: {
    VProfil,
    VProduct,
    VOrder,
  },
  data() {
    return {
      tab: null,
      runner: {},
      products: [],
    };
  },
  mounted() {
    const moment = require("moment");
    if (!this.$store.state.runnerId) {
      this.$router.push("/");
    } else {
      let id = this.$store.state.runnerId;
      let url = `https://brocoliserver.herokuapp.com/runners/${id}`;

      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            console.log("RUNNER", response.data);
            this.runner = response.data;
            this.runner.orders.forEach((order) => {
              order.name = order.lastname + " " + order.firstname;
              order.date = moment(order.date).format("DD/MM/YYYY");
            });
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
      let url2 = `https://brocoliserver.herokuapp.com/products/${this.$store.state.runnerId}`;
      axios
        .get(url2)
        .then((response) => {
          if (response.data) {
            console.log("Products", response.data);
            this.products = response.data;
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
    }
  },
  methods: {
    logout() {
      this.$store.commit("logoutRunner");
      this.$router.push("/");
    },
    reload() {
      const moment = require("moment");
      console.log("reload");
      let id = this.$store.state.runnerId;
      let url = `https://brocoliserver.herokuapp.com/runners/${id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            console.log("RUNNER", response.data);
            this.runner = response.data;
            this.runner.orders.forEach((order) => {
              order.name = order.lastname + " " + order.firstname;
              order.date = moment(order.date).format("DD/MM/YYYY");
            });
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
      let url2 = `https://brocoliserver.herokuapp.com/products/${this.$store.state.runnerId}`;
      axios
        .get(url2)
        .then((response) => {
          if (response.data) {
            console.log("Products", response.data);
            this.products = response.data;
          } else this.products = [];
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
      console.log("reload ended");
    },
    rotate() {
      let arrow = document.getElementById("arrow");
      console.log("arrow", arrow);
      if (arrow.style.transform == "rotate(180deg)")
        arrow.style.transform = "rotate(0deg)";
      else {
        arrow.style.transform = "rotate(180deg)";
      }
    },
    update(newRunner) {
      console.log("New Runner", newRunner);
      let url = `https://brocoliserver.herokuapp.com/runners/${this.runner.id_runner}`;
      if (newRunner.password) {
        axios
          .put(url, {
            id_runner: this.runner.id_runner,
            mail: newRunner.mail,
            phone: newRunner.phone,
            password: newRunner.password,
          })
          .then((response) => {
            console.log("Runner updated", response.data);
          }) //c'est un objet
          .catch((error) => {
            console.log("erreur", error);
          });
      } else {
        axios
          .put(url, {
            id_runner: this.runner.id_runner,
            mail: newRunner.mail,
            phone: newRunner.phone,
          })
          .then((response) => {
            console.log("Runner updated", response.data);
          }) //c'est un objet
          .catch((error) => {
            console.log("erreur", error);
          });
      }
      axios({
        method: "DELETE",
        url: `https://brocoliserver.herokuapp.com/deliveries/${this.runner.id_runner}`,
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        axios
          .post("https://brocoliserver.herokuapp.com/deliveries/create", {
            id_runner: this.runner.id_runner,
            departmentsIds: this.runner.departmentsIds,
          })
          .then(() => {
            this.reload();
          });
      });
    },
  },
};
</script>

<style scoped>
body {
}
#avatar {
  position: absolute;
  left: 11%;
  top: 8%;
  z-index: 5;
}
.white-logo {
  height: 10vmin;
  width: 10vmin;
  top:8%;
  left:48%;
  position: absolute;
  z-index:10
}
/* button {
  position: absolute;
  right: 2%;
  top: 3%;
} */
.scroll {
  overflow-y: scroll;
}
.v-menu__content {
  border-radius: 50px;
}
</style>