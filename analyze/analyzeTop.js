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

				$div = $("<div>").html(strHtml).addClass("content").attr("cur", res[0].td[1]).attr("average", averageNetAssetValue);
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
							markLine: {
								data: [{
									type: "average",
									lineStyle: {
										normal: {
											color: "#00f"
										}
									}
								}, {
									type: "average",
									lineStyle: {
										normal: {
											color: "#00f"
										}
									}
								}]
							},
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
			url: "./getTop/code.json",
			async: true
		}).then(function(arr) {
			arr.forEach(function(code) {
				analyze("json/" + code + ".json", code)
			})
		})

		$("#getUse").off("click").on("click", function() {
			$(".content").each(function() {
				var $this = $(this);
				var cur = $this.attr("cur");
				var average = $this.attr("average");
				$this.show();
				$this.next(".myChartBox").show();
				if(cur <= average) {

				} else {
					$this.hide();
					$this.next(".myChartBox").hide();
				}
			})
		})
		$("#back").off("click").on("click", function() {
			$(".content").show();
			$(".myChartBox").show();
		})
	})
})(jQuery)