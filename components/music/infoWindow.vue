<template>
    <div class="additional-info-tab">
        <h1>{{ title }}</h1>
        {{ description }}
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
        },
        computed: {
            title() {
                return this.data.lang[this.$i18n.locale].title;
            },
            description() {
                return this.data.lang[this.$i18n.locale].description;
            }
        }
    }
</script>

<style>
.additional-info-tab {
    background-color: darkgrey;
}
</style>