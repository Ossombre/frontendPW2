<template>
  <v-layout
    column justify-center align-center
  >
    <v-row xs12 sm8 md12 style="max-width: 88rem">
      <v-col v-for="module in modules" :key="module.id" cols="12">
        <h2>
          <router-link :to="`/module/${module.id}`" style="text-decoration: none">
            {{ module.name }}
          </router-link>
        </h2>
        <v-row justify="start">
          <v-card class="ma-2" height="8em" width="16em" v-for="session in getSessionsByModuleId(module.id)" :key="session.id">
            <v-card-title class="subtitle-1">
              {{ session.name }}
            </v-card-title>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { mapState, mapGetters, mapActions /* , mapMutations */ } from 'vuex'

export default {
  name: 'AllModules',
  data: () => ({
  }),
  computed: {
    ...mapGetters('modules', ['getModuleById']),
    ...mapGetters('sessions', ['getSessionsByModuleId']),
    ...mapGetters('user', ['isAuthenticated']),
    ...mapState('modules', ['modules'])
  },
  async mounted () {
    await this.fetchModules()
    await Promise.all(
      this.modules.map(m => this.fetchSessionsForModule({ moduleId: m.id }))
    )
  },
  async created () {
    console.log('user properly authenticated: ' + this.isAuthenticated)
  },
  methods: {
    ...mapActions('sessions', ['fetchSessionsForModule']),
    ...mapActions('modules', ['fetchModule']),
    ...mapActions('modules', ['fetchModules'])
  }
}
</script>
