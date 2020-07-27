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
          <span class="headline">Sales Area</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="detail.name"
                  label="Sales Area"
                  required
                />
                <v-autocomplete
                  v-model="detail.RegionId"
                  item-text="name"
                  item-value="id"
                  :items="regionList"
                  label="Choose Region"
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
      regionList: [],
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
        { text: 'Region', value: 'Region.name' },
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
            relation: 'Region',
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
        this.getSalesAreaList()
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
      this.getSalesAreaList()
    },
    async delete(item) {
      await request.delete(`/sales-areas/${item.id}`)
      this.getSalesAreaList()
    },
    async saveItem() {
      this.loadingSave = true
      try {
        if ('id' in this.detail) {
          await request.put(`/sales-areas/${this.detail.id}`, {
            name: this.detail.name,
          })
          this.$store.commit('showMessage', {
            type: 'success',
            message: 'Berhasil update User',
          })
          this.detail = false
        } else {
          await request.post('/sales-areas', { ...this.detail })
          this.$store.commit('showMessage', {
            type: 'success',
            message: 'Berhasil Menambahkan User',
          })
          this.detail = false
        }
        this.loadingSave = false
        this.dialog = false
        this.getSalesAreaList()
      } catch (err) {
        this.detail = false
        this.loadingSave = false
        this.dialog = false
      }
    },
    async getSalesAreaList() {
      this.loading = true
      const data = await request.get(
        `/sales-areas?filter=${JSON.stringify(this.filter)}`,
      )
      const totalItems = await request.get('/sales-areas/count')
      this.totalItems = totalItems.count
      console.log(this.totalitems)
      this.items = data
      this.loading = false
    },
    async getRegionList() {
      const data = await request.get('/regions')
      this.regionList = data
    },
  },
  created() {
    this.getRegionList()
  },
}
</script>
