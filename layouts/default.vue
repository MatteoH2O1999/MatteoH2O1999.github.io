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
                    {rel: "preconnect", href: "https://fonts.googleapis.com"},
                    {rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: true},
                    {rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap", body: true},
                    {rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap", body: true}
                ]
            }
        }
    }
</script>

<style>
body {
    font-family: "Poppins", Arial, Helvetica, sans-serif;
    color: white;
    background-color: var(--dark-blue);
    margin: 0;
    line-height: 150%;
}

body h1, body h2, body h3, body h4, body h5, body h6 {
    font-family: "Montserrat", Arial, Helvetica, sans-serif;
    line-height: initial;
}

.bold-text {
    font-weight: bold;
}

.semi-bold-text {
    font-weight: 600;
}

.blue-text {
    color: var(--light-blue);
}

.layout-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

:root {
    --dark-blue: #141526;
    --dark-blue-shadow: #080814;
    --bold-blue: #6060ff;
    --doc-blue: #095589;
    --medium-blue: #202035;
    --light-blue: #1cbfff;
    --darker-white: #eeeeee;
    --gray: #505050;
    --black-blue-shadow: #050508;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s;
}

.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>