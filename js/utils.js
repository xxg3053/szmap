
//测距、面积  
function handleMeasurements(event) {  
    var geometry = event.geometry;  
    var units = event.units;  
    var order = event.order;  
    var measure = event.measure;  
    var out = "";  
    if(order == 1) {
        out += "距离: " + measure.toFixed(3) + " " + UnitsToCHS(units);  
    } else {  
        out += "面积: " + measure.toFixed(3) + " " + "平方"+UnitsToCHS(units);  
    }  
    $("#output").show();
    $("#output").html(out);  
}
/**
 * @Author   KENFO
 * @Email    xxg3053@qq.com
 * @DateTime 2015-06-26T10:56:20+0800
 * @param    {[type]}
 */
function UnitsToCHS(units)
{
    var unitsCHS = units;
    switch (units.toLowerCase())
    {
	    case "m":
		    unitsCHS = "米";
		    break;
	    case "km":
		    unitsCHS = "千米";
		    break;
    }
    return unitsCHS;
}
/**
 * @Author   KENFO
 * @Email    xxg3053@qq.com
 * @DateTime 2015-06-26T11:02:22+0800
 * @describe 重置地图
 * @return   {[type]}
 */
function resetAll(){
    pointLayer.clearMarkers();
	lineLayer.removeAllFeatures();
	polygonLayer.removeAllFeatures();
	arealayer.removeAllFeatures();
    if(glLayer){
        map.removeLayer(glLayer);
        glLayer="";
    }
    if(searchVectorLayer){
        map.removeLayer(searchVectorLayer);
        searchVectorLayer="";
    }
    $('#showMessage').html("");
      map.zoomTo(0);
    toggleControl();
}
/**
 * @Author   KENFO
 * @Email    xxg3053@qq.com
 * @DateTime 2015-06-26T11:02:50+0800
 * @describe 加载区划图层
 * @return   {[type]}
 */
function showDistrict() {
	 //var returnValue = arealayer.getVisibility();
	// arealayer.setVisibility(false);
    $.ajax({
            url:'./geojson/district.json',
            data:{},
            type:'get',
            dataType:'json',
            success:function(data){
            arealayer.addFeatures(format.read(data));
            map.zoomTo(0);
            var sf = new OpenLayers.Control.SelectFeature(arealayer, {
                onSelect: function (currentFeature) {
                   $('#showMessage').html('您点击的'+currentFeature.attributes["上级主管"]+"区");
                },
                onUnselect: function (currentFeature) {
                    $('#showMessage').html('操作有误');
                }
            });
            map.addControl(sf);
            sf.activate(); //激活控件
            }
             
        });
       
}

/**
 * @Author   KENFO
 * @Email    xxg3053@qq.com
 * @DateTime 2015-06-26T11:03:09+0800
 * @Describe  加载公路图层
 * @return   {[type]}
 */
function loadGLlayer(){
    map.zoomTo(0);
   var length = map.layers.length;
	var b = false;
	for (var i = 0; i < length;i++) {
		var layer = map.layers[i];
		if("gongluLayer" == layer.name){
			glLayer = layer;
			b = true;
		}
	}
	if(b){
		map.removeLayer(glLayer);
	}else{
		//公路
		glLayer = new OpenLayers.Layer.WMS(
				"gongluLayer", gl_wms_url,
				{
					LAYERS:gl_wms_layer,
					STYLES: '',
                    TRANSPARENT:true,
					format: gl_wms_format
				},{
					buffer: 1,
					displayOutsideMaxExtent: true,
					isBaseLayer: false,
                    yx : {'EPSG:4326' : true}
				} 
			);
		map.addLayer(glLayer);
	}
	/****/
	  info = new OpenLayers.Control.WMSGetFeatureInfo({
          url: gl_wms_url, 
          title: 'clicking',
          queryVisible: true,
          layers: [glLayer],
          infoFormat:'application/json',
          eventListeners: {
              getfeatureinfo: function(event) {
              //alert(event.features.length);
              var text = eval("("+event.text+")");
              var roadCode = text.features[0].properties['ROADCODE'];
              var roadName = text.features[0].properties['ROADNAME'];
              var sn = text.features[0].properties['STARTNAME'];
              var sz = text.features[0].properties['STARTZH'];
              var en = text.features[0].properties['ENDNAME'];
              var ez = text.features[0].properties['ENDZH'];
              var lmlx = text.features[0].properties['LMLX'];
              var cd = text.features[0].properties['CDTZ'];
              
              var content = "编号："+roadCode+"<br/>"
                           +"名称："+roadName+"<br/>"
                           +"起点名称："+sn+"<br/>"
                           +"起点桩号："+sz+"<br/>"
                           +"终点名称："+en+"<br/>"
                           +"终点桩号："+ez+"<br/>"
                           +"路面类型："+lmlx+"<br/>"
                           +"车道："+cd+"<br/>";
                  content += "<a href='javascript:void(0)' onclick=seachDisease('"
                        +roadName + "') class='btn btn-primary btn-sm'>病害</a>";
                       // +"<a href='./roaddetail.html' target='_blank' class='btn btn-info btn-sm'>概况</a>";
                  map.addPopup(new OpenLayers.Popup.FramedCloud(
                      "gonglu", 
                      map.getLonLatFromPixel(event.xy),
                      null,
                      content,
                      null,
                      true
                  ));
              }
          }
      });
      map.addControl(info);
      info.activate();
}
/**
 * @Author   KENFO
 * @Email    xxg3053@qq.com
 * @DateTime 2015-06-26T11:03:23+0800
 * @Describe  左侧导航树点击事件
 * @param    {[string]} 道路编号
 * @return   {[type]}
 */
