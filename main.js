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

 map.setStyle('https://tiles.openfreemap.org/styles/liberty', {
            transformStyle: (previousStyle, nextStyle) => {
                nextStyle.projection = { type: 'globe' };
                nextStyle.sources = {
                    ...nextStyle.sources, terrainSource: {
                        type: 'raster-dem',
                        url: 'https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
                        tileSize: 256
                    },
                    hillshadeSource: {
                        type: 'raster-dem',
                        url: 'https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
                        tileSize: 256
                    }
                }
                nextStyle.terrain = {
                    source: 'terrainSource',
                    exaggeration: 1
                }

                nextStyle.sky = {
                    'atmosphere-blend': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 1,
                        2, 0
                    ],
                }

                nextStyle.layers.push({
                    id: 'hills',
                    type: 'hillshade',
                    source: 'hillshadeSource',
                    layout: { visibility: 'visible' },
                    paint: { 'hillshade-shadow-color': '#473B24' }
                })

                return nextStyle
            }
        })
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
