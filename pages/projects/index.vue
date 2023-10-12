<template>
    <div>
        <BlogArticleList :articles="this.articles" />
        <BlogPageSelector :currentPage="this.currentPage" :lastPage="this.lastPage" basePath="/projects" queryName="page"/>
    </div>
</template>

<script>
const articlesPerPage = 10;
export default {
    data() {
        return {
            name: "ProjectsPage",
            currentPage: 1,
            lastPage: 1,
            articles: []
        }
    },
    head() {
        return {
            title: `Matteo Dell'Acqua | ${this.$t('navbar.projects')}`,
            meta: [
                {name: 'description', hid: 'description', content: this.$t('descriptions.projects')}
            ]
        }
    },
    async fetch() {
        const context = this.$nuxt.context;
        const urlParams = new URLSearchParams(context.route.query);
        const pageNumber = urlParams.get('page');
        let page = 0
        if (pageNumber !== null) {
            page = parseInt(pageNumber) - 1 || 0;
        }
        const articles = [];
        const content = await context.$content('articles', context.i18n.locale, {deep: true}).sortBy('createdAt', 'desc').skip(articlesPerPage * page).fetch();
        articles.push(...content.slice(0, articlesPerPage));
        if (articles.length === 0) {
            context.error({statusCode: 404, message: 'Page not found'});
        }
        const currentPage = page + 1;
        const lastPage = Math.ceil((content.length - articlesPerPage) / articlesPerPage) + page + 1;
        this.currentPage = currentPage;
        this.lastPage = lastPage;
        this.articles = articles;
    },
    watch: {
        '$route.query': '$fetch'
    }
}
</script>