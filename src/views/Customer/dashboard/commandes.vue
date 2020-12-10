<template>
  <div class="commande-container">
    <img src="../../../assets/logoBlanc.svg" class="white-logo" />
    <div class="test">
     <div class="menu-container">
        <v-menu-client></v-menu-client>
      </div>
      <v-historique></v-historique>
    </div>
  </div>
</template>

<script>
import VHistorique from '@/components/DashboardClient/VHistorique';
import VMenuClient from '@/components/DashboardClient/VMenuClient.vue'
export default {
  components : {
    VHistorique,
    VMenuClient 
    
    }
};
</script>

<style lang="scss" scoped>

.commande-container {
  height: 100%;
  min-width: 100%;
  background: linear-gradient(180deg, #ffd1d1 0%, #ffaaaa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .test {
    background: white;
    height: 85vh;
    width: 90vw;
    border-radius: 25px; 
  }
}
.white-logo {
  position: absolute;
  width: 10vmin;
  top: 3vh;
}
.menu-container {
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 767px) and (max-height: 1027px){

  .commande-container {
    .test {
      background: white;
      border-radius: 20px;
      padding: 10px; 
    }
  }
  .test {
    margin-top: 3vh;
    // min-height: 98%!important;
    height: auto!important;
    min-height: 90vh!important;

  }
  .white-logo{
    top:2vh;
    width: 15vmin;
  }

}
</style>
