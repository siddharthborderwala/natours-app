/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic2lkZGhhcnRoYm9yZGVyd2FsYSIsImEiOiJja2g0ZnFsNDQwMTVrMnluMW9tMDlvdDF2In0.IJ-netZroHXa82baJL9AqA';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/siddharthborderwala/ckh4kv0ac0pah19o717g45mhb',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // extend the map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 200,
      right: 200,
    },
  });
};
