<template>
  <v-layout
    column justify-center style="margin-left: 20px"
  >
    <v-row xs12 sm8 md12 style="max-width: 32rem">
      <v-col>
        <v-row justify="start">
          <v-card @click="exerciseClicked(exercise.id)" class="ma-2" height="8em" width="16em" v-for="exercise in getExercisesBySessionId(session.id)" :key="exercise.id" v-bind:style="{ background: getColor(exercise) }">
            <v-card-title class="subtitle-1">
              {{ exercise.title }}
            </v-card-title>
            <v-card-text>
              Ne rien mettre ici
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
      <v-col v-if="this.exoValid">
        <Exercise :sessionId="this.sessionId" :exerciseId="exoId" :key="componentKey"/>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { /* mapState, */ mapGetters, mapActions /* , mapMutations */ } from 'vuex'
import Exercise from '../components/Exercise'

export default {
  name: 'Session',
  data: () => ({
    componentKey: 0,
    exoValid: false,
    exoId: 0 // default value that should not throw errors
  }),
  components: {
    Exercise
  },
  computed: {
    ...mapGetters('exercises', ['getExercisesBySessionId']),
    ...mapGetters('sessions', ['getSessionById']),
    session () {
      return this.getSessionById(this.sessionId) ||
        { name: 'Loading..' }
    },
    sessionId () {
      return parseInt(this.$route.params.id)
    }
  },
  async mounted () {
    await this.fetchSession({ id: this.sessionId })
    await this.fetchExercisesForSession({ sessionId: this.sessionId })
  },
  methods: {
    exerciseClicked: function (exerciseId) {
      this.exoValid = true
      this.exoId = exerciseId
      this.componentKey += 1
    },
    getColor: function (exercise) {
      if (exercise.valid) {
        return '#46A73A'
      } else {
        return 'default'
      }
    },
    ...mapActions('exercises', ['fetchExercisesForSession']),
    ...mapActions('sessions', ['fetchSession'])
  }
}
</script>
