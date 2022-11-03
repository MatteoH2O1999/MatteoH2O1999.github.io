<template>
    <div class="credits-tab">
        <h1>{{ tabTitle }}</h1>
        <div class="cards-tab">
            <div v-for="card in this.cards" :key="card.id" class="card-div">
                <MusicMovieCard :data="card" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: "CreditTab",
                cards: []
            }
        },
        async fetch() {
            this.cards = await this.$content("music", this.subFolder).sortBy('releaseDate').fetch().catch((err) => {this.cards = []});
        },
        props: ['subFolder', 'tabTitle']
    }
</script>

<style>
.cards-tab {
    display: grid;
    justify-content: center;
}

@media only screen and (min-width: 1024px) {
    .cards-tab {
        grid-template-columns: repeat(auto-fill, 15vw);
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
    .cards-tab {
        grid-template-columns: repeat(auto-fill, 20vw);
    }
}

@media only screen and (max-width: 767px){
    .cards-tab {
        grid-template-columns: repeat(auto-fill, 40vw);
    }
}
</style>