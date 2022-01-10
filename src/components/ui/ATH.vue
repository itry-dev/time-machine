<template>
    <span class="h3">
        All time high: {{ $getFormattedCurrency(parseFloat(ath),'USD') }}
    </span>
</template>
<script>
export default {
    name: 'AllTimeHigh',
    props: {
        ath:{
            type: Number,
            required: true
        }
    }
}
</script>