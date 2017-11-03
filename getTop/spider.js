var parseString = require('xml2js').parseString;
var request = require("./request");
var fs = require("fs");
var async = require("async");

fs.readFile('./type.json', 'utf-8', function(err, data) {
	if(err) {
		throw err;
	}

	var arrCode = JSON.parse(data);
	var asyncNum = 5;

	async.mapLimit(arrCode, asyncNum, function(type, callback) {
		console.log("已有" + asyncNum + "只鸡进入下载队列");
		requestAndwrite(type, callback);
	}, function(err, result) {
		if(err) {
			console.log(err);
		} else {
			console.log("全部已下载完毕！");
		}
	});

	function requestAndwrite(type, callback) {

		var arr = [];
		var pages = undefined;
		var i = 1;

		function looper(type, callback) {

			request(
				"http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=fb&ft=ct&rs=&gs=0&sc=" + type + "&st=desc&pi=" + i + "&pn=1000&v=0.8772955120767132",
				'{"op":"ph","dt":"fb","ft":"ct","rs":"","gs":0,"sc":"' + type + '","st":"desc","pi":' + i + ',"pn":1000,"v":0.8772955120767132}',
				function(chunks) {

					var strResult = chunks.slice(chunks.indexOf("["), chunks.indexOf("]") + 1);
					if(!pages) {
						var str = chunks.slice(chunks.indexOf("]") + 2, -2);
						var tem = str.split(",");
						pages = tem[3].split(":")[1];
					}

					console.log("正在爬" + type + "   第" + i + "页   共" + pages + "页");

					if(!strResult) {
						console.log("出错了，继续爬  " + type + "  第" + i + "页   共" + pages + "页")
						looper(type, callback);
						return;
					}

					var result = JSON.parse(strResult);

					if(i > pages) {

						fs.writeFile('../top/' + type + '.json', JSON.stringify(arr), function(err) {
							if(err) {
								throw err;
							}

							console.log('保存成功', type);

							callback(null, "successful !");

						});

						return;
					}
					
					var temp_arr = [];
					result.forEach(function (str) {
						var a=str.split(",");
						temp_arr.push(a[0])
					})
					
					arr = arr.concat(temp_arr);
					
					setTimeout(function() {
						i++;
						looper(type, callback);
					}, parseInt((Math.random() * 30000000) % 1000, 10))

				}
			)

		}

		looper(type, callback)

	}

});

var rankData = {
	datas: ["150270,招商中证白酒指数分级B,ZSZZBJZSFJB,2017-11-01,1.22,2.1730,8.5409,19.1406,34.0263,83.1659,141.1931,307.3484,,149.2665,138.2988,2015-05-27,,,,,,分级杠杆,", "150330,方正富邦保险主题指数分级B,FZFBBXZTZSFJB,2017-11-01,1.6480,1.6480,8.5639,18.4759,14.0484,71.8457,79.7165,86.6365,,78.1622,64.80,2015-07-31,,,,,,分级杠杆,", "150131,国泰国证医药卫生指数分级B,GTGZYYWSHYZSFJB,2017-11-01,0.6665,1.7604,-3.7824,18.4467,30.1757,23.7237,10.5856,-10.5370,20.8821,25.8734,39.5584,2013-08-29,,,,,,分级杠杆,", "150149,信诚中证800医药指数分级B,XCZZ800YYZSFJB,2017-11-01,0.8470,1.8770,-2.1940,16.5062,29.3130,29.3130,39.0804,27.1771,52.0490,52.3380,71.9674,2013-08-16,,,,,,分级杠杆,", "150199,国泰国证食 品饮料行业指数B,GTGZSPYLHYZSB,2017-11-01,1.4793,2.5882,3.6578,14.3465,37.0738,74.2198,98.8040,168.2809,212.3131,111.9038,211.9696,2014-10-23,,,,,,分级杠杆,", "150284,申万菱信申万医药生物分级B,SWLXSWYYSWFJB,2017-11-01,0.8733,0.8733,-3.1066,13.8444,24.6859,21.1067,11.5468,-5.2511,,25.6367,-12.6787,2015-06-19,,,,,,分级杠杆,", "150230,鹏华酒分级B,PHJFJB,2017-11-01,1.5930,1.5930,6.2708,12.8987,26.8312,61.5619,89.4174,156.1093,,98.1343,59.30,2015-04-29,,,,,,分级杠杆,", "150136, 国富中证100指数增强分级B,GFZZ100ZSZQFJB,2017-11-01,1.0060,1.0060,2.7579,12.4022,17.9367,60.1911,78.3688,55.7276,,74.6528,0.60,2015-03-26,,,,,,分级杠杆,", "502015,长盛中证申万一带一路分级B,CSZZSWYDYLFJB,2017-11-01,0.7980,0.4785,7.4022,10.8328,12.8716,22.7690,54.3520,-22.9729,,35.7146,-85.6661,2015-05-29,,,,,,分级杠杆,", "150232,申万菱信申万电子分级B,SWLXSWDZFJB,2017-11-01,1.4864,0.8476,0.3441,10.5213,28.7148,37.8209,36.4548,-6.6053,,54.5114,-63.2025,2015-05-14,,,,,,分级杠 杆,"],
	allRecords: 411,
	pageIndex: 1,
	pageNum: 10,
	allPages: 42
};