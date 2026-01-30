const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [0, 20],
  zoom: 2
});

// Load GeoJSON into MapLibre
map.on('load', () => {
  map.addSource('dummy', {
    type: 'geojson',
    data: 'data/vectors/dummy.geojson'
  });

  // Polygon fill layer
  map.addLayer({
    id: 'dummy-fill',
    type: 'fill',
    source: 'dummy',
    paint: {
      'fill-color': '#ff0000',
      'fill-opacity': 0.5
    }
  });

  // Polygon outline
  map.addLayer({
    id: 'dummy-outline',
    type: 'line',
    source: 'dummy',
    paint: {
      'line-color': '#880000',
      'line-width': 2
    }
  });
});

// Popups
map.on('click', 'dummy-fill', (e) => {
  const props = e.features[0].properties;

  let html = '<strong>Properties</strong><br>';
  for (const key in props) {
    html += `${key}: ${props[key]}<br>`;
  }

  new maplibregl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(html)
    .addTo(map);
});

// Change cursor on hover
map.on('mouseenter', 'dummy-fill', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'dummy-fill', () => {
  map.getCanvas().style.cursor = '';
});
