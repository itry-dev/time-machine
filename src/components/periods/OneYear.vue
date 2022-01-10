<template>
<div class="row" v-if="cryptoData.name !== ''">
    <div class="text-center">
        <img :src="cryptoData.imageUrl" />
    </div>
    <h1 class="display-5 fw-bold">
        {{ cryptoData.name }}        
    </h1>
    <div class="col">
        <ATH :ath="cryptoData.allTimeHighUSD" />
        <table class="table">
            <thead>
                <tr>
                <th scope="col">Date</th>
                <th scope="col">Rate</th>
                <th scope="col">Market Cap</th>
                <th scope="col">Volume</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(ch, index) in cryptoData.history" :key="index">
                    <td>
                        {{ $getFormattedDate(ch.date)}}
                    </td>
                    <td>
                        {{ $getFormattedCurrency(parseFloat(ch.rate), cryptoData.currency) }}
                    </td>
                    <td>
                        {{ $getFormattedCurrency(ch.cap, cryptoData.currency) }}
                    </td>
                    <td>
                        {{ $getFormattedCurrency(ch.volume, cryptoData.currency) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>    
</template>
<script>
import ATH from '@/components/ui/ATH.vue'
export default {
    name: 'OneYear',
    props: {
        cryptoData:{
            type: Object,
            required: true
        }
    },
    components:{
        ATH
    }
}
</script>