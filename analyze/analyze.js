(function($) {
	$(function() {

		function analyze(url, name) {

			$.ajax({
				type: "get",
				url: url,
				async: true
			}).then(function(res) {

				var oneDay = 24 * 60 * 60 * 1000;
				var strHtml = "";

				var startDate = res[res.length - 1].td[0].split("-");
				startDate = new Date(startDate[0], startDate[1] - 1, startDate[2]);
				if(res[0].td[3].slice(0, -1) > 0) {
					var temp = "<h2>" + name + "  " + res[0].td[1] + "  <b class='up'>" + res[0].td[3] + "</b></h2>"
				} else {
					var temp = "<h2>" + name + "  " + res[0].td[1] + "  <b class='down'>" + res[0].td[3] + "</b></h2>"
				}
				strHtml += temp;

				var endDate = res[0].td[0].split("-");
				endDate = new Date(endDate[0], endDate[1] - 1, endDate[2]);

				var temp = "<p>开始时间 <b>" + res[res.length - 1].td[0] + "</b></p>";
				strHtml += temp;

				var temp = "<p>结束时间 <b>" + res[0].td[0] + "</b></p>";
				strHtml += temp;

				var allDay = (Date.parse(endDate) - Date.parse(startDate)) / oneDay;
				var temp = "<p>总天数 <b>" + allDay + "</b></p>";
				strHtml += temp;

				var total = 0; // 单位净值总数
				var rate = 0; // 日增长率

				var arrNetAssetValue = [];
				var arrRate = [];

				var arrDate = [];
				res.forEach(function(obj) {

					arrDate.push(obj.td[0])

					total += (obj.td[1] - 0);
					rate += (obj.td[3].slice(0, -1) - 0);

					arrNetAssetValue.push(obj.td[1] - 0);
					arrRate.push(obj.td[3].slice(0, -1) - 0);
				})

				// 单位净值 最大值
				var maxNetAssetValue = Math.max.apply(Math, arrNetAssetValue);
				var temp = "<p>单位净值 最大值 <b>" + maxNetAssetValue + "</b></p>";
				strHtml += temp;

				// 单位净值 最小值
				var minNetAssetValue = Math.min.apply(Math, arrNetAssetValue);
				var temp = "<p>单位净值 最小值 <b>" + minNetAssetValue + "</b></p>";
				strHtml += temp;

				// 单位净值平均数
				var averageNetAssetValue = total / res.length;
				var temp = "<p> 单位净值 平均值 <b>" + averageNetAssetValue + "</b></p><p>";
				//				var temp = "<p>单位净值总数 <b>" + total + "</b> 单位净值平均数 <b>" + averageNetAssetValue + "</b></p><p>";
				strHtml += temp;

				// 日增长率 最大值
				var maxRate = Math.max.apply(Math, arrRate);
				var temp = "<p>日增长率 最大值 <b>" + maxRate + "%</b></p>";
				strHtml += temp;

				// 日增长率 最小值
				var minRate = Math.min.apply(Math, arrRate);
				if(minRate > 0) {
					var temp = "<p>日增长率 最小值 <b class='up'>" + minRate + "%</b></p>";
				} else {
					var temp = "<p>日增长率 最小值 <b class='down'>" + minRate + "%</b></p>";
				}
				strHtml += temp;

				// 日增长率平均数
				//				var averageRate = rate / allDay;
				var averageRate = rate / res.length;
				//				var temp = "<p>日增长率总数 <b>" + rate + "</b> 日增长率平均数 <b>" + averageRate + "%</b></p>";
				var temp = "<p>日增长率 平均值 <b>" + averageRate + "%</b></p>";
				strHtml += temp;

				$div = $("<div>").html(strHtml);
				$("body").append($div);

				// 基于准备好的dom，初始化echarts实例
				var myChartBox = $("<div class='myChartBox'>").get(0);
				$("body").append(myChartBox);
				var myChart = echarts.init(myChartBox);

				// 指定图表的配置项和数据
				var option = {
					title: {
						//						text: name
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['单位净值', '日增长率']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					toolbox: {
						feature: {
							dataZoom: {
								yAxisIndex: 'none'
							},
							saveAsImage: {}
						}
					},

					dataZoom: [{
						type: 'inside',
						throttle: 50
					}],
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: arrDate.reverse()
					},
					yAxis: {
						type: 'value'
					},
					series: [{
							name: '单位净值',
							type: 'line',
							stack: '总量',
							data: arrNetAssetValue.reverse()
						},
						//						{
						//							name: '日增长率',
						//							type: 'line',
						//							stack: '总量',
						//							data: arrRate.reverse()
						//						}
					],
					color: ["#f00", "#00f"]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option, true);
			})
		}

		$.ajax({
			type: "get",
			url: "./getData/code.json",
			async: true
		}).then(function(arr) {
			arr.forEach(function(code) {
				analyze("json/" + code + ".json", code)
			})
		})

		/*
		// 汇添富消费行业混合(000083)
		analyze("json/000083.json", "汇添富消费行业混合(000083)")
		// 汇添富中证主要消费ETF联接(000248)
		analyze("json/000248.json", "汇添富中证主要消费ETF联接(000248)")
		// 上投摩根核心成长(000457)
		analyze("json/000457.json", "上投摩根核心成长(000457)")
		// 广发竞争优势混合(000529)
		analyze("json/000529.json", "广发竞争优势混合(000529)")
		// 东方红产业升级混合(000619)
		analyze("json/000619.json", "东方红产业升级混合(000619)")
		// 国泰新经济灵活配置混合(000742)
		analyze("json/000742.json", "国泰新经济灵活配置混合(000742)")
		// 嘉实新兴产业股票(000751)
		analyze("json/000751.json", "嘉实新兴产业股票(000751)")
		// 东方红中国优势混合(001112)
		analyze("json/001112.json", "东方红中国优势混合(001112)")
		// 诺安低碳经济股票(001208)
		analyze("json/001208.json", "诺安低碳经济股票(001208)")
		// 国泰互联网+股票(001542)
		analyze("json/001542.json", "国泰互联网+股票(001542)")
		// 东方红沪港深混合(002803)
		analyze("json/002803.json", "东方红沪港深混合(002803)")
		// 华富元鑫灵活配置混合A(002853)
		analyze("json/002853.json", "华富元鑫灵活配置混合A(002853)")
		// 国泰成长优选混合(020026)
		analyze("json/020026.json", "国泰成长优选混合(020026)")
		// 嘉实优化红利混合(070032)
		analyze("json/070032.json", "嘉实优化红利混合(070032)")
		// 易方达上证50指数A(110003)
		analyze("json/110003.json", "易方达上证50指数A(110003)")
		// 易方达消费行业（110022）
		analyze("json/110022.json", "易方达消费行业（110022）")
		// 国泰国证食品饮料行业指数分级(160222)
		analyze("json/160222.json", "国泰国证食品饮料行业指数分级(160222)")
		// 招商中证白酒指数分级(161725)
		analyze("json/161725.json", "招商中证白酒指数分级(161725)")
		// 景顺长城鼎益混合(LOF)(162605)
		analyze("json/162605.json", "景顺长城鼎益混合(LOF)(162605)")
		// 方正富邦保险主题指数分级(167301)
		analyze("json/167301.json", "方正富邦保险主题指数分级(167301)")
		// 景顺长城新兴成长混合(260108)
		analyze("json/260108.json", "景顺长城新兴成长混合(260108)")
		// 广发新经济混合(270050)
		analyze("json/270050.json", "广发新经济混合(270050)")
		// 兴全社会责任混合(340007)
		analyze("json/340007.json", "兴全社会责任混合(340007)")
		// 上投摩根新兴动力混合A(377240)
		analyze("json/377240.json", "上投摩根新兴动力混合A(377240)")
		// 工银深证红利联接(481012)
		analyze("json/481012.json", "工银深证红利联接(481012)")
		// 汇添富蓝筹稳健(前端：519066  后端：519067)
		analyze("json/519066.json", "汇添富蓝筹稳健(前端：519066  后端：519067)")
		// 汇添富成长焦点混合(前端：519068  后端：519071)
		analyze("json/519068.json", "汇添富成长焦点混合(前端：519068  后端：519071)")
		// 交银稳健配置混合A(519690)
		analyze("json/519690.json", "交银稳健配置混合A(519690)")
		// 汇丰晋信恒生龙头指数A(540012)
		analyze("json/540012.json", "汇丰晋信恒生龙头指数A(540012)")
		*/

	})
})(jQuery)