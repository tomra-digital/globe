import * as ignoreme from 'cesium/Widgets/widgets.css'
import Cesium from 'cesium/Cesium'
import { accessToken, realtimeEndpoint } from '../config.js'

function getUniqueId() {
    // From https://gist.github.com/gordonbrander/2230317
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 9);
}

Cesium.Ion.defaultAccessToken = accessToken;

var tenMinuteOffset = Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), -10, new Cesium.JulianDate());

const animationClock = new Cesium.Clock({
                               startTime :  tenMinuteOffset,
                               currentTime : tenMinuteOffset,
                               shouldAnimate: true
                             })

const viewer = new Cesium.Viewer('cesiumContainer', {
  //terrainProvider: Cesium.createWorldTerrain({
  //  requestWaterMask: true
  //}),
  terrainProvider: new Cesium.CesiumTerrainProvider(
    {
      url: Cesium.IonResource.fromAssetId(1)
      //,requestVertexNormals: true
    })
  ,animation: false
  ,baseLayerPicker: false
  ,fullscreenButton: false
  ,geocoder: false
  ,homeButton: false
  ,infoBox: false
  ,sceneModePicker: false
  ,selectionIndicator: false
  ,timeline: false
  ,navigationHelpButton: false
  ,navigationInstructionsInitiallyVisible: false
  ,scene3DOnly: true
  ,clockViewModel: new Cesium.ClockViewModel(animationClock)
  ,targetFrameRate: 30
  //,useBrowserRecommendedResolution: true
  ,creditContainer: 'cesiumCreditsContainer'
  ,creditViewport: 'cesiumCreditsPopupContainer'
  //terrainExaggeration: 100.0 // Fun! :)
})

viewer.scene.globe.enableLighting = true

function addLine(lat, long, volume, id) {
  const addedTime = animationClock.currentTime
  console.log(`Adding line ${id} at ${addedTime}!`)

  const color = Cesium.Color.fromHsl((0.6 - (volume * 0.005)), 1.0, 0.5)

  const polyline = new Cesium.PolylineGraphics()
  polyline.material = new Cesium.ColorMaterialProperty(color)
  polyline.width = new Cesium.ConstantProperty(2)
  polyline.followSurface = new Cesium.ConstantProperty(false)
  polyline.positions = new Cesium.CallbackProperty(function(currentTime, result) {
    const t = Cesium.JulianDate.secondsDifference(currentTime, addedTime);
    const curHeight = t > 2 ? volume : volume * t / 2 // Grow from zero to height in 3 sec, then stop
    const scaledHeight = Math.log2(curHeight) * 1e5
    //console.log(`Setting height ${curHeight} for ${id} at ${time}`)
    const surfacePosition = Cesium.Cartesian3.fromDegrees(long, lat, 0)
    const heightPosition = Cesium.Cartesian3.fromDegrees(long, lat, scaledHeight < 0.0125 ? 0 : scaledHeight)
    return [surfacePosition, heightPosition]
  }, false)


  const entity = new Cesium.Entity({
    id: 'someid' + id,
    show: true,
    polyline: polyline,
    seriesName: 'somename' //Custom property to indicate series name
  })

  //Add the entity to the collection and zoom in on it.
  viewer.entities.add(entity)
  viewer.flyTo(entity, {
    duration: 2.0,
    offset: new Cesium.HeadingPitchRange(0, -0.7, 10e6)
  })
  window.setTimeout(() => viewer.entities.remove(entity), 2500)

}

const ws = new WebSocket(realtimeEndpoint);
ws.onclose = () => console.log("closed");
ws.onmessage = (rawResponse) => {
  const response = JSON.parse(rawResponse.data)
  console.log("message:", response);
  response.data.forEach(e => {
    window.setTimeout(() => addLine(e.latitude, e.longitude, e.volume, getUniqueId()), e.delay + Math.floor(Math.random() * 5000))
  })
}

/*
window.setTimeout(() => addLine(59.8239727, 10.4011683, 1, 1), 2000)

window.setTimeout(() => addLine(49.0, 21.0, 2, 2), 4000)

window.setTimeout(() => addLine(30.0, 42.0, 3, 3), 6000)

window.setTimeout(() => addLine(36.0, 33.0, 4, 4), 8000)

window.setTimeout(() => addLine(-20.0, -63.0, 3, 5), 9000)
*/

