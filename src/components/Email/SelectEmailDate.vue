<template>
  <div class="py-2 flex-grow">
    <div class="container px-4 text-left">
      <div class="flex relative">
        <div class="flex-auto">
          <BaseDropdown placeholder="Select date" :options="dates" v-model="$v.email_date.$model">
            <template #title="{ selectedOption }">
              <span v-if="selectedOption">
                Schedule
                <span class="ml-2 em-medium">
                  {{ formatDate(selectedOption) }}
                </span>
              </span>
            </template>
            <template #option="{ option }">
              <span>
                {{ formatDate(option) }}
              </span>
            </template>
          </BaseDropdown>
          <p v-if="$v.email_date.$error" class="text-xs text-error">
            Please select a date.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseDropdown from '@/components/BaseDropdown';
import { formatDate } from '@/helpers.js';
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { formatISODate } from '@/helpers.js';

export default {
  name: 'SelectEmailDate',
  components: { BaseDropdown },
  validations: {
    email_date: {
      required
    }
  },
  mounted() {
    if (this.get_email_date) {
      this.fetch_posts({ params: { date: formatISODate(this.get_email_date) } });
    }
  },
  computed: {
    ...mapGetters('email', ['get_email_date']),
    email_date: {
      get() {
        return this.get_email_date;
      },
      set(value) {
        this.clear_email_data();
        this.update_email_date(value);
        this.fetch_posts({ params: { date: formatISODate(value) } });
      }
    },
    dates() {
      let d = new Date();
      d.setHours(0, 0, 0, 0);
      d = d.getTime();
      let days = [];
      for (let i = 0; i < 3; i++) {
        let a = d + i * 86400000;
        days.push(a);
      }
      return days;
    }
  },
  methods: {
    ...mapMutations('email', ['update_email_date']),
    ...mapActions('email', ['clear_email_data']),
    ...mapActions('post', ['fetch_posts']),
    formatDate
  }
};
</script>

<style></style>