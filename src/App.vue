<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
// import axios from "axios";
export default {
  name: "App",

  data: () => ({
    customers: {},
    //
  }),
  asyncData() {},
  mounted() {},
  methods: {},
};
</script>
<style>
.body::-webkit-scrollbar {
  display: none;
} 
.body{
overflow: hidden;
overflow-y: hidden;
 height:100%;
   top:0;
  bottom:0;
}
h1{
  font-weight: 900;
  color: rgb(73, 73, 73);
  font-family:'Poppins', sans-serif; 
}

</style>
