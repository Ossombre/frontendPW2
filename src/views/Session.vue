<template>
  <v-layout
    column justify-center style="margin-left: 20px"
  >
    <v-row xs12 sm8 md12>
      <v-col style="max-width: 16rem">
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
      <v-col v-if="this.exoValid" style="max-width: 42rem">
        <Exercise :sessionId="this.sessionId" :exerciseId="exoId" :key="componentKey"/>
      </v-col>
      <!--v-col v-if="this.exoValid" style="max-width: 42rem">
        <TestResults :results="this.testsOutput"/>
      </v-col-->
    </v-row>
  </v-layout>
</template>

<script>
import { /* mapState, */mapGetters, mapActions /* , mapMutations */ } from 'vuex'
import Exercise from '../components/Exercise'
// import TestResults from '../components/TestResults'

export default {
  name: 'Session',
  data: () => ({
    componentKey: 0,
    exoValid: false,
    exoId: 0// , // default value that should not throw errors
    // testsOutput: null,
    // exercise: null
  }),
  components: {
    Exercise// ,
    // TestResults
  },
  computed: {
    ...mapGetters('exercises', ['getExercisesBySessionId']),
    ...mapGetters('sessions', ['getSessionById']),
    ...mapGetters('exercises', ['getExerciseById']),
    // ...mapState('attempts', ['lastAttemptResults']),
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
      /* this.exercise = this.getExerciseById(this.exerciseId)
      if (!this.lastAttemptResults || !this.lastAttemptResults.tests) {
        if (!this.exercise.test_names) {
          this.testsOutput = { tests: [] }
        } else {
          this.testsOutput = {
            tests: this.exercise.test_names.map(t => ({
              placeholder: true,
              name: t
            }))
          }
        }
      } else {
        this.testsOutput = this.lastAttemptResults
      } */
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
