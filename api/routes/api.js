var express = require('express');
var router = express.Router();
const https = require('https');
const cheerio = require('cheerio');

let url = 'https://user.guancha.cn/app/pneumonia'; //请求地址

https.get(url, function (res) {
    let chunks = [],
        size = 0;
    res.on('data', function (chunk) {
        chunks.push(chunk);
        size += chunk.length;
    });

    res.on('end', function () {
        console.log('数据包传输完毕');
        let data = Buffer.concat(chunks, size);
        let html = data.toString();
        let $ = cheerio.load(html); //加载网页
        let result = [];
        let china_qz = $('.china').find('.total-num').eq(4).text();
        let china_sw = $('.china').find('.total-num').eq(7).text();
        let china_zy = $('.china').find('.total-num').eq(6).text();
        result.push({name: "中国",quezheng: china_qz,died: china_sw,zhiyu: china_zy});
        $('.world').find('.city-item').each( i => {
            let map = {};
            map.name = $('.world').find('.city-item').eq(i).find('.c1').text();
            map.quezheng = $('.world').find('.city-item').eq(i).find('.c2').eq(0).text()
            map.died = $('.world').find('.city-item').eq(i).find('.c2').eq(1).text();
            map.zhiyu = $('.world').find('.city-item').eq(i).find('.c2').eq(2).text();
            result.push(map);
        })
        // console.log(result)
        router.get('/', function(req, res, next) { //json化
        res.json({arr:result})
        })
    });
});
module.exports = router;
