var arr = [];
var num = 1;

$.ajax({
	type: "get",
	url: "./getTop/type.json",
	async: true
}).then(function(res) {
	$.each(res, function(idx, typeName) {
		getData(typeName)
	});
})

function getData(typeName) {
	$.ajax({
		type: "get",
		url: "./top/" + typeName + ".json",
		async: true
	}).then(function(data) {
		arr = arr.concat(data);
		num++;
		if(num > 9) {

			document.getElementById("Box").innerHTML = arr

			function arrCheck(arr1) {
				var newArr = [];
				for(var i = 0; i < arr1.length; i++) {
					var temp = arr1[i];
					var count = 0;
					for(var j = 0; j < arr1.length; j++) {
						if(arr1[j] == temp) {
							count++;
							arr1[j] = -1;
						}
					}
					if(temp != -1) {
						newArr.push(temp + ":" + count)
					}
				}
				return newArr;
			}
			var newArr1 = arrCheck(arr);

			var formatArr = [];
			newArr1.forEach(function(item) {
				var tem = item.split(":");
				var obj = {};
				obj[tem[0]] = tem[1];

				formatArr.push(obj)
			})

			var all = [];
			formatArr.forEach(function(item) {
				for(var key in item) {
					if(item[key] >= 5) {
						all.push(item)
					}
				}
			})

			var tem = [];
			all.forEach(function(item) {
				for(var key in item) {
					tem.push(key)
				}
			})

			var str1 = "<div>" + all.length + "</div>"
			var str2 = "<div>" + JSON.stringify(all) + "</div>"
			var str3 = "<div>" + tem.sort(function(a, b) {
				return a - b
			}).join("<br />") + "</div>"

			//document.getElementById("Box").innerHTML = str1 + str2 + str3;
		}
	})
}