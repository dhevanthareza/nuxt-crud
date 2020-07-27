<template>
  <v-app id="inspire"> </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    menu: [
      {
        url: 'role',
        title: 'Role',
      },
    ],
  }),
  created() {
    this.$router.replace('/home/dashboard')
  },
}
</script>
