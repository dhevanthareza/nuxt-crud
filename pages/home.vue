<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item
          v-for="menu in menus"
          :key="menu.url"
          :to="`/home${menu.url}`"
        >
          <v-list-item-content>
            <v-list-item-title>{{ menu.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-alert
          :value="$store.state.Alert.show"
          transition="slide-y-transition"
          :type="$store.state.Alert.type"
        >
          {{ $store.state.Alert.message }}
        </v-alert>
      </v-container>
      <nuxt-child></nuxt-child>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text"
        >&copy; {{ new Date().getFullYear() }}</span
      >
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    menus: [
      {
        url: '/dashboard',
        title: 'Dashboard',
      },
      {
        url: '/role',
        title: 'Role',
      },
      {
        url: '/user',
        title: 'User',
      },
      {
        url: '/region',
        title: 'Region',
      },
      {
        url: '/sales-area',
        title: 'Sales Area',
      },
      {
        url: '/representative',
        title: 'Representative',
      },
      {
        url: '/province',
        title: 'Province',
      },
      {
        url: '/city',
        title: 'City',
      },
    ],
  }),
}
</script>
