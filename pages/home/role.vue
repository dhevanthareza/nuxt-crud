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
          <span class="headline">Role</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="detail.name"
                  label="Role Name"
                  required
                />
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
        this.getRoleList()
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
      this.getRoleList()
    },
    async delete(item) {
      await request.delete(`/roles/${item.id}`)
      this.getRoleList()
    },
    async saveItem() {
      this.loadingSave = true
      try {
        if ('id' in this.detail) {
          await request.put(`/roles/${this.detail.id}`, {
            name: this.detail.name,
          })
          this.$store.commit('showMessage', {
            type: 'success',
            message: 'Berhasil update Role',
          })
        } else {
          await request.post('/roles', { ...this.detail })
          this.$store.commit('showMessage', {
            type: 'success',
            message: 'Berhasil Menambahkan Role',
          })
        }
        this.detail = {}
        this.loadingSave = false
        this.dialog = false
        this.getRoleList()
      } catch (err) {
        this.detail = {}
        this.loadingSave = false
        this.dialog = false
      }
    },
    async getRoleList() {
      this.loading = true
      const data = await request.get(
        `/roles?filter=${JSON.stringify(this.filter)}`,
      )
      const totalItems = await request.get('/roles/count')
      this.totalItems = totalItems.count
      console.log(this.totalitems)
      this.items = data
      this.loading = false
    },
  },
}
</script>
