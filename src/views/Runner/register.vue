<template>
  <div class="home">
    <div class="header">
      <router-link :to="{ name: 'Home' }">
        <button class="rounded rounded-left">Client ?</button>
      </router-link>
      <img
        class="logo"
        src="../../assets/logoBlanc.svg"
        alt="icone de feuille de canabis kawaii"
      />
      <router-link :to="{ name: 'Connexion Partenaire' }">
        <button class="rounded rounded-right">Déjà inscrit ?</button>
      </router-link>
    </div>
    <h1 class="title">Just Smoke It</h1>
    <v-form-inscription-runner></v-form-inscription-runner>
    <!-- credits : GoodKatz -->
    <svg
      class="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g class="parallax">
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="0"
          fill="rgba(111, 206, 145, 0.5)"
        />
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="3"
          fill="rgba(255, 255, 255, 1)"
        />
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="5"
          fill="rgba(111, 206, 145, 0.7)"
        />
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="7"
          fill="rgba(111, 206, 145, 1)"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import axios from "axios";
import VFormInscriptionRunner from "../../components/Runner/VFormInscriptionRunner.vue";

export default {
  components: { VFormInscriptionRunner },
  data: () => ({
    valid: false,
    value1: String,
    value2: String,
    object: {
      mail: "",
      password: "",
      repassword: "",
      phone: "",
      firstname: "",
      lastname: "",
      image: "",
      departmentsIds: [],
    },
    message: "",
    departments: [],
    PhoneRules: [
      (v) =>
        /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/.test(
          v
        ) || "Numéro incorrect",
    ],
    emailRules: [
      (v) => !!v || "E-mail requis",
      (v) => /.+@.+\..+/.test(v) || "E-mail non valide",
    ],
    required: [(v) => !!v || "requis"],
  }),
  mounted() {
    if (this.$store.state.runnerId) {
      this.$router.push("/partenaire/profil");
    }
    let url = "https://brocoliserver.herokuapp.com/departments";
    axios
      .get(url)
      .then((response) => {
        // console.log("Departements", response.data);
        this.departments = response.data;
      }) //c'est un objet
      .catch((error) => console.log(console.log("Departments error ", error)));
  },

  methods: {
    register() {
      let url = "https://brocoliserver.herokuapp.com/runners/register";
      if (this.object.password != this.object.repassword) {
        return (this.message = "Le mot de passe est invalide");
      }
      if (!this.object.departmentsIds.length) {
        return (this.message =
          "Veuillez rentrer les départements dans lesquels vous travaillez");
      }
      if (this.$refs.form.validate()) {
        axios
          .post(url, {
            mail: this.object.mail,
            password: this.object.password,
            phone: this.object.phone,
            firstname: this.object.firstname,
            lastname: this.object.lastname,
            image: this.object.image,
            departmentsIds: this.object.departmentsIds,
          })
          .then((response) => {
            console.log("INSCRIT", response.data);
            this.$store.commit("loginRunner", response.data.id_runner);
            this.$router.push("/partenaire/profil");
          }) //c'est un objet
          .catch((error) => {
            console.log("PAS INSCRIT", error);
            this.message = "Vous etes déjà inscrit !";
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$color1-btn: #ffaaaa;

.home {
  height: 100%;
  padding: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #9bc9ff 0%, #515bae 100%);

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  .rounded {
    font-family: Rubik, sans-serif;
    margin: 2em;
    font-size: 1.5em;
    border: solid 2px rgba(111, 206, 145, 1);
    color: white;
    width: 20vmin;
    border-radius: 50px !important;
    height: 2em;
    outline: none;
    transition: 300ms;
    background-color: rgba(111, 206, 145, 1);
    &:hover {
      color: rgba(111, 206, 145, 1);
      background-color: white;
    }
  }
  .rounded-left {
    background-color: #ffaaaa;
    border: #ffaaaa;
    &:hover {
      color: #ffaaaa;
      background-color: white;
    }
  }
}
.title {
  font-weight: 900;
  font-size: 5vmin !important;
  font-family: "Poppins", sans-serif !important;
  color: white;
  margin-top: 3vh;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.4);
}

//logo animation

@keyframes popLogo {
  0% {
    transform: scale(0);
  }
  25% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }
  70% {
    transform: scale(1);
  }
  85% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.logo {
  height: 10em;
  margin-top: 3vh;
  animation: 1s ease-in-out 0s 1 popLogo;
}
// Waves and waves animation, credits : GoodKatz (https://codepen.io/goodkatz/details/LYPGxQz)
.waves {
  margin: 0px;
  position: absolute;
  bottom: 0px;
  height: 12vh;
  width: 100%;
}
.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 25s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 20s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 15s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 12s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
</style>