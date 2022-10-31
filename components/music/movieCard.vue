<template>
    <div>
        <nuxt-img format="webp" sizes="xs:40vw sm:40vw md:20vw lg:15vw xl:15vw xxl:15vw" :src="this.data.imgPath" class="card-poster" @click="showInfo();" />
        <div class="additional-info">
            <div class="additional-info-shadow" ref="shadow" @click="hideInfo();"></div>
            <div class="additional-info-window" ref="infoWindow">
                <nuxt-img format="webp" sizes="xs:40vw sm:40vw md:20vw lg:15vw xl:15vw xxl:15vw" :src="this.data.imgPath" class="card-poster"/>
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
            }
        }
    }
</script>

<style>
.card-poster {
    width: 100%;
    aspect-ratio: 2 / 3;
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