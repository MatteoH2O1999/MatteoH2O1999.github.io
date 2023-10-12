<template>
    <div>
        <BlogArticleList :articles="this.articles" />
    </div>
</template>

<script>
const articleLimit = 10;
export default {
    data() {
        return {
            name: "NewsPage",
        }
    },
    head() {
        return {
            title: `Matteo Dell'Acqua | ${this.$t('navbar.news')}`,
            meta: [
                {name: 'description', hid: 'description', content: this.$t('descriptions.news')}
            ]
        }
    },
    async asyncData(context) {
        let articles = [];
        const content = await context.$content('articles', context.i18n.locale, {deep: true}).limit(articleLimit).fetch();
        articles.push(...content);
        const music = await context.$content('music', {deep: true}).limit(articleLimit).fetch();
        articles.push(...music);
        articles = articles.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
        })
        if (articles.length > articleLimit) {
            articles = articles.slice(0, articleLimit);
        }
        return {
            articles
        }
    }
}
</script>