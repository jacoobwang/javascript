/**
 * Created by wangyong7 on 2016/4/15.
 */
define(function(require, exports, module) {

    var $ = require('jquery'),
        Mustache = require('mustache'),
        RestApi = require('./ecp.rest'),
        Highcharts = require('highcharts');

    /**
     * 绘制折线图
     */
    var drawlegendChart = function(id,xData,yData){
        var chart = new Highcharts.Chart({
            credits : {
                enabled : false
            },
            chart: {
                renderTo: id
            },
            title: {
                text: '需求提交趋势',
                x: 0 //center
            },
            xAxis: {
                categories:xData
            },
            yAxis: [{
                title: {
                    text: '金额 (元)'
                },
                min: 0,
                plotLines: [{
                    color: '#c53b3b'
                }]
            },
            {
                title: {
                    text: '数量 (个)'
                },
                min: 0,
                labels:{
                    formatter: function () {
                        return (this.value)+"个" ;
                    }
                },
                opposite:true
            }],
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
                }
            }, 
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                itemMarginBottom:10,
                borderWidth: 0
            },
            series:yData
        });
        return chart;
    };

    var drawPielChart = function(id,title,data){
        var chart = new Highcharts.Chart({
            credits : {
                enabled : false
            },
            chart: {
                renderTo: id,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: title
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: data
            }]
        });
        return chart;
    };

    var doChart1 = function(data1,data2){
        var xData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var yData = [{
            name: '金额',
            yAxis : 0,
            data: data1
        }, {
            name: '数量',
            yAxis : 1,
            data: data2
        }];

        drawlegendChart('container',xData,yData);
    };

    var doChart2 = function(id,title,data){
        /**var data = [['Firefox',   45.0],
            ['IE',       26.8],
            ['Chrome',   12.8],
            ['Safari',    8.5],
            ['Opera',     6.2],
            ['Others',   0.7]];**/
        drawPielChart(id,title,data);        
    };

    var doClick = function(){
        $(".js_search_btn").click(function(){
            var word =  $(".js_search_word").val();
            RestApi.getUserInfo(word).success(function(data){
                 if(data.ret == 1){
                    var tpl_top = $("#js_top_tpl").html();    
                    var html = Mustache.to_html(tpl_top, data.rs);
                    $(".baseInfo").html(html);
                    doChart1(data.money, data.num);
                    doChart2('container2', '需求类型占比',   data.type);
                    doChart2('container3', '外包供应商占比', data.type);
                    $(".border").show();
                 }    
            }); 
        });
    };

    exports.init = function(){
        doClick();
        /**RestApi.getUserInfo('').success(function(data){
             if(data.ret == 1){
                var tpl_top = $("#js_top_tpl").html();    
                var html = Mustache.to_html(tpl_top, data.rs);
                $(".baseInfo").html(html);
             }  
        });**/ 
    };
});
