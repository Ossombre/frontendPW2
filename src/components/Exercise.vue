<template>
  <v-layout
    column justify-center align-center
  >
    <v-row xs12 sm8 md12 style="max-width: 88rem">
        <h2>{{ exercise.title }}</h2>
        <p v-html="exercise.instructions"/>
        <!--<p>Ici les instructions d'un exercice, tout simplement<br/><br/></p>-->
        <v-row justify="start">
            <h2>Votre solution</h2>
            <v-btn color="primary" @click="buttonClicked">&#9658;</v-btn>
        </v-row>
        <div id="sandbox" class="exercise-editor-ace-editor"></div>
    </v-row>
  </v-layout>
</template>

<script>
import { /* mapState, */ mapGetters, mapActions/* , mapMutations */ } from 'vuex'
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'

export default {
  name: 'Exercise',
  data: () => ({
    sandbox: null,
    languages: [
      { mode: 'python', name: 'Python' },
      { mode: 'javascript', name: 'Javascript' }
    ],
    lang: { mode: 'python', name: 'Python' }
  }),
  props: {
    exerciseId: Number,
    sessionId: Number
  },
  computed: {
    ...mapGetters('exercises', ['getExerciseById']),
    exercise () {
      return this.getExerciseById(this.exerciseId) ||
        { name: 'Loading..' }
    }
  },
  async mounted () {
    await this.fetchExerciseForSession({ sessionId: this.sessionId, exerciseId: this.exerciseId })
    this.sandbox = ace.edit('sandbox')
    this.sandbox.setTheme('ace/theme/monokai')
    this.sandbox.session.setMode(`ace/mode/${this.lang.mode}`)
  },
  methods: {
    changeLanguage () {
      this.sandbox.session.setMode(`ace/mode/${this.lang.mode}`)
    },
    ...mapActions('exercises', ['fetchExerciseForSession']),
    async buttonClicked () {
      // fill here
    }
  }
}
</script>

<style>
.exercise-editor-ace-editor {
  position: relative;
  height: 20rem;
}
</style>
