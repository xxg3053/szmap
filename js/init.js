
//加载地图
window.onload = function(){
	for (var i = 0; i < areaColors.length; i++) {
        currentColor = areaColors[i];
        rule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: "==",
                property: "编号",
                value: currentColor.key
            }),
            symbolizer: {
                strokeWidth: 1,
                strokeColor: currentColor.value,
                strokeOpacity: 1,
                fillColor: currentColor.value,
                fillOpacity: 0.1
            }
        });
        styleRules.push(rule);
    }
    districtStyle.addRules(styleRules);
    
	map = new OpenLayers.Map("kmap",mapOptions);
	map.addLayers(vectorGroup);
	
	map.addLayers([arealayer,lineLayer,polygonLayer,pointLayer]);
	//pointLayer.setZIndex(750);
	//polygonLayer.setZIndex(745);
	//lineLayer.setZIndex(740);
	//arealayer.setZIndex(100);
   
	//定位中心点
	map.setCenter(center, 2);
	map.addControl(new OpenLayers.Control.Navigation({
		dragPanOptions: {
			enableKinetic: true,
			documentDrag: true
		},
		zoomBoxEnabled: true,
		zoomWheelEnabled: true,
		zoomBoxKeyMask: OpenLayers.Handler.MOD_SHIFT
	}));
	
	/************************加载一般的基础控件********************************/     
	map.addControl(new OpenLayers.Control.PanZoomBar());  //添加平移缩放工具条  
	map.addControl(new OpenLayers.Control.Navigation());  //双击放大,平移  
	map.addControl(new OpenLayers.Control.Scale($('scale')));  //获取地图比例尺  
	// map.addControl(new OpenLayers.Control.MousePosition({element: $('location')}));  //获取鼠标的经纬度  
	//map.setCenter(new OpenLayers.LonLat(100.254, 35.25), 1);  //添加平移缩放工具条  
	map.addControl(new OpenLayers.Control.OverviewMap());  //添加鹰眼图  
	map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));  //图层切换工具            
	// map.addControl(new OpenLayers.Control.Permalink('xxxx'));  //添加永久链接  
	//map.addControl(new OpenLayers.Control.MouseToolbar());  

	//map.zoomToMaxExtent();  
	//var zb=new OpenLayers.Control.ZoomBox({out:true});  
	//var panel = new OpenLayers.Control.Panel({defaultControl: zb});  
	//map.addControl(panel);  
	/************END************加载一般的基础控件********************************/   
	  
	/*****************************测距、面积Start***************************/  

	// style the sketch fancy  
	var sketchSymbolizers = {  
		"Point": {  
		    pointRadius: 4,  
		    graphicName: "square",  
		    fillColor: "white",  
		    fillOpacity: 1,  
		    strokeWidth: 1,  
		    strokeOpacity: 1,  
		    strokeColor: "#333333"  
		},  
		"Line": {  
		    strokeWidth: 3,  
		    strokeOpacity: 1,  
		    strokeColor: "#45a1de",  
		    strokeDashstyle: "dash"  
		},  
		"Polygon": {  
		    strokeWidth: 2,  
		    strokeOpacity: 1,  
		    strokeColor: "#45a1de",  
		    fillColor: "black",  
		    fillOpacity: 0.3  
		}  
	};  
	var style = new OpenLayers.Style();  
	style.addRules([  
	new OpenLayers.Rule({symbolizer: sketchSymbolizers})  
	]);  
	var styleMap = new OpenLayers.StyleMap({"default": style});  

	// allow testing of specific renderers via "?renderer=Canvas", etc  
	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;  
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;  

	measureControls = {  
	line: new OpenLayers.Control.Measure(  
	    OpenLayers.Handler.Path, {  
	        persist: true,  
	        handlerOptions: {  
	            layerOptions: {  
	                renderers: renderer,  
	                styleMap: styleMap  
	            }  
	        }  
	    }  
	),  
	polygon: new OpenLayers.Control.Measure(  
	    OpenLayers.Handler.Polygon, {  
	        persist: true,  
	        handlerOptions: {  
	            layerOptions: {  
	                renderers: renderer,  
	                styleMap: styleMap  
	            }  
	        }  
	    }  
	)  
	};  

	var control;  
	for(var key in measureControls) {  
		control = measureControls[key];  
		control.events.on({  
		    "measure": handleMeasurements,  
		    "measurepartial": handleMeasurements  
		});  
		map.addControl(control);  
	}  

	//map.setCenter(new OpenLayers.LonLat(0, 0), 3);  

	/**************************测距、面积End***************************/  
}
