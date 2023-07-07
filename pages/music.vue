<template>
    <div class="music-credits">
        <MusicCreditTab subFolder="movies" :tabTitle="this.musicCreditsTabs.movies" />
        <MusicCreditTab subFolder="live" :tabTitle="this.musicCreditsTabs.live" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: "MusicPage"
        }
    },
    head() {
        return {
            title: `[WIP] Matteo Dell'Acqua | ${this.$t('navbar.music')}`,
            meta: [
                {name: 'description', hid: 'description', content: this.$t('descriptions.music')}
            ]
        }
    },
    async asyncData(context) {
        const musicCreditsTabs = context.app.i18n.t('musicCreditsTabs');
        return {musicCreditsTabs}
    }
}
</script>