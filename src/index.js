import Cesium from 'cesium/Cesium'

const viewer = new Cesium.Viewer('cesiumContainer', {
  //terrainProvider: Cesium.createWorldTerrain({
  //  requestWaterMask: true
  //}),
  terrainProvider: new Cesium.CesiumTerrainProvider(
    {
      url: Cesium.IonResource.fromAssetId(1)
    }),
  requestVertexNormals: true,
  animation: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  scene3DOnly: true,
  shouldAnimate: true,
  creditContainer: 'cesiumCreditsContainer'
  //terrainExaggeration: 100.0 // Fun! :)
})

viewer.scene.globe.enableLighting = true

function addLine(lat, long, height, id, startTime) {
  console.log(`Adding line ${id} at ${startTime}!`)

  const color = Cesium.Color.fromHsl((0.6 - (height * 0.5)), 1.0, 0.5)

  const polyline = new Cesium.PolylineGraphics()
  polyline.material = new Cesium.ColorMaterialProperty(color)
  polyline.width = new Cesium.ConstantProperty(2)
  polyline.followSurface = new Cesium.ConstantProperty(false)
  polyline.positions = new Cesium.CallbackProperty(function(time, result) {
    const t = Cesium.JulianDate.secondsDifference(time, startTime);
    const curHeight = t > 3 ? height : height * t / 3 // Grow from zero to height in 3 sec, then stop
    //console.log(`Setting height ${curHeight} for ${id} at ${time}`)
    const surfacePosition = Cesium.Cartesian3.fromDegrees(long, lat, 0)
    const heightPosition = Cesium.Cartesian3.fromDegrees(long, lat, curHeight * 1e6)
    return [surfacePosition, heightPosition]
  }, false)


  const entity = new Cesium.Entity({
    id: 'someid' + id,
    show: true,
    polyline: polyline,
    seriesName: 'somename' //Custom property to indicate series name
  })

//Add the entity to the collection.
  viewer.entities.add(entity)
  viewer.flyTo(entity, {
    duration: 2.0,
    offset: new Cesium.HeadingPitchRange(0, -0.7, 20e6)
  })
  window.setTimeout(() => viewer.entities.remove(entity), 4000)

}


window.setTimeout(() => addLine(59.8239727, 10.4011683, 1, 1, Cesium.JulianDate.now()), 2000)

window.setTimeout(() => addLine(49.0, 21.0, 2, 2, Cesium.JulianDate.now()), 4000)

window.setTimeout(() => addLine(30.0, 42.0, 3, 3, Cesium.JulianDate.now()), 6000)

window.setTimeout(() => addLine(36.0, 33.0, 4, 4, Cesium.JulianDate.now()), 8000)

window.setTimeout(() => addLine(-20.0, -63.0, 3, 5, Cesium.JulianDate.now()), 9000)


