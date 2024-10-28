import { useEffect, useState } from "react";
import { Popup, useMap } from "@vis.gl/react-maplibre";
import { getLocation } from "../services/getLocation";

export default function YouAreHere() {
  const [popupLocation, setPopupLocation] = useState([108.191, 16.0706]);
  const { current: map } = useMap();

  useEffect(() => {
    map?.getMap();

    if (!map) return;
    (async () => {
      const location = await getLocation();
      if (
        location &&
        JSON.stringify(location) !== JSON.stringify(popupLocation)
      ) {
        setPopupLocation(location);
        map.flyTo({ center: location, zoom: 8 });
      }
    })();
  }, [map]);

  if (!map) return null;

  return (
    <Popup longitude={popupLocation[0]} latitude={popupLocation[1]}>
      <h3>You are approximately here!</h3>
    </Popup>
  );
}
