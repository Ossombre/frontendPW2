<template>
  <v-layout
    column justify-center align-center
  >
    <v-row xs12 sm8 md12 style="max-width: 88rem">
      <v-col cols="12">
        <h2>{{ exercise.title }}</h2>
      </v-col>
      <v-col cols="12">
        <p v-html="exercise.instructions"/>
        <v-row justify="start">
            <h2>Votre solution</h2>
            <v-btn color="primary" @click="buttonClicked">&#9658;</v-btn>
        </v-row>
      </v-col>
      <v-col cols="12">
        <div id="editor" class="exercise-editor-ace-editor" ></div>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { /* mapState, */mapGetters, mapActions, mapMutations } from 'vuex'
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'

export default {
  name: 'Exercise',
  data: () => ({
    editor: null,
    lang: { mode: 'python', name: 'Python' },
    solutionJustChanged: false,
    solution: ''
  }),
  props: {
    exerciseId: Number,
    sessionId: Number
  },
  watch: {
    solution (newVal) {
      if (this.editor && newVal !== this.editor.getValue()) {
        this.solutionJustChanged = true
        this.editor.setValue(newVal)
        this.editor.clearSelection()
      }
    }
  },
  computed: {
    ...mapGetters('exercises', ['getExerciseById']),
    ...mapGetters('attempts', ['getLastAttemptForExercise']),
    exercise () {
      return this.getExerciseById(this.exerciseId) ||
        {}
    },
    lastAttempt () {
      return this.getLastAttemptForExercise(this.exerciseId) || {}
    }
  },
  async mounted () {
    await this.fetchExerciseForSession({ sessionId: this.sessionId, exerciseId: this.exerciseId })
    await this.fetchLastAttemptForExercise({ sessionId: this.sessionId, exerciseId: this.exerciseId })
    this.setDefaultSolution()
    this.editor = ace.edit('editor')
    this.editor.setTheme('ace/theme/monokai')
    this.editor.setFontSize('1.1rem')
    this.editor.session.setMode(`ace/mode/${this.lang.mode}`)
    this.editor.session.on('change', (e) => {
      if (!this.solutionJustChanged) {
        this.onChange(e)
      } else {
        this.solutionJustChanged = false
      }
    })
    if (this.solution) {
      this.editor.setValue(this.solution)
      this.editor.clearSelection()
    }
    console.log('ok')
  },
  beforeDestroy () {
    if (this.editor) {
      this.editor.destroy()
      this.editor.container.remove()
    }
  },
  methods: {
    ...mapActions('exercises', ['fetchExerciseForSession']),
    ...mapActions('attempts', ['createAttemptForSession']),
    ...mapActions('attempts', ['fetchLastAttemptForExercise']),
    ...mapActions('attempts', ['fetchLastAttemptForExercise']),
    ...mapMutations('attempts', ['addAttempt']),
    async buttonClicked () {
      console.log(this.solution)
      await this.createAttemptForSession({
        exerciseId: this.exerciseId,
        sessionId: this.sessionId,
        solution: this.solution
      })// SEEMS LIKE THIS DOESN'T WORK, EVEN IN THE CORRECTED VERSION (error 400 Bad Request)
    },
    onChange (event, force = false) {
      const text = this.editor.getValue()
      if (!force && text === this.solution) return
      this.$emit('change', { text })
    },
    setDefaultSolution () {
      if (this.lastAttempt.solution) {
        this.solution = this.lastAttempt.solution
      } else {
        if (this.exercise.template_regions && this.exercise.template_regions.length) {
          this.solution = this.exercise.template_regions.join('\n')
        } else {
          this.solution = ''
        }
      }
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
