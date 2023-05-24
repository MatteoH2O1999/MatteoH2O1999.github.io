<template>
    <div class="additional-info-tab">
        <div class="info-window-header">
            <h2>{{ title }}</h2>
            <MusicInfoWindowCloseButton @closeTab="closeTab()" class="close-button-div" :title="this.title"/>
        </div>
        <div class="info-window-content">
            <div class="info-window-image-div">
                <nuxt-img format="webp" sizes="xs:90vw sm:90vw md:25vw lg:25vw xl:25vw xxl:25vw" :src="this.data.imgPath" class="info-window-image" :alt="this.$t('musicCreditsTabs.altPoster').concat(' ', this.title)" />
            </div>
            <div class="info-window-text">
                <div>
                    {{ description }}
                </div>
                <hr>
                <div>
                    <MusicLinks :data="this.data" />
                </div>
            </div>
        </div>
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
    background-color: var(--medium-blue);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    max-width: 90vw;
    width: 150vh;
    box-shadow: 0px 10px 50px var(--black-blue-shadow);
    border-radius: 10px;
    padding: 5px;
}

.additional-info-tab h2 {
    margin: 10px 20px 10px;
}

.info-window-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
}

.info-window-content {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    overflow: auto;
    margin: 20px;
}

.info-window-image {
    display: block;
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: 5px;
}

.info-window-image-div {
    width: min(25vw, 40vh);
    overflow: hidden;
    flex-shrink: 0;
}

.info-window-text {
    padding: 10px 10px 10px;
    overflow: auto;
    flex-grow: 0;
}

@media screen and (max-width: 640px) {
    .info-window-content {
        flex-direction: column;
        align-items: center;
        overflow: auto;
        margin: 10px;
    }

    .info-window-image-div {
        width: 100%;
        overflow: unset;
    }

    .info-window-text {
        overflow: unset;
        padding: 20px 0px 10px;
    }
}
</style>