import ignoreme from 'cesium/Widgets/widgets.css'
import Cesium from 'cesium/Cesium'

var viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain({
    requestWaterMask: true
  }),
  requestVertexNormals: true
})

viewer.scene.globe.enableLighting = true

var long = 10.4011683
var lat = 59.8239727
var height = 5000000.0

var color = Cesium.Color.fromHsl((0.6 - (height * 0.5)), 1.0, 0.5)
var surfacePosition = Cesium.Cartesian3.fromDegrees(long, lat, 0)
var heightPosition = Cesium.Cartesian3.fromDegrees(long, lat, height)

var polyline = new Cesium.PolylineGraphics()
polyline.material = new Cesium.ColorMaterialProperty(color)
polyline.width = new Cesium.ConstantProperty(2)
polyline.followSurface = new Cesium.ConstantProperty(false)
polyline.positions = new Cesium.ConstantProperty([surfacePosition, heightPosition])

var entity = new Cesium.Entity({
  id: 'someid',
  show: true,
  polyline: polyline,
  seriesName: 'somename' //Custom property to indicate series name
})

//Add the entity to the collection.
viewer.entities.add(entity)


