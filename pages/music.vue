<template>
    <div class="music-credits">
        <MusicCreditTab subFolder="movies" :tabTitle="$t('musicCreditsTabs.movies')" />
        <MusicCreditTab subFolder="musicals" :tabTitle="$t('musicCreditsTabs.musicals')" />
        <MusicCreditTab subFolder="games" :tabTitle="$t('musicCreditsTabs.games')" />
        <MusicCreditTab subFolder="albums" :tabTitle="$t('musicCreditsTabs.albums')" />
        <MusicCreditTab subFolder="singles" :tabTitle="$t('musicCreditsTabs.singles')" />
        <MusicCreditTab subFolder="unfinished" :tabTitle="$t('musicCreditsTabs.unfinished')" />
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
                title: "[WIP] Matteo Dell'Acqua | Music"
            }
        }
    }
</script>