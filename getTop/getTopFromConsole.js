//http://fund.eastmoney.com/data/fundranking.html
//将下面这段代码复制到控制台执行
var arrTr = document.getElementById("dbtable").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
var arr_result = [];
for(var i = 0, len = arrTr.length; i < len; i++) {
	var temp = arrTr[i].children[3].innerText;
	if(temp.search("国泰") == -1 && temp.search("南方") == -1) {
		arr_result.push(arrTr[i].children[2].innerText)
	}
}
console.log(arr_result.length)
JSON.stringify(arr_result);