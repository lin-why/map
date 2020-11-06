<template>
  <div class="map">
    <div
      ref="mapbox"
      id="chart"
      style="height:100vh; width:90vw; margin: 0 auto;"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts/map/js/world.js";
import jsonp from "jsonp";
import {request} from '../network/request.js';
const option = {
  title: {
    text: "疫情地图",
    x: "center", //居中
    textStyle: {
      color: "#9c0505"
    },
  },
  series: [
    {
      type: "map", //告诉echarts 渲染地图
      map: "world",
      label: {
        show: false, //是否显示各个地区名称
        color: "#000", //文字颜色
        fontSize: 10 //文字大小
      },
      itemStyle: {
        //地图区域多边形 图形样式
        borderColor: "#ccc", //地图边框颜色
        borderWidth: 1, //地图边框大小
        areaColor: "#fff" //区域的背景颜色
      },
      emphasis: {
        //高亮状态下的多边形和标签样式
        //控制地图划过的颜色
        label: {
          color: "#fff", //移入后显示颜色
          fontSize: 12
        },
        //控制鼠标滑过时的高亮样式
        itemStyle: {
          //移入后颜色和边框
          areaColor: "#8dc63f", //区域颜色
          borderWidth: "yellow" //边框颜色
        }
      },
      zoom: .8 ,//控制地图的大小
    }
  ],
  visualMap: [
    {
      type: "piecewise",
      show: true,
      splitNumber: 6,
      pieces: [
        {
          min: 10000
        }, // 不指定 max，表示 max 为无限大（Infinity）。
        {
          min: 1000,
          max: 9999
        },
        {
          min: 100,
          max: 999
        },
        {
          min: 10,
          max: 99
        },
        {
          min: 1,
          max: 9
        },
        {
          min: 0,
          max: 0
        }
      ],
      //align:'right' // 默认是left
      inRange: {
        //定义选中范围中的视觉元素
        // symbol: "rect",
        color: ["#fff", "#ffaa85", "#ff7b69", "#cc2929", "#8c0d0d", "#660208"] //颜色可以实时在地图上取
      },
      itemHeight: 10, //显示框的宽高
      itemWidth: 10
    }
  ],
  tooltip: {//提示信息
    tigger: "item",
    //地图:{a}系列名称,{b}区域名称,{c}合并数据,{d}无
    formatter:    "地区: {b}<br />确诊: {c}"
    // position: function (pos, params, dom, rect, size) {
    //       // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
    //       var obj = {top: 60};
    //       obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
    //       return obj;
    //   }
  },
  toolbox: {
    //工具栏 下载 刷新
    show: true,
    orient: "horizontal", //工具栏 icon的布局朝向
    left: "right", //右上角
    top: "top",
    feature: {
      saveAsImage: {} //保存为图片
    }
  },
  nameMap:{ //英文转中文
    "Canada": "加拿大",
    "Turkmenistan": "土库曼斯坦",
    "Saint Helena": "圣赫勒拿",
    "Lao PDR": "老挝",
    "Lithuania": "立陶宛",
    "Cambodia": "柬埔寨",
    "Ethiopia": "埃塞俄比亚",
    "Faeroe Is.": "法罗群岛",
    "Swaziland": "斯威士兰",
    "Palestine": "巴勒斯坦",
    "Belize": "伯利兹",
    "Argentina": "阿根廷",
    "Bolivia": "玻利维亚",
    "Cameroon": "喀麦隆",
    "Burkina Faso": "布基纳法索",
    "Aland": "奥兰群岛",
    "Bahrain": "巴林",
    "Saudi Arabia": "沙特阿拉伯",
    "Fr. Polynesia": "法属波利尼西亚",
    "Cape Verde": "佛得角",
    "W. Sahara": "西撒哈拉",
    "Slovenia": "斯洛文尼亚",
    "Guatemala": "危地马拉",
    "Guinea": "几内亚",
    "Dem. Rep. Congo": "刚果（金）",
    "Germany": "德国",
    "Spain": "西班牙",
    "Liberia": "利比里亚",
    "Netherlands": "荷兰",
    "Jamaica": "牙买加",
    "Solomon Is.": "所罗门群岛",
    "Oman": "阿曼",
    "Tanzania": "坦桑尼亚",
    "Costa Rica": "哥斯达黎加",
    "Isle of Man": "曼岛",
    "Gabon": "加蓬",
    "Niue": "纽埃",
    "Bahamas": "巴哈马",
    "New Zealand": "新西兰",
    "Yemen": "也门",
    "Jersey": "泽西岛",
    "Pakistan": "巴基斯坦",
    "Albania": "阿尔巴尼亚",
    "Samoa": "萨摩亚",
    "Czech Rep.": "捷克",
    "United Arab Emirates": "阿拉伯联合酋长国",
    "Guam": "关岛",
    "India": "印度",
    "Azerbaijan": "阿塞拜疆",
    "N. Mariana Is.": "北马里亚纳群岛",
    "Lesotho": "莱索托",
    "Kenya": "肯尼亚",
    "Belarus": "白俄罗斯",
    "Tajikistan": "塔吉克斯坦",
    "Turkey": "土耳其",
    "Afghanistan": "阿富汗",
    "Bangladesh": "孟加拉国",
    "Mauritania": "毛里塔尼亚",
    "Dem. Rep. Korea": "朝鲜",
    "Saint Lucia": "圣卢西亚",
    "Br. Indian Ocean Ter.": "英属印度洋领地",
    "Mongolia": "蒙古",
    "France": "法国",
    "Cura?ao": "库拉索岛",
    "S. Sudan": "南苏丹",
    "Rwanda": "卢旺达",
    "Slovakia": "斯洛伐克",
    "Somalia": "索马里",
    "Peru": "秘鲁",
    "Vanuatu": "瓦努阿图",
    "Norway": "挪威",
    "Malawi": "马拉维",
    "Benin": "贝宁",
    "St. Vin. and Gren.": "圣文森特和格林纳丁斯",
    "Korea": "韩国",
    "Singapore": "新加坡",
    "Montenegro": "黑山共和国",
    "Cayman Is.": "开曼群岛",
    "Togo": "多哥",
    "China": "中国",
    "Heard I. and McDonald Is.": "赫德岛和麦克唐纳群岛",
    "Armenia": "亚美尼亚",
    "Falkland Is.": "马尔维纳斯群岛（福克兰）",
    "Ukraine": "乌克兰",
    "Ghana": "加纳",
    "Tonga": "汤加",
    "Finland": "芬兰",
    "Libya": "利比亚",
    "Dominican Rep.": "多米尼加",
    "Indonesia": "印度尼西亚",
    "Mauritius": "毛里求斯",
    "Eq. Guinea": "赤道几内亚",
    "Sweden": "瑞典",
    "Vietnam": "越南",
    "Mali": "马里",
    "Russia": "俄罗斯",
    "Bulgaria": "保加利亚",
    "United States": "美国",
    "Romania": "罗马尼亚",
    "Angola": "安哥拉",
    "Chad": "乍得",
    "South Africa": "南非",
    "Fiji": "斐济",
    "Liechtenstein": "列支敦士登",
    "Malaysia": "马来西亚",
    "Austria": "奥地利",
    "Mozambique": "莫桑比克",
    "Uganda": "乌干达",
    "Japan": "日本",
    "Niger": "尼日尔",
    "Brazil": "巴西",
    "Kuwait": "科威特",
    "Panama": "巴拿马",
    "Guyana": "圭亚那",
    "Madagascar": "马达加斯加",
    "Luxembourg": "卢森堡",
    "American Samoa": "美属萨摩亚",
    "Andorra": "安道尔",
    "Ireland": "爱尔兰",
    "Italy": "意大利",
    "Nigeria": "尼日利亚",
    "Turks and Caicos Is.": "特克斯和凯科斯群岛",
    "Ecuador": "厄瓜多尔",
    "U.S. Virgin Is.": "美属维尔京群岛",
    "Brunei": "文莱",
    "Australia": "澳大利亚",
    "Iran": "伊朗",
    "Algeria": "阿尔及利亚",
    "El Salvador": "萨尔瓦多",
    "C?te d'Ivoire": "科特迪瓦",
    "Chile": "智利",
    "Puerto Rico": "波多黎各",
    "Belgium": "比利时",
    "Thailand": "泰国",
    "Haiti": "海地",
    "Iraq": "伊拉克",
    "S?o Tomé and Principe": "圣多美和普林西比",
    "Sierra Leone": "塞拉利昂",
    "Georgia": "格鲁吉亚",
    "Denmark": "丹麦",
    "Philippines": "菲律宾",
    "S. Geo. and S. Sandw. Is.": "南乔治亚岛和南桑威奇群岛",
    "Moldova": "摩尔多瓦",
    "Morocco": "摩洛哥",
    "Namibia": "纳米比亚",
    "Malta": "马耳他",
    "Guinea-Bissau": "几内亚比绍",
    "Kiribati": "基里巴斯",
    "Switzerland": "瑞士",
    "Grenada": "格林纳达",
    "Seychelles": "塞舌尔",
    "Portugal": "葡萄牙",
    "Estonia": "爱沙尼亚",
    "Uruguay": "乌拉圭",
    "Antigua and Barb.": "安提瓜和巴布达",
    "Lebanon": "黎巴嫩",
    "Uzbekistan": "乌兹别克斯坦",
    "Tunisia": "突尼斯",
    "Djibouti": "吉布提",
    "Greenland": "格陵兰",
    "Timor-Leste": "东帝汶",
    "Dominica": "多米尼克",
    "Colombia": "哥伦比亚",
    "Burundi": "布隆迪",
    "Bosnia and Herz.": "波斯尼亚和黑塞哥维那",
    "Cyprus": "塞浦路斯",
    "Barbados": "巴巴多斯",
    "Qatar": "卡塔尔",
    "Palau": "帕劳",
    "Bhutan": "不丹",
    "Sudan": "苏丹",
    "Nepal": "尼泊尔",
    "Micronesia": "密克罗尼西亚",
    "Bermuda": "百慕大",
    "Suriname": "苏里南",
    "Venezuela": "委内瑞拉",
    "Israel": "以色列",
    "St. Pierre and Miquelon": "圣皮埃尔和密克隆群岛",
    "Central African Rep.": "中非",
    "Iceland": "冰岛",
    "Zambia": "赞比亚",
    "Senegal": "塞内加尔",
    "Papua New Guinea": "巴布亚新几内亚",
    "Trinidad and Tobago": "特立尼达和多巴哥",
    "Zimbabwe": "津巴布韦",
    "Jordan": "约旦",
    "Gambia": "冈比亚",
    "Kazakhstan": "哈萨克斯坦",
    "Poland": "波兰",
    "Eritrea": "厄立特里亚",
    "Kyrgyzstan": "吉尔吉斯斯坦",
    "Montserrat": "蒙特塞拉特",
    "New Caledonia": "新喀里多尼亚",
    "Macedonia": "马其顿",
    "Paraguay": "巴拉圭",
    "Latvia": "拉脱维亚",
    "Hungary": "匈牙利",
    "Syria": "叙利亚",
    "Honduras": "洪都拉斯",
    "Myanmar": "缅甸",
    "Mexico": "墨西哥",
    "Egypt": "埃及",
    "Nicaragua": "尼加拉瓜",
    "Cuba": "古巴",
    "Serbia": "塞尔维亚",
    "Comoros": "科摩罗",
    "United Kingdom": "英国",
    "Fr. S. Antarctic Lands": "南极洲",
    "Congo": "刚果（布）",
    "Greece": "希腊",
    "Sri Lanka": "斯里兰卡",
    "Croatia": "克罗地亚",
    "Botswana": "博茨瓦纳",
    "Siachen Glacier": "锡亚琴冰川地区"
}
};
export default {
  name: "Map",
  components: {},
  props: {},
  data() {
    return {
      mychart: "",
      mydata:[]
    };
  },
  computed: {},
  created() {},
  beforeDestroy() {},
  mounted() {
    this.getData();
    this.mychart = echarts.init(this.$refs.mapbox); //获取mapbox盒子
    this.mychart.setOption(option);
  },
  watch: {},
  methods: {
    getData() {
      request().then(res => {
        this.mydata = res.data.arr;
        // console.log(this.mydata)
       let lists = res.data.arr.map(item => {
         return {
           name: item.name,
           value: item.quezheng
         }
       })
       option.series[0].data = lists;
       this.mychart.setOption(option);
    })
    },
   
  }
};
</script>

<style scoped>
  body{
    margin: 0px;
    padding: 0px;
  }
</style>
