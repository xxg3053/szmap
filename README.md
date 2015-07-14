# szmap
深圳市公路专题地图 

## 主要功能

1. 能够在地图上清晰展示深圳所有公路；
2. 点击相应公路数据能展示出公路基本信息以及公路实时病害信息和公路档案数据；
3. 根据公路技术等级或者所属辖区树形展示公路数据等。

## 目录结构

+ shp存放地图的数据，其中guodao.shp文件为深圳公路图层
+ shp_style为地图样式数据


## 相关技术

* bootstap3 前端css框架
* openlayers 操作地图的js框架
* 使用proxy.php解决openlayers对wfs服务请求的跨域问题
* 后端地图服务采用geoserver
* udig编辑地图样式


