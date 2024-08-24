import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [waitingForPlaceData, setWaitingForPlaceData] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setWaitingForPlaceData(true);

      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setWaitingForPlaceData(false);
        });
      } catch (error) {
        setWaitingForPlaceData(false);
        setError({
          message:
            error.message || "Could not fetch places, please try again later",
        });
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return (
      <ErrorPage title="An error occured!" message={error.message}></ErrorPage>
    );
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={waitingForPlaceData}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
