<template>
    <div class="main-page-photo">
        <nuxt-img format="webp" sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:10000px" src="/homePage/homePagePhoto.png" :alt="$t('altText.homePagePhoto')" class="main-page-central-photo" id="main-page-central-photo" @load="enterMainPage();"/>
        <h1 class="main-page-name" id="main-page-central-name">
            MATTEO DELL'ACQUA
        </h1>
    </div>
</template>

<script>
function enterMainPageAnimation() {
    document.getElementById("main-page-central-photo").classList.add("enter");
    document.getElementById("main-page-central-name").classList.add("enter");
}

export default {
    data() {
        return {
            name: "IndexPage"
        }
    },
    head() {
        return {
            title: "[WIP] Matteo Dell'Acqua",
            link: [
                {rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap", body: true}
            ],
            meta: [
                {name: 'description', hid: 'description', content: this.$t('descriptions.index')}
            ]
        }
    },
    methods: {
        enterMainPage() {
            enterMainPageAnimation();
        }
    },
}
</script>

<style>
.main-page-photo {
    position: relative;
}

.main-page-name {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(3vw);
    opacity: 0;
    font-size: 3vw;
    font-family: "Permanent Marker", Arial, Helvetica, sans-serif;
}

.main-page-central-photo {
  transform: translateX(-3vw);
  opacity: 0;
  width: 90vw;
  aspect-ratio: auto 16 / 9;
}

@keyframes mainImageEntrance {
	0% {
		opacity: 0;
		transform: translateX(-3vw);
	}

	100% {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes mainNameEntrance {
	0% {
		opacity: 0;
		transform: translateX(3vw);
	}

	100% {
		opacity: 1;
		transform: translateX(0);
	}
}

.main-page-central-photo.enter {
  animation: mainImageEntrance 1s ease-out 0s 1 normal forwards;
}

.main-page-name.enter {
  animation: mainNameEntrance 1s ease-out 0s 1 normal forwards;
}
</style>
