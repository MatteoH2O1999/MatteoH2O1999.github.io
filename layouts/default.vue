<template>
    <div class="layout-wrapper">
        <div class="content-wrapper">
            <Navbar />
            <Nuxt />
        </div>
        <SocialFooter class="footer" />
    </div>
</template>

<script>
    export default {
        head() {
            return {
                link: [
                    {rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Merriweather&display=swap", body: true}
                ]
            }
        }
    }
</script>

<style>
body {
    font-family: Merriweather, Arial, Helvetica, sans-serif;
    color: white;
    background-color: rgb(19, 26, 42);
    margin: 0;
}

.layout-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>