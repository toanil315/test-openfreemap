import Map, { Source, Layer } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import YouAreHere from "./components/YouAreHere";
import geojson from "./components/geo.json";
import { useEffect, useState } from "react";

function App() {
  return (
    <Map
      initialViewState={{
        longitude: 108.191,
        latitude: 16.0706,
        zoom: 2,
      }}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
      interactiveLayerIds={geojson.features.map(
        (feature) => feature.properties.name
      )}
      onClick={(event) => {
        if (event.features?.[0].source) {
          alert(`Clicked on ${event.features?.[0].source}`);
        }
      }}
    >
      <YouAreHere />
      {geojson.features.map((feature) => {
        const countryName = feature.properties.name;
        return <CountryLayer key={countryName} countryName={countryName} />;
      })}
    </Map>
  );
}

function formatName(name: string) {
  if (!name) throw new Error("missing parameter for formatName");

  return name
    .replace(/ /g, "_")
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .toLowerCase();
}

async function fetchCountryData(countryName: string) {
  try {
    const response = await fetch(`/countries/${formatName(countryName)}.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch country data");
    }
    return response.json();
  } catch (error) {
    console.error(countryName, error);
  }
}

function hashStringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate a color in RGB format
  const r = (hash & 0x00ff0000) >> 16;
  const g = (hash & 0x0000ff00) >> 8;
  const b = hash & 0x000000ff;

  // Ensure values are between 0 and 255
  const color = `rgb(${r % 256}, ${g % 256}, ${b % 256})`;
  return color;
}

function CountryLayer({ countryName }: { countryName: string }) {
  const [countryGeoJsons, setCountryGeoJsons] = useState<any>(null);

  useEffect(() => {
    async function loadCountryData() {
      const geoJsonData = await fetchCountryData(countryName);
      setCountryGeoJsons(geoJsonData);
    }

    loadCountryData();
  }, []);

  if (!countryGeoJsons) {
    return null;
  }

  return (
    <Source id={countryName} type="geojson" data={countryGeoJsons}>
      <Layer
        id={countryName}
        source={countryName}
        type="fill"
        layout={{}}
        paint={{
          "fill-color": hashStringToColor(countryName),
          "fill-opacity": 0.5,
        }}
      />
    </Source>
  );
}

export default App;
