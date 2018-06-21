import ignoreme from 'cesium/Widgets/widgets.css'
import Cesium from 'cesium/Cesium'

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain({
    requestWaterMask: true
  }),
  requestVertexNormals: true
})

viewer.scene.globe.enableLighting = true

function addLine(lat, long, height, id, startTime) {
  console.log('Adding line!')

  const color = Cesium.Color.fromHsl((0.6 - (height * 0.5)), 1.0, 0.5)

  const polyline = new Cesium.PolylineGraphics()
  polyline.material = new Cesium.ColorMaterialProperty(color)
  polyline.width = new Cesium.ConstantProperty(2)
  polyline.followSurface = new Cesium.ConstantProperty(false)
  polyline.positions = new Cesium.CallbackProperty(function(time, result) {
    const t = Cesium.JulianDate.secondsDifference(time, startTime);
    const curHeight = t > 3 ? height : height * t / 3
    const surfacePosition = Cesium.Cartesian3.fromDegrees(long, lat, 0)
    const heightPosition = Cesium.Cartesian3.fromDegrees(long, lat, curHeight * 1000000)
    return [surfacePosition, heightPosition]
  }, false)

  /*
  t = (time - startTime)

  t=3 <=> h=H

  v = dh/dt

  dh = v*dt

  H = v * 3
  v = H / 3

  dh = (H/3)*dt

  h = H*t/3


  */


  const entity = new Cesium.Entity({
    id: 'someid' + id,
    show: true,
    polyline: polyline,
    seriesName: 'somename' //Custom property to indicate series name
  })

//Add the entity to the collection.
  viewer.entities.add(entity)

}


window.setTimeout(() => addLine(59.8239727, 10.4011683, 1, 1, Cesium.JulianDate.now()), 2000)

window.setTimeout(() => addLine(59.8239727, 21.4011683, 2, 2, Cesium.JulianDate.now()), 4000)

window.setTimeout(() => addLine(59.8239727, 32.4011683, 3, 3, Cesium.JulianDate.now()), 6000)

window.setTimeout(() => addLine(59.8239727, 43.4011683, 4, 4, Cesium.JulianDate.now()), 8000)


