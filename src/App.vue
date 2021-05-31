<template>
  <div id="app">
<router-view/>
  </div>
</template>

<script>
import Note from './view/Note.vue'
import Login from './view/Login'

export default {
  components: {
    Note,
    Login
  }
}
</script>

<style>

</style>
