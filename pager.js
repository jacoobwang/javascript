var PageManager = {
	init : function(opt){
		var instance = $.extend({}, this.instance);
		instance.init(opt);
		return instance;
	},
	instance: {
		callback: [],
		option: {
			data: [],
			curPage: -1,
			pageSize: 5,
			total: 0,
			content_template: null,
			contentCId: null,
			page_template: null,
			pageCId: null 
		},
		
		init : function(opt){
			$.extend(this.option, opt);
			this.option.total = Math.ceil(this.option.data.length / this.option.pageSize);
			this.setPage(1);
			this.fillPage();
		},
		
		setPage: function(i){
			if(i == this.option.curPage) return false;
			var data = this.incision(i);
			if(!data) return false;
			this.option.curPage = i;
			this.fillTemplate(data);
			for(var n = 0; n != this.callback.length; n++){
				this.callback[n].call(this, i);
			}
		},
		
		next: function(){
			this.setPage(this.option.curPage + 1);
		},
		
		pre: function(){
			this.setPage(this.option.curPage - 1);
		},
		
		isChange: function(func){
			this.callback.push(func);
		},
		
		incision: function(i){
			var start = (i - 1) * this.option.pageSize;
			if(this.option.data.length <= start || i < 1) return false;
			return this.option.data.slice(start, start + this.option.pageSize);
		},
		
		fillTemplate: function(arr){
			if(!this.option.content_template) return alert("template is undefined");
			if(!this.option.contentCId) return alert("contentId is undefined");
			var html = '';
			for(var i = 0; i != arr.length; i++){
				var data = arr[i];
				var n = (this.option.curPage - 1) * this.option.pageSize + i + 1;
				html += this.option.content_template.replace(/\$\{([^\}]+)\}/g, function($0, $1){
					return eval($1);
				});
			}
			$(this.option.contentCId).html(html);
		},
		
		fillPage: function(){
			if(!this.option.page_template) return false;
			if(!this.option.pageCId) return false;
			var html = '';
			for(var pageNum = 1; pageNum <= this.option.total; pageNum++){
				html += this.option.page_template.replace(/\$\{([^\}]+)\}/g, function($0, $1){
					return eval($1);
				});
			}
			$(this.option.pageCId).html(html);
		}
	}
};

var contTemp = '<li>\
				<span class="col col_name">${decodeURIComponent(data.sNickName)}</span>\
				<span class="col col_qq">${data.iUin}</span>\
				<span class="col col_value">${data.iFightNum}</span>\
				<span class="col col_rate">${Math.round((parseInt(data.iSuccessTimes)/(parseInt(data.iSuccessTimes) + parseInt(data.iFailedTimes) + parseInt(data.iEqualTimes))) * 100) + "%"}</span>\
			</li>';
var pageTemp = "<a href='javascript: pm.setPage(${pageNum})' class='pageNum'>${pageNum}</a>";
$(function(){
	window.pm = PageManager.init({
		data: getA20130821powerList_result.getList,
		contentCId: '.rankShow_bd',
		content_template: contTemp,
		pageCId: '.rankShow_ft',
		page_template: pageTemp
	});
	
	$($('.rankShow_ft .pageNum').removeClass('active')[0]).addClass('active');
	$('.rankShow_ft').html('<a href="javascript: pm.pre();">上一页</a>' + $('.rankShow_ft').html() + '<a href="javascript: pm.next();">下一页</a>');
	pm.isChange(function(i){
		$($('.rankShow_ft .pageNum').removeClass('active')[i - 1]).addClass('active');
	});
});


function setCookie(b, a, d, c, e, g) {
    var f = new Date;
    d = d || null;
    c = c || "/";
    e = e || null;
    g = g || !1;
    d && f.setMinutes(f.getMinutes() + parseInt(d));
    b = escape(b) + "=" + escape(a) + (d ? "; expires=" + f.toGMTString() : "") + (c ? "; path=" + c: "") + (e ? "; domain=" + e: "") + (g ? "; secure": "");
    document.cookie = b
}