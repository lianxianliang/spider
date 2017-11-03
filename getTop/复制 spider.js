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
					var xml = chunks.slice(chunks.indexOf("<table"), chunks.indexOf("</table>") + 8);

					if(!pages) {
						var str = chunks.slice(chunks.indexOf("</table>") + 10, -2);
						var tem = str.split(",");
						pages = tem[1].split(":")[1];
					}

					console.log("正在爬" + type + "   第" + i + "页   共" + pages + "页")

					parseString(xml, {
						explicitArray: false,
						ignoreAttrs: true
					}, function(err, result) {
						if(!result) {
							console.log("解析出错了，继续爬  " + type + "  第" + i + "页   共" + pages + "页")
							looper(type, callback);
							return;
						}

						if(i > pages) {

							// 写入文件内容（如果文件不存在会创建一个文件）
							// 写入时会先清空文件
							fs.writeFile('../json/' + type + '.json', JSON.stringify(arr), function(err) {
								if(err) {
									throw err;
								}

								console.log('保存成功', type);

								callback(null, "successful !");
								/*callback貌似必须调用，第二个参数将传给下一个回调函数的result，result是一个数组*/

								// 写入成功后读取测试
								/*
								fs.readFile('../json/110022.json', 'utf-8', function(err, data) {
									if(err) {
										throw err;
									}
									console.log(data);
								});
								*/

							});

							return;
						}
						var temp_arr = result.table.tbody.tr;
						arr = arr.concat(temp_arr);

						setTimeout(function() {
							i++;
							looper(type, callback);
						}, parseInt((Math.random() * 30000000) % 1000, 10))
					});
				}
			)

		}

		looper(type, callback)

	}

});