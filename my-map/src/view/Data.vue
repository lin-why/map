<template>
  <div><text-content :arr="data"/></div>
</template>

<script>
import TextContent from '../components/TextContent'
import { request } from '../network/request'
export default {
  name:'Data',
  components: {
    TextContent
  },
  data () {
    return {
      data: []
    }
  },
  mounted () {
    request().then(res => {
      this.data = res.data.arr;
      console.log(res)
    })
  }
}
</script scoped>

<style>

</style>