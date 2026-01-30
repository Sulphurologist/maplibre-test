const map = new maplibregl.Map({
  container: 'map',
  // Initialize with the desired base style (we'll transform it right after)
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [0, 20],
  zoom: 2
});

// Apply style transformations (projection, terrain, hillshade) BEFORE adding sources/layers
// NOTE: Replace REPLACE_WITH_YOUR_MAPTILER_KEY with a real MapTiler API key.
map.setStyle('https://tiles.openfreemap.org/styles/liberty', {
  transformStyle: (previousStyle, nextStyle) => {
    nextStyle.projection = { type: 'globe' };

    nextStyle.sources = {
      ...nextStyle.sources,
      terrainSource: {
        type: 'raster-dem',
        url: 'https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=REPLACE_WITH_YOUR_MAPTILER_KEY',
        tileSize: 256
      },
      hillshadeSource: {
        type: 'raster-dem',
        url: 'https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=REPLACE_WITH_YOUR_MAPTILER_KEY',
        tileSize: 256
      }
    };

    nextStyle.terrain = {
      source: 'terrainSource',
      exaggeration: 1
    };

    nextStyle.sky = nextStyle.sky || {};
    nextStyle.sky['atmosphere-blend'] = [
      'interpolate',
      ['linear'],
      ['zoom'],
      0, 1,
      2, 0
    ];

    // Add a hillshade layer (only if a layer with this id doesn't already exist)
    // We push it here so it becomes part of the style before it's applied.
    nextStyle.layers.push({
      id: 'hills',
      type: 'hillshade',
      source: 'hillshadeSource',
      layout: { visibility: 'visible' },
      paint: { 'hillshade-shadow-color': '#473B24' }
    });

    return nextStyle;
  }
});

// When the style is loaded (or re-loaded), add the GeoJSON source, layers and event handlers.
// Using 'style.load' ensures we re-add source/layers after setStyle resets them.
map.on('style.load', () => {
  // Add source if not present
  if (!map.getSource('dummy')) {
    map.addSource('dummy', {
      type: 'geojson',
      data: 'data/vectors/dummy.geojson'
    });
  }

  // Add fill layer if not present
  if (!map.getLayer('dummy-fill')) {
    map.addLayer({
      id: 'dummy-fill',
      type: 'fill',
      source: 'dummy',
      paint: {
        'fill-color': '#ff0000',
        'fill-opacity': 0.5
      }
    });
  }

  // Add outline layer if not present
  if (!map.getLayer('dummy-outline')) {
    map.addLayer({
      id: 'dummy-outline',
      type: 'line',
      source: 'dummy',
      paint: {
        'line-color': '#880000',
        'line-width': 2
      }
    });
  }

  // Named handlers so we can safely off() them before re-binding
  function onClick(e) {
    const feature = e.features && e.features[0];
    if (!feature) return; // guard

    const props = feature.properties || {};
    let html = '<strong>Properties</strong><br>';
    for (const key in props) {
      html += `${key}: ${props[key]}<br>`;
    }

    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(map);
  }

  function onEnter() {
    map.getCanvas().style.cursor = 'pointer';
  }

  function onLeave() {
    map.getCanvas().style.cursor = '';
  }

  // Remove existing handlers first to avoid duplicates on style reload
  map.off('click', 'dummy-fill', onClick);
  map.off('mouseenter', 'dummy-fill', onEnter);
  map.off('mouseleave', 'dummy-fill', onLeave);

  map.on('click', 'dummy-fill', onClick);
  map.on('mouseenter', 'dummy-fill', onEnter);
  map.on('mouseleave', 'dummy-fill', onLeave);
});
