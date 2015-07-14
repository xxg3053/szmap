
//wfs代理    
OpenLayers.ProxyHost= "proxy2.php?url=";

OpenLayers.DOTS_PER_INCH = 90.71428571428572;
OpenLayers.Util.onImageLoadErrorColor = 'transparent';

var get_map_url = function(bounds) {
		var res = this.map.getResolution();
		var x = Math.round ((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
		var y = Math.round ((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
		var z = this.map.getZoom()+8;
		var path = "?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER="+this.type+"&STYLE=default&TILEMATRIXSET=ESPG:900913&TILEMATRIX=ESPG:900913:"+z+"&TILEROW="+y+"&TILECOL="+x+"&FORMAT=image/png";		
		var url = this.url;
		if (url instanceof Array) {
			url = this.selectUrl(path, url);
		}
		return url + path;
	}

var mapOptions = { 
    resolutions: [6.866455078125E-4, 3.433227539062E-4, 1.716613769531E-4, 8.58306884766E-5, 4.29153442383E-5, 2.14576721191E-5, 1.07288360596E-5, 5.3644180298E-6],
    projection: new OpenLayers.Projection('EPSG:4326'),
    maxExtent: new OpenLayers.Bounds(-180.0,-90.0,180.0,90.0),
    units: "degrees",
    controls: []
};



var vectorGroup = [new OpenLayers.Layer.WMS(
    "szmap:szmap","http://127.0.0.1:9997/geoserver/gwc/service/wms",
    {layers: 'szmap:szmap', format: 'image/png' },
    { tileSize: new OpenLayers.Size(256,256)

    })
];
var format = new OpenLayers.Format.GeoJSON({
    'internalProjection': new OpenLayers.Projection("EPSG:4326"),
    'externalProjection': new OpenLayers.Projection("EPSG:4326")
});

var areaColors = [{ key: 1, value: "#0000ff" }, { key: 2, value: "#FF6600" }, { key: 3, value: "#99FF00" },
{ key: 4, value: "#00FFCC" }, { key: 5, value: "#0066FF" }, { key: 6, value: "#9900FF" },
{ key: 7, value: "#FF0099" }, { key: 8, value: "#33A2FB" }, { key: 9, value: "#008000" }, { key: 10, value: "#7B68EE"}];
var districtStyle = new OpenLayers.Style();
var map,measureControls;
var rule, styleRules = [];
var center = new OpenLayers.LonLat(114.034428, 22.535805);
var pointLayer = new OpenLayers.Layer.Markers("markers");//实例化的Layer.Vector对象，用来画点（Point）。当然，如果可以根据你的业务需要，把点、线、面都画在一个Layer.Vector对象上面。
var lineLayer = new OpenLayers.Layer.Vector("Line Layer");//实例化的Layer.Vector对象，用来线（Line）当然。如果可以根据你的业务需要，把点、线、面都画在一个Layer.Vector对象上面。
var polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer");//实例化的Layer.Vector对象，用来多边形（Polygon）。当然，如果可以根据你的业务需要，把点、线、面都画在一个Layer.Vector对象上面。
var arealayer = new OpenLayers.Layer.Vector("areaLayer", {
    styleMap: new OpenLayers.StyleMap(districtStyle)
});
//公路
var glLayer,searchVectorLayer;
var gl_wms_url = "http://127.0.0.1:9997/geoserver/szmap/wms?";
//var gl_wfs_url = "http://127.0.0.1:9997/geoserver/szmap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=szmap:guodao&maxFeatures=50&outputFormat=GML2";
var gl_wfs_url = "http://127.0.0.1:9997/geoserver/szmap/wfs?";
var gl_wms_layer = "szmap:guodao";
var gl_wms_format = 'image/png';

var size = new OpenLayers.Size(40,40);
var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
var dealIcon = new OpenLayers.Icon("./images/dealIcon.png",  size, offset); 
var dealzhongIcon = new OpenLayers.Icon("./images/dealzhong.png", size, offset);
var notDealIcon = new OpenLayers.Icon("./images/notDealIcon.png", size, offset);