function leftClick(roadCode){
    resetAll();

    roadCode = roadCode+"";
    if(roadCode.length>8){
        var rc = roadCode.substring(0,roadCode.length-3);
        var num = roadCode.substring(roadCode.length-3,roadCode.length);
        // alert(rc+"="+num);
        roadCode = rc;
    }
   var color = "#000000";
    if(roadCode.indexOf('G') != -1){
        color = "#ff0000";
    }else if(roadCode.indexOf('S') != -1){
        color = "#008040";
    }
    searchVectorLayer = new OpenLayers.Layer.Vector("公路查询结果", { 
        strategies : [ new OpenLayers.Strategy.BBOX()],  
        protocol : new OpenLayers.Protocol.WFS({ 
            url : gl_wfs_url,
            srsName: "EPSG:4326",
            featureType:"guodao",
            featureNS:"http://127.0.0.1:9997/szmap"
        }),  
        styleMap:new OpenLayers.StyleMap({ 
            strokeWidth : 4,  
            strokeColor: color
  
        }),  
        filter : new OpenLayers.Filter.Logical({
            type : OpenLayers.Filter.Logical.OR,
            filters : [ new OpenLayers.Filter.Comparison({
                            type:OpenLayers.Filter.Comparison.LIKE,
                            property: "ROADCODE",
                            value : roadCode + "*"
                        })]
                })
    });  
    map.addLayers([searchVectorLayer]);
   selectVectorControl(searchVectorLayer);
}
/**
 * @Author   KENFO
 * @Email    xxg3053@qq.com
 * @DateTime 2015-06-26T11:04:15+0800
 * @Describe  搜索栏
 * @param    {[type]}
 * @return   {[type]}
 */
function search(v){
     resetAll();
     searchVectorLayer = new OpenLayers.Layer.Vector("公路查询结果", { 
        strategies : [ new OpenLayers.Strategy.BBOX() ],  
        protocol : new OpenLayers.Protocol.WFS({ 
            url : gl_wfs_url,
            featureType:"guodao",
            featureNS:"http://127.0.0.1:9997/szmap"
        }),  
        styleMap:new OpenLayers.StyleMap({ 
            strokeWidth : 3,  
            strokeColor: "#333333"
  
        }),  
        filter : new OpenLayers.Filter.Logical({
            type : OpenLayers.Filter.Logical.OR,
            filters : [ new OpenLayers.Filter.Comparison({
                            type:OpenLayers.Filter.Comparison.LIKE,
                            property: "ROADCODE",
                            value :"*" + v + "*"
                        }),
                       new OpenLayers.Filter.Comparison({
                            type:OpenLayers.Filter.Comparison.LIKE,
                            property: "ROADNAME",
                            value :"*" + v + "*"
                        })]
                })
    });  
    map.addLayers([searchVectorLayer]);
    searchVectorLayer.setZIndex(749);
    selectVectorControl(searchVectorLayer);

}
/**
 * @Author   KENFO
 * @Email    xxg3053@qq.com
 * @DateTime 2015-06-26T11:04:47+0800
 * @Describe wfs服务查询结果绑定
 * @param    {[type]}
 * @return   {[type]}
 */
function selectVectorControl(searchVectorLayer){
    var sf = new OpenLayers.Control.SelectFeature(searchVectorLayer, {
                onSelect: function (currentFeature) {
              //alert(currentFeature.attributes["ROADCODE"]);
              var roadCode = currentFeature.attributes['ROADCODE'];
              var roadName = currentFeature.attributes['ROADNAME'];
              var sn = currentFeature.attributes['STARTNAME'];
              var sz = currentFeature.attributes['STARTZH'];
              var en = currentFeature.attributes['ENDNAME'];
              var ez = currentFeature.attributes['ENDZH'];
              var lmlx = currentFeature.attributes['LMLX'];
              var cd = currentFeature.attributes['CDTZ'];
              
              var content = "编号："+roadCode+"<br/>"
                           +"名称："+roadName+"<br/>"
                           +"起点名称："+sn+"<br/>"
                           +"起点桩号："+sz+"<br/>"
                           +"终点名称："+en+"<br/>"
                           +"终点桩号："+ez+"<br/>"
                           +"路面类型："+lmlx+"<br/>"
                           +"车道："+cd+"<br/>";
                content += "<a href='javascript:void(0)' onclick=seachDisease('"
                        +roadName + "') class='btn btn-primary btn-sm'>病害</a>";
                        //+"<a href='./roaddetail.html' target='_blank' class='btn btn-info btn-sm'>概况</a>";
                    
                    map.addPopup(new OpenLayers.Popup.FramedCloud(
                      "gonglu", 
                      currentFeature.geometry.getBounds().getCenterLonLat(),
                      null,
                      content,
                      null,
                      true
                  ));
                   
                },
                onUnselect: function (currentFeature) {
                }
            });
            map.addControl(sf);
            sf.activate(); //激活控件
            map.zoomTo(0);
}
function getFoundType(ft){
    if(ft==10){
       return "交运通日常巡查";
    }else if(ft==11){
        return "其它日常巡查";
    }else if(ft==20){
        return "基层单元巡查";
    }else if(ft==22){
        return "辖区局监督";
    }else if(ft==31){
        return "监理巡查";
    }else if(ft==32){
        return "监理监督";
    }else if(ft==40){
        return "领导交办";
    }else if(ft==50){
        return "投诉案件";
    }else if(ft==60){
        return "数字城管";
    }else{
        return "未知";
    }
}

