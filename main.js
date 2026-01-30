const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [0, 20],
  zoom: 2
});

#load GeoJSON into MapLibre
map.on('load', () => {
  map.addSource('points', {
    type: 'geojson',
    data: 'data/vectors/points.geojson'
  });

  map.addLayer({
    id: 'points-layer',
    type: 'circle',
    source: 'points',
    paint: {
      'circle-radius': 6,
      'circle-color': '#ff0000'
    }
  });
});

#Popups
map.on('click', 'points-layer', (e) => {
  const props = e.features[0].properties;

  new maplibregl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`<strong>${props.name}</strong><br>Value: ${props.value}`)
    .addTo(map);
});
