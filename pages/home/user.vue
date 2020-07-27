<template>
  <v-app>
    <v-container class="pa-8">
      <v-card class="pa-5">
        <v-btn
          class="mb-5 flat"
          color="primary"
          @click="dialog = true"
          >Tambah Data</v-btn
        >
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="totalItems"
          :loading="loading"
        >
          <template v-slot:item.action="{ item }">
            <v-btn color="success" dark @click="editItem(item)">
              edit
            </v-btn>
            <v-btn color="red" dark @click="deleteItem(item)">
              HAPUS
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">User</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="detail.name"
                  label="User Name"
                  required
                />
                <v-autocomplete
                  v-model="detail.RoleId"
                  item-text="name"
                  item-value="id"
                  :items="roleList"
                  label="Choose role"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            :loading="loadingSave"
            text
            @click="saveItem()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import request from '~/service/request'
export default {
  data() {
    return {
      totalItems: 0,
      roleList: [],
      items: [],
      dialog: false,
      loading: false,
      loadingSave: false,
      options: {
        search: '',
      },
      detail: {},
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Role', value: 'Role.name' },
        {
          text: 'Actions',
          value: 'action',
          sortable: false,
          align: 'center',
          width: 200,
        },
      ],
    }
  },
  computed: {
    filter: function() {
      return {
        offset:
          this.options.itemsPerPage > 0
            ? this.options.itemsPerPage * (this.options.page - 1)
            : 0,
        limit:
          this.options.itemsPerPage > 0
            ? this.options.itemsPerPage
            : this.totalItems,
        include: [
          {
            relation: 'Role',
          },
        ],
      }
    },
  },
  watch: {
    dialog: {
      handler() {
        if (this.dialog === false) {
          this.detail = {}
        }
      },
    },
    options: {
      handler() {
        console.log(this.options)
        console.log(this.filter)
        this.loading = true
        this.getUserList()
      },
      deep: true,
    },
  },
  methods: {
    editItem(item) {
      this.detail = item
      this.dialog = true
    },
    deleteItem(item) {
      confirm('Are you sure you want to delete this item?') &&
        this.delete(item)
      this.getUserList()
    },
    async delete(item) {
      await request.delete(`/users/${item.id}`)
      this.getUserList()
    },
    async saveItem() {
      this.loadingSave = true
      try {
        if ('id' in this.detail) {
          await request.put(`/users/${this.detail.id}`, {
            name: this.detail.name,
            RoleId: this.detail.RoleId,
          })
          this.$store.commit('showMessage', {
            type: 'success',
            message: 'Berhasil update User',
          })
          this.detail = false
        } else {
          await request.post('/users', { ...this.detail })
          this.$store.commit('showMessage', {
            type: 'success',
            message: 'Berhasil Menambahkan User',
          })
          this.detail = false
        }
        this.loadingSave = false
        this.dialog = false
        this.getUserList()
      } catch (err) {
        this.detail = false
        this.loadingSave = false
        this.dialog = false
      }
    },
    async getUserList() {
      this.loading = true
      const data = await request.get(
        `/users?filter=${JSON.stringify(this.filter)}`,
      )
      const totalItems = await request.get('/users/count')
      this.totalItems = totalItems.count
      console.log(this.totalitems)
      this.items = data
      this.loading = false
    },
    async getRoleList() {
      const data = await request.get('/roles')
      this.roleList = data
    },
  },
  created() {
    this.getRoleList()
  },
}
</script>
