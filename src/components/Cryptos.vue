<template>
<div class="offcanvas offcanvas-start text-left" tabindex="-1" id="offcanvasList" aria-labelledby="offcanvasScrollingLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasScrollingLabel">Cryptos</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div>
      Pick up a crypto.
    </div>
    <div class="mt-3">
      <ul class="list-group list-group-flush" v-for="(crypto, index) in cryptos" :key="index">
        <li class="list-group-item" data-bs-dismiss="offcanvas" @click="emit( crypto.code )">
          <div class="row">
            <div class="col-8">
              <a role="button" href="#" class="text-decoration-none text-dark align-middle">{{ crypto.name }}</a>
            </div>
            <div class="col">
              <img :src="crypto.imageLowUrl" />   
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>
<script>
import c from "@/constants"
import { mapGetters } from 'vuex' 
export default {
  name: 'Cryptos',
  computed:{
    ...mapGetters({
      cryptos: [c.VUEX.GETTERS.CRYPTOS]
    })
  },
  methods:{
    emit(val){
      this.$emit('has-clicked-crypto', val)
    }
  }
}
</script>
<style scoped>
#offcanvasList {
  text-align: left;
}
</style>