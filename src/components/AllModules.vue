<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-form v-model="valid">
        <v-container>
          <v-row>
              <v-col
              cols="25"
              md="4"
            >
                <p>test: {{testVuex}}</p>
            </v-col>

            <v-col
              cols="20"
              md="4"
            ></v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-layout>
  </v-container>
</template>
<script>
import { mapState, mapGetters/* , mapActions */, mapMutations } from 'vuex'

export default {
  name: 'AllModules',
  data: () => ({
    valid: false,
    testVuex: 'HEY'
  }),
  computed: {
    ...mapState('modules', ['modules']),
    ...mapGetters('modules', ['getModuleById']),
    ...mapMutations('modules', ['addModule']),
    ...mapGetters('user', ['isAuthenticated'])
  },
  created () {
    this.testVuex = this.getModuleById(1).name
    console.log('' + this.isAuthenticated())
  },
  methods: {

  }
}
</script>
