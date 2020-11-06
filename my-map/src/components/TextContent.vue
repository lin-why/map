<template>
  <div>
    <div class="title">
      <table class="table" border="1" cellspacing=0>
        <tr>
          <td>地区</td>
          <td>确诊</td>
          <td>死亡</td>
          <td>治愈</td>
        </tr>
        <tr v-for="(item,index) in arr" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.quezheng}}</td>
          <td>{{item.died}}</td>
          <td>{{item.zhiyu}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextContent',
  props: {
    arr:{
      type: Array,
      default(){
      return [];
      }
    }
  }
}
</script>

<style scoped>
  .table {
    position: relative;
    left: 50%;
    transform: translate(-50%);
  }
</style>