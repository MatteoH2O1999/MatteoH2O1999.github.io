<template>
    <div class="additional-info-tab">
        Test infoWindow {{ data }}
        <button @click="closeTab()">Test close</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: "InfoWindow"
            }
        },
        props: ['data'],
        methods: {
            closeTab() {
                this.$emit('closeTab');
            }
        }
    }
</script>

<style>
.additional-info-tab {
    background-color: darkgrey;
}
</style>