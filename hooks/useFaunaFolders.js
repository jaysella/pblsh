import { useState, useEffect } from "react";
import { useFaunaUser } from "./useFaunaUser";

export const useFaunaFolders = () => {
  const { faunaUserData } = useFaunaUser();

  const [faunaFoldersStatus, setStatus] = useState("idle");
  const [faunaFoldersData, setData] = useState();
  const [faunaFoldersError, setError] = useState(false);

  useEffect(() => {
    if (!faunaUserData || !faunaUserData.id) return;

    const id = faunaUserData.id;

    const fetchFolders = async () => {
      setStatus("fetching");

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };

      await fetch(`/api/user/${id}/folders`, requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.success && r.success.folders) {
            const data = r.success.folders.data.reverse();
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

    fetchFolders();
  }, [faunaUserData]);

  return { faunaFoldersStatus, faunaFoldersData, faunaFoldersError };
};
