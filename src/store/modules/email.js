import { JumpStartService } from '@whynotearth/meredith-axios';
import qs from 'qs';
import { debounce } from 'lodash-es';
import store from '@/store';

export default {
  namespaced: true,
  state: {
    loading: false,
    email_date: null,
    schedule_time: null,
    preview_link: '',
    articles: [],
    selected_articles: [],
    email_recipients: [],
    jumpstarts: [],
    response_message: {
      type: '', // error, success
      message: '',
      class: '' // text-error text-success
    },
    default_distribution_groups: [],
    default_schedule_time: null,
    selected_plan: {
      articles: []
    },
    daily_plan: [],
    available_articles: [],
    stats: [],
    stats_overview: {},
    stats_overview_date_range: {
      text: '',
      value: [] // ['2020-06-06', '2020-06-13']
    },
    stat: {}
  },
  getters: {
    get_email_date: state => state.email_date,
    get_schedule_time: state => state.schedule_time,
    get_selected_articles: state => state.selected_articles,
    get_preview_link: state => state.preview_link,
    get_email_recipients: state => state.email_recipients,
    get_response_message: state => state.response_message,
    get_articles: state => state.articles,
    get_default_distribution_groups: state => state.default_distribution_groups,
    get_default_schedule_time: state => state.default_schedule_time,
    get_selected_plan: state => state.selected_plan,
    get_daily_plan: state => state.daily_plan,
    get_available_articles: state => state.available_articles,
    get_stats: state => state.stats,
    get_stats_overview: state => state.stats_overview,
    get_stats_overview_date_range: state => state.stats_overview_date_range,
    get_stat: state => state.stat
  },
  actions: {
    async create_jumpstart({ commit }, payload) {
      await JumpStartService.jumpstart(payload.params);
    },
    delete_article_by_id({ state }, id) {
      state.available_articles = state.available_articles.filter(item => item.id !== id);
    },
    update_selected_articles({ state }, payload) {
      if (!payload) {
        state.selected_articles.splice(0, state.selected_articles.length);
      } else {
        let i = state.selected_articles.indexOf(payload);
        i !== -1 ? state.selected_articles.splice(i, 1) : state.selected_articles.push(payload);
      }
    },
    update_preview_link({ state }, payload) {
      if (payload === '') {
        state.preview_link = payload;
        return false;
      }
      const data = {
        params: {
          date: state.selected_plan.dateTime,
          articleIds: state.selected_articles.map(article => article.id)
        }
      };
      JumpStartService.preview(data.params, {
        paramsSerializer: params => {
          return qs.stringify(params);
        }
      }).then(response => {
        state.preview_link = response;
      });
    },
    async fetch_daily_plan({ commit }) {
      const data = await JumpStartService.dailyplan();
      commit('update_daily_plan', data);
    },
    clear_email_data({ commit, dispatch }) {
      commit('update_email_date', null);
      commit('update_schedule_time', null);
      commit('update_email_recipients', []);
      dispatch('update_preview_link', '');
      dispatch('update_selected_articles'); // Passing no payload just clears the selected_articles array
    },
    debounced_preview: debounce(
      function({ dispatch }) {
        dispatch('update_preview_link');
      },
      3000,
      { maxWait: 3000 }
    ),
    async fetch_stats({ commit }) {
      const data = await JumpStartService.stats();
      commit('update_stats', data);
    },
    async fetch_stat({ commit }, params) {
      const data = await JumpStartService.stats1(params);
      commit('update_stat', data);
    },
    fetch_stats_overview({ commit }) {
      // const data = await JumpStartService.stats2????????();
      const data = {
        userCount: 500,
        userGrowthPercent: 12,
        openCount: 400,
        openGrowthPercent: 20,
        clickCount: 50,
        clickGrowthPercent: 10,
        users: [
          {
            date: '2020-06-11',
            count: 100
          }
        ],
        opens: [
          {
            date: '2020-06-11',
            count: 30
          }
        ],
        clicks: [
          {
            date: '2020-06-11',
            count: 50
          }
        ],
        tags: ['One Team', 'Priority', 'People', 'Plant'],
        tagStats: [
          {
            tag: 'People',
            date: '2020-06-11',
            count: 3
          }
        ],
        heatMap: [
          {
            date: '2020-06-11',
            hours: [
              {
                hour: 0,
                activity: 0
              }
            ]
          }
        ]
      };
      commit('update_stats_overview', data);
    }
  },
  mutations: {
    update_email_date(state, payload) {
      state.email_date = payload;
    },
    update_schedule_time(state, payload) {
      state.schedule_time = payload;
    },
    update_email_recipients(state, payload) {
      state.email_recipients = payload;
    },
    update_response_message(state, payload) {
      state.response_message = payload;
    },
    update_articles(state, payload) {
      state.articles = payload;
    },
    update_default_distribution_groups(state, payload) {
      state.default_distribution_groups = payload;
    },
    update_default_schedule_time(state, payload) {
      state.default_schedule_time = payload;
    },
    update_selected_plan(state, payload) {
      state.selected_plan = payload;
    },
    update_available_articles(state, payload) {
      state.available_articles = payload;
    },
    update_daily_plan(state, payload) {
      state.daily_plan = payload;
    },
    update_stats(state, payload) {
      state.stats = payload;
    },
    update_stat(state, payload) {
      state.stat = payload;
    },
    update_stats_overview(state, payload) {
      state.stats_overview = payload;
    },
    update_stats_overview_date_range(state, payload) {
      state.stats_overview_date_range = payload;
    }
  }
};
