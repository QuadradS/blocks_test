<template>
  <div>

    <h2 v-if="error.isError">
      Error to load data!
    </h2>

    <table-lite
        :is-slot-mode="true"
        :is-loading="table.isLoading"
        :columns="table.columns"
        :rows="table.rows"
        :total="table.totalRecordCount"
        :sortable="table.sortable"
        @do-search="doSearch"
        @is-finished="table.isLoading = false"
    >
      <template v-slot:name="data">
        {{ data.value.name }}
      </template>
    </table-lite>

  </div>

</template>

<script>
import {defineComponent, reactive} from 'vue'
import TableLite from 'vue3-table-lite'
import axios from 'axios';

export default defineComponent({
  name: "App",
  components: {TableLite},
  setup() {
    const error = reactive({isError: false})

    const table = reactive({
      isLoading: false,
      columns: [
        {
          label: "Hash",
          field: "hash",
          width: "10%",
          sortable: false,
          isKey: true,
        },
        {
          label: "Level",
          field: "level",
          width: "10%",
          sortable: true,
        },
        {
          label: "Timestamp",
          field: "timestamp",
          width: "35%",
          sortable: false,
        },
        {
          label: "Proposer",
          field: "proposer",
          width: "10%",
          sortable: false,
        },
        {
          label: "Reward",
          field: "reward",
          width: "15%",
          sortable: true,
        },
        {
          label: "Fees",
          field: "fees",
          width: "15%",
          sortable: true,
        },
      ],
      rows: [],
      totalRecordCount: 0,
      sortable: {
        order: "level",
        sort: "asc",
      },
    });

    const fetchData = async ({offset, limit, order, sort}) => {
      const getRowsDataUrl = `https://api.mumbainet.tzkt.io/v1/blocks?limit=${limit}&offset=${offset}&sort.${sort}=${order}`;
      const getRowsCountUrl = 'https://api.mumbainet.tzkt.io/v1/blocks/count'

      const rowsData = await axios.get(getRowsDataUrl);
      const rowsCount = await axios.get(getRowsCountUrl);

      return {
        rowsData,
        rowsCount
      }
    }

    const doSearch = async (offset, limit, order, sort) => {
      try {
        table.isLoading = true;
        const {rowsData, rowsCount} = await fetchData({offset, limit, order, sort})


        const rows = rowsData.data.map(({hash, level, timestamp, proposer, reward, fees}) => ({
          hash,
          level,
          timestamp: new Date(timestamp).toDateString(),
          proposer: proposer?.address || '-',
          reward,
          fees
        }))

        table.rows = rows;
        table.totalRecordCount = rowsCount.data;
        table.sortable.order = order;
        table.sortable.sort = sort;
        error.isError = false
      } catch (e) {
        error.isError = true
      }
    };
    const tableLoadingFinish = () => table.isLoading = false

    // Get data first
    doSearch(0, 10, 'level', 'asc');

    return {
      table,
      doSearch,
      tableLoadingFinish,
      error
    };
  }
})
</script>