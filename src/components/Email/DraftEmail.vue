<template>
  <div class="flex-grow">
    <div class="container px-4 text-left h-full">
      <EmailPreview @error="$v.$touch()" />
      <h2 class="text-primary font-bold text-xl">Rearrange the Jumpstart</h2>
      <span v-if="$v.get_selected_articles.$error" class="text-xs text-error">
        Please select atleast one article.
      </span>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <Article
          v-for="article in get_available_articles"
          :key="article.id"
          :article="article"
          @clicked="selectArticle(article)"
          :active="isActive(article)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Article from '@/components/Email/Article.vue';
import EmailPreview from '@/components/Email/EmailPreview.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'DraftEmail',
  components: { Article, EmailPreview },
  validations: {
    get_selected_articles: {
      required
    }
  },
  mounted() {
    if (!this.get_email_date) return this.$router.push({ name: 'EmailsAdd', params: { step: 1 } });
  },
  methods: {
    ...mapActions('email', ['debounced_preview', 'update_preview_link', 'update_selected_articles']),
    selectArticle(article) {
      if (this.get_selected_articles.length >= 5 && this.isActive(article) === -1) return false;
      this.$v.$reset();
      this.update_selected_articles(article);
      this.update_preview_link('');
      this.debounced_preview();
    },
    isActive(article) {
      return this.get_selected_articles.indexOf(article);
    }
  },
  computed: {
    ...mapGetters('email', ['get_email_date', 'get_selected_articles', 'get_available_articles'])
  }
};
</script>
