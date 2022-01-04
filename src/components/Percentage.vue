<template>
    <span :class="spanClass" v-if="val1 && val2">
      {{ getPercentage() }} %
    </span>
</template>
<script>

export default {
  name: "Percentage",
  data(){
    return {
      spanClass: 'text-dark'
    }
  },
  props:{
    val1: {
      type: Number,
      required: false,
      default: 0
    },
    val2: {
      type: Number,
      required: false,
      default: 0
    }
  },
  methods: {
    getPercentage() {
      if (this.val2 === 0) return
      var val =  parseFloat(this.val1 / this.val2).toFixed(2)
      if (Math.sign(val) !== -1) this.spanClass = 'text-success'
      else this.spanClass = 'text-danger'

      return val
    }
  }
};
</script>
