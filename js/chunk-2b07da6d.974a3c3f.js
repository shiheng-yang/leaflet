(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2b07da6d"],{2002:function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e._self._c;return t("div",{staticClass:"box"},[e._m(0),t("div",{staticClass:"select"},[t("span",[e._v("平面图：")]),t("el-select",{attrs:{placeholder:"全部",clearable:"",filterable:""},on:{change:e.initDate},model:{value:e.pic,callback:function(t){e.pic=t},expression:"pic"}},e._l(e.picArr,(function(e,i){return t("el-option",{key:i,attrs:{label:e.name,value:e.id}})})),1)],1)])},l=[function(){var e=this,t=e._self._c;return t("div",{staticClass:"imgBox"},[t("div",{attrs:{id:"imageMap"}})])}],o=(i("14d9"),i("6cc5"),i("94ae"),i("e11e")),s=(i("6bb3"),i("6397")),n=i.n(s),r=i("e2b9"),c=i.n(r);i("5092"),i("9a51");const d=o["icon"]({iconUrl:n.a,shadowUrl:c.a});o["Marker"].prototype.options.icon=d;var p={data(){return{map:null,fillColor:"#2d75ff80",bounds:[[0,0],[0,0]],pic:0,picArr:[{id:0,name:"1楼平面图",points:[]},{id:1,name:"2楼平面图",points:[]},{id:2,name:"3楼平面图",points:[]}],imageOverlay:""}},methods:{initMap(){this.map=o["map"]("imageMap",{minZoom:-3,zoom:5,maxZoom:4,zoomSnap:.1,attributionControl:!1,zoomControl:!0,crs:o["CRS"].Simple,center:[0,0]}),this.map.pm.setLang("zh"),this.map.pm.addControls({position:"topleft",drawPolygon:!0,drawMarker:!0,drawCircleMarker:!0,drawPolyline:!0,drawRectangle:!0,drawCircle:!0,editMode:!0,dragMode:!0,cutPolygon:!0,removalMode:!0}),this.map.pm.setPathOptions({fillOpacity:.5,fillColor:this.fillColor})},initDate(){this.map.eachLayer(e=>{null==e._latlngs&&null==e._latlng||e.remove()});let e=new Image,t=i("588d")(`./bgc${this.pic}.jpg`);e.src=t,e.onload=()=>{let i=e.width,a=e.height;this.bounds=[[0,0],[a,i]],this.imageOverlay?(this.imageOverlay.setUrl(t),this.imageOverlay.setBounds(this.bounds)):this.imageOverlay=o["imageOverlay"](t,this.bounds).addTo(this.map),this.map.fitBounds(this.bounds)};let a=JSON.parse(localStorage.getItem("layers"))||[];a[this.pic]&&(a[this.pic].forEach(e=>{let t=o["polygon"](e.latlngs).addTo(this.map).on("pm:edit",this.editLayClick).on("click",this.layClick).on("pm:dragend",this.dragendLayClick);e._leaflet_id=t._leaflet_id}),localStorage.setItem("layers",JSON.stringify(a))),this.map.on("pm:create",this.createClick),this.map.on("pm:remove",this.removeClick),this.map.dragging.disable(),this.map.doubleClickZoom.disable(),this.map.scrollWheelZoom.disable()},createClick(e){let t=JSON.parse(localStorage.getItem("layers"))||[];t[this.pic]||(t[this.pic]=[]);let i={_leaflet_id:e.layer._leaflet_id,latlngs:e.layer._latlngs};t[this.pic].push(i),localStorage.setItem("layers",JSON.stringify(t)),e.layer.on("pm:edit",this.editLayClick).on("click",this.layClick).on("pm:dragend",this.dragendLayClick)},removeClick(e){let t=JSON.parse(localStorage.getItem("layers"))||[];t[this.pic].forEach((i,a)=>{i._leaflet_id==e.layer._leaflet_id&&t[this.pic].splice(a,1)}),localStorage.setItem("layers",JSON.stringify(t))},layClick(e){},dragendLayClick(e){console.log("区域图层拖拽",e)},editLayClick(e){console.log("图层编辑",e);let t=JSON.parse(localStorage.getItem("layers"));t[this.pic].forEach(t=>{t._leaflet_id==e.target._leaflet_id&&(t.latlngs=e.target._latlngs,t._leaflet_id=e.target._leaflet_id,t.options=e.target.options)}),localStorage.setItem("layers",JSON.stringify(t))}},mounted(){this.initMap(),this.initDate(),window.onresize=()=>{this.map.invalidateSize(!0),this.map.fitBounds(this.bounds)}}},g=p,m=(i("9b8e"),i("2877")),h=Object(m["a"])(g,a,l,!1,null,"3cd1766e",null);t["default"]=h.exports},"2cba":function(e,t,i){e.exports=i.p+"img/bgc2.399a34d2.jpg"},"2de9":function(e,t,i){e.exports=i.p+"img/bgc1.6b56c0bd.jpg"},"588d":function(e,t,i){var a={"./bgc0.jpg":"6c8e","./bgc1.jpg":"2de9","./bgc2.jpg":"2cba"};function l(e){var t=o(e);return i(t)}function o(e){if(!i.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}l.keys=function(){return Object.keys(a)},l.resolve=o,e.exports=l,l.id="588d"},"6c8e":function(e,t,i){e.exports=i.p+"img/bgc0.8cba642e.jpg"},"9b8e":function(e,t,i){"use strict";i("a604")},a604:function(e,t,i){}}]);
//# sourceMappingURL=chunk-2b07da6d.974a3c3f.js.map