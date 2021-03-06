import { ArticleService, ArticleCategoryService } from '@whynotearth/meredith-axios';
import Vue from 'vue';
import { cloneDeep } from 'lodash-es';

const defaultArticleFormData = {
  headline: '',
  description: '',
  date: '',
  eventDate: '',
  // this is filelist
  image: {},
  selected_category: {},
  excerpt: ''
};

export default {
  namespaced: true,
  state: {
    form_data: cloneDeep(defaultArticleFormData),
    categories: [],
    response_message: {
      type: '', // error, success
      message: '',
      class: '' // text-error text-success
    }
  },
  mutations: {
    update_categories(state, payload) {
      state.categories = payload;
    },
    update_headline(state, payload) {
      Vue.set(state.form_data, 'headline', payload);
    },
    update_description(state, payload) {
      Vue.set(state.form_data, 'description', payload);
    },
    update_excerpt(state, payload) {
      Vue.set(state.form_data, 'excerpt', payload);
    },
    update_date(state, payload) {
      Vue.set(state.form_data, 'date', payload);
    },
    update_eventDate(state, payload) {
      Vue.set(state.form_data, 'eventDate', payload);
    },
    update_image(state, payload) {
      Vue.set(state.form_data, 'image', payload);
    },
    update_selected_category(state, payload) {
      Vue.set(state.form_data, 'selected_category', payload);
    },
    update_response_message(state, payload) {
      Vue.set(state, 'response_message', payload);
    },
    update_form_data(state, payload) {
      Vue.set(state, 'form_data', payload);
    }
  },
  actions: {
    clear_form_data(context) {
      context.commit('update_form_data', cloneDeep(defaultArticleFormData));
    },
    async add_article(context, payload) {
      await ArticleService.articles(payload.params);
    },
    async fetch_categories(context) {
      const data = await ArticleCategoryService.categories();
      context.commit('update_categories', data);
    },
    async put_article(context, payload) {
      await ArticleService.articles1(payload);
    },
    async delete_article(context, payload) {
      await ArticleService.articles2(payload);
    }
  },
  getters: {
    get_date: state => state.form_data.date,
    get_headline: state => state.form_data.headline,
    get_description: state => state.form_data.description,
    get_excerpt: state => state.form_data.excerpt,
    get_eventDate: state => state.form_data.eventDate,
    get_image: state => state.form_data.image,
    get_selected_category: state => state.form_data.selected_category,
    get_response_message: state => state.response_message,
    get_categories: state => state.categories
  }
};
