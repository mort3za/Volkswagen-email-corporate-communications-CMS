// TODO: refactor function and state names to be snake_case
// refactor: remove new Promise() and just return ajax

import { DistributionGroupService } from '@whynotearth/meredith-axios';
import Vue from 'vue';
import { downloadBase64AsFile } from '@/helpers';

export default {
  namespaced: true,
  state: {
    emailLists: [],
    selectedEmailList: {},
    emails: [],
    selectedEmail: {},
    email: '',
    user_form_data: {
      first_name: '',
      last_name: '',
      email: '',
      segments: ''
    },
    stats_overview: null,
    stats_overview_date_range: {
      text: '',
      value: [] // ['2020-06-06', '2020-06-13']
    }
  },
  mutations: {
    updateEmailLists(state, payload) {
      state.emailLists = payload.data;
    },
    selectEmailList(state, payload) {
      state.selectedEmailList = payload;
    },
    updateEmails(state, payload) {
      state.emails = payload.data;
    },
    selectEmail(state, payload) {
      state.selectedEmail = payload;
    },
    updateEmail(state, payload) {
      state.email = payload;
    },
    update_form_firstname(state, payload) {
      Vue.set(state.user_form_data, 'first_name', payload);
    },
    update_form_lastname(state, payload) {
      Vue.set(state.user_form_data, 'last_name', payload);
    },
    update_form_email(state, payload) {
      Vue.set(state.user_form_data, 'email', payload);
    },
    update_form_segments(state, payload) {
      Vue.set(state.user_form_data, 'segments', payload);
    },
    update_stats_overview(state, payload) {
      state.stats_overview = payload;
    },
    update_stats_overview_date_range(state, payload) {
      state.stats_overview_date_range = payload;
    }
  },
  actions: {
    async importEmailList(context, { ajax, body }) {
      // FIXME: there is a bug in swagger-axios-codegen https://github.com/Manweill/swagger-axios-codegen/issues/93
      // return await DistributionGroupService.distributiongroups1(
      //   { params: payload },
      //   { headers: { 'content-type': 'multipart/form-data' } }
      // );

      var bodyFormData = new FormData();
      bodyFormData.append('file', body.file);

      let url = '/api/v0/volkswagen/distributiongroups';
      const configs = {
        method: 'put',
        url,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: bodyFormData
      };
      return ajax(configs);
    },
    async getEmailLists(context) {
      try {
        const data = await DistributionGroupService.stats();
        context.commit('updateEmailLists', { data });
      } catch (error) {
        return new Error('get stats issue');
      }
    },
    getEmails(context, groupName) {
      return new Promise((resolve, reject) => {
        DistributionGroupService.recipients({
          // TODO: we should get groupName only from one source, param is better.
          distributionGroupName: context.state.selectedEmailList.distributionGroup || groupName
        })
          .then(data => {
            context.commit('updateEmails', { data });
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    addEmail(context) {
      return new Promise((resolve, reject) => {
        DistributionGroupService.recipients1({
          // TODO: get groupName from param
          distributionGroupName: context.state.selectedEmailList.distributionGroup,
          body: { email: context.state.email }
        })
          .then(data => {
            context.commit('updateEmail', '');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    editEmail(context, payload) {
      return new Promise((resolve, reject) => {
        DistributionGroupService.recipients2(payload)
          .then(data => {
            context.commit('updateEmail', '');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    deleteEmail(context, payload) {
      return new Promise((resolve, reject) => {
        DistributionGroupService.recipients3(payload)
          .then(data => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async fetch_stats_overview({ commit }, payload) {
      const data = await DistributionGroupService.stats1(payload.params);
      commit('update_stats_overview', data);
    },
    async export_stats_overview({ commit }, payload) {
      const data = await DistributionGroupService.export1(payload.params);
      downloadBase64AsFile({ content: data, fileName: 'distribution-groups-stats.csv', mimeType: 'text/csv' });
    },
    delete_group(context, payload) {
      console.log('TODO: connect delete group to api', payload);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }
  },
  getters: {
    getEmailLists: state => {
      return state.emailLists || [];
    },
    selectedEmailList: state => {
      return state.selectedEmailList;
    },
    getEmails: state => {
      return state.emails;
    },
    selectedEmail: state => {
      return state.selectedEmail;
    },
    email: state => {
      return state.email;
    },
    get_form_first_name: state => state.user_form_data.first_name,
    get_form_last_name: state => state.user_form_data.last_name,
    get_form_email: state => state.user_form_data.email,
    get_form_segments: state => state.user_form_data.segments,
    get_stats_overview: state => state.stats_overview,
    get_stats_overview_date_range: state => state.stats_overview_date_range
  }
};
