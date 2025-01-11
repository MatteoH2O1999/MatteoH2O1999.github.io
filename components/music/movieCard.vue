<template>
    <div>
        <nuxt-img format="webp" sizes="xs:40vw sm:40vw md:19vw lg:15vw xl:15vw xxl:10000px" :src="this.data.imgPath" class="card-poster" @click="showInfo();" tabindex="0" role="button" @keydown="keydown($event);" aria-haspopup="dialog" :alt="this.altCard"/>
        <div class="additional-info">
            <div class="additional-info-shadow" ref="shadow" @click="hideInfo();"></div>
            <div class="additional-info-window" ref="infoWindow">
                <MusicInfoWindow :data="this.data" @closeTab="hideInfo();"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: "MovieCard"
        }
    },
    props: ['data'],
    methods: {
        showInfo() {
            this.$refs.shadow.classList.add('show');
            this.$refs.infoWindow.classList.add('show');
            document.body.style.overflow = 'hidden';
        },
        hideInfo() {
            this.$refs.shadow.classList.remove('show');
            this.$refs.infoWindow.classList.remove('show');
            document.body.style.overflow = 'auto';
        },
        keydown(event) {
            const keyCode = event.keyCode;
            if (keyCode === 13 || keyCode === 32) {
                this.showInfo();
            }
        },
        handleCloseWindow(event) {
            const keyCode = event.keyCode;
            if (keyCode === 27) {
                this.hideInfo();
            }
        }
    },
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id === this.data.id) {
            const from = this.$nuxt.context.from?.fullPath;
            if (from && from.includes('/music')) {
                return
            }
            setTimeout(() => {this.showInfo()}, 250);
        }
        window.addEventListener('keydown', this.handleCloseWindow);
    },
    beforeDestroy() {
        this.hideInfo();
        window.removeEventListener('keydown', this.handleCloseWindow);
    },
    computed: {
        altCard() {
            return this.data.lang[this.$i18n.locale].title;
        },
    }
}
</script>

<style>
.card-poster {
    width: 100%;
    aspect-ratio: 2 / 3;
    transition: transform 0.1s ease;
    cursor: pointer;
}

.card-poster:hover, .card-poster:focus {
    transform: scale(1.05, 1.05);
}

.additional-info {
    position: absolute;
}

.additional-info .additional-info-shadow {
    visibility: hidden;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    z-index: 1;
    opacity: 0;
    transition: opacity ease-out 0.25s, visibility ease 0s 0.25s;
}

.additional-info .additional-info-shadow.show {
    visibility: visible;
    opacity: 1;
    transition: opacity ease-out 0.25s, visibility ease 0s;
}

.additional-info .additional-info-window {
    visibility: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
}

.additional-info .additional-info-window.show {
    visibility: visible;
}
</style>