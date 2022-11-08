<template>
    <div @click="closeTab();">
        Close Button
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: "InfoWindowCloseButton"
        };
    },
    methods: {
        closeTab() {
            this.$emit('closeTab');
        }
    }
}
</script>

<style>
</style>