function getIsdeal(isdeal){
    var ret = "未知";
    switch(isdeal){
        case '0':
        ret = '未处理';
        break;
        case '02':
        ret = '小修申报中';
        break;
        case '03':
        ret = '修复中';
        break;
        case '04':
        ret = '退案未通过';
        break;
       case '05':
        ret = '销案未通过';
        break;
         case '06':
        ret = '抽查未通过';
        break;
        case '44':
        ret = '退案中';
        break;
        case '45':
        ret = '已退案';
        break;
        case '98':
        ret = '已快速结办';
        break;
        case '99':
        ret = '已修复';
        break;
                
    return ret;
    }
}
/**
格式化时间
**/
function getDateByTime(nS) {     
   return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");           
} 
function seachDisease(road){
    pointLayer.setZIndex(750);
    $.ajax({
             type: "GET",
             //url: "server/disease.php",
             //dataType: "json",
             //data: {'road':road},
             url:"http://61.144.253.251:9999/repair/jsonp/inspection/damagedisease!dieaseForGlMap.action",
             data:{'road':road,'accessKey':'2880f23b9826d1013b9826','size':30},
             dataType:'jsonp',  
             jsonp:'callback',
             success: function(data){
                if(data.length > 0){
                    $.each(data,function(idx,item){     
                       //输出
                        var lat = item.lat;
                        var lon = item.lon;
                        var caseNumber = item.caseNumber;
                        var ISDEAL = item.isdeal;
                        var DISPOSE = item.dispose;
                        var point = new OpenLayers.LonLat(lon,lat);
                        var marker;
                        if(ISDEAL=='0'){
                            marker= new OpenLayers.Marker(point,notDealIcon.clone());
                        }else if(ISDEAL=='99' || ISDEAL=='98' || ISDEAL=='45'){
                             marker= new OpenLayers.Marker(point,dealIcon.clone());
                        }else{
                             marker= new OpenLayers.Marker(point,dealzhongIcon.clone());
                        }
                        var FOUNDTIME = getDateByTime(item.foundTime);
                        var FOUNDTYPE = item.foundType;
                         FOUNDTYPE = getFoundType(FOUNDTYPE);
                        var DESCRIBE_S = item.describe;
                        var content = "病害来源:"+FOUNDTYPE
                         + "<a class='btn btn-link' href='javascript:void(0)' onclick=openDisDes('"
                         +caseNumber+"')>详情</a>"
                                    +"<br/>"
                                    + "发现时间:"+FOUNDTIME+"<br/>"
                                    + "病害描述:"+DESCRIBE_S+"<br/>";
                         marker.events.register('mousedown', marker, function(evt){
                               var popup = new OpenLayers.Popup.FramedCloud("click", 
                                    marker.lonlat,  
                                    null,  
                                    content,
                                    null,
                                    true);  
                                popup.setBorder("#999999 solid 1px");  
                                //popup.closeOnMove = true;  
                               map.addPopup(popup); 

                        OpenLayers.Event.stop(evt);
                       });
                     pointLayer.addMarker(marker);

                });
                }else{
                    $('#showMessage').html('没有查询到病害信息！');
                }
        }
    });
}

function openDisDes(caseNo){
   var url = "http://61.144.253.251:9999/repair/inspection/damagedisease!getDetail.action?caseNo="+caseNo;
    window.open(url);
}
function toggleControl(_value) {
    for(key in measureControls) {  
        var control = measureControls[key];  
        if(_value == key ) {  
            control.activate();  
        } else {  
            control.deactivate();
            $("#showMessage").hide();
            $("#showMessage").html("");
        }  
    }  
}    
function handleMeasurements(event) {  
    var geometry = event.geometry;  
    var units = event.units;  
    var order = event.order;  
    var measure = event.measure;  
    var out = "";  
    if(order == 1) {
        out += "距离: " + measure.toFixed(3) + " " + UnitsToCHS(units);  
    } else {  
        out += "面积: " + measure.toFixed(3) + " " + "平方"+UnitsToCHS(units);  
    }  
    $("#showMessage").show();
    $("#showMessage").html(out);  
}