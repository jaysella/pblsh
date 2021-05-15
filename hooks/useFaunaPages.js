import { useState, useEffect } from "react";
import { useFaunaUser } from "./useFaunaUser";

export const useFaunaPages = () => {
  const { faunaUserData } = useFaunaUser();

  const [faunaPagesStatus, setStatus] = useState("idle");
  const [faunaPagesData, setData] = useState();
  const [faunaPagesError, setError] = useState(false);

  useEffect(() => {
    if (!faunaUserData || !faunaUserData.id) return;

    const id = faunaUserData.id;

    const fetchPages = async () => {
      setStatus("fetching");

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };

      await fetch(`/api/user/${id}/pages`, requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.success && r.success.pages) {
            const data = r.success.pages.data.reverse();
            setData(data);
          } else if (r.error) {
            console.log("Error:", r.error);
            const errorMessage =
              r.error.name === "database_error"
                ? "An error was encountered — please try again later"
                : r.error.message;
            setError(errorMessage);
          }

          setStatus("fetched");
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchPages();
  }, [faunaUserData]);

  return { faunaPagesStatus, faunaPagesData, faunaPagesError };
};
