import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";

export const useFaunaUser = () => {
  const { user } = useUser();

  const [faunaUserStatus, setStatus] = useState("idle");
  const [faunaUserData, setData] = useState();

  useEffect(() => {
    if (!user || !user.email) {
      setData();
      setStatus("no_user");
      return { faunaUserStatus, faunaUserData };
    }

    const email = user.email;

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const currentTime = new Date().getTime();
    const dayInMilliseconds = 1000 * 60 * 60 * 2; // re-fetch every 2 hours

    if (storedUser && currentTime - storedUser.ts < dayInMilliseconds) {
      setData(storedUser);
      setStatus("fetched");
      return { faunaUserStatus, faunaUserData };
    }

    const fetchFaunaUser = async () => {
      setStatus("fetching");

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      };

      await fetch("/api/user/lookup", requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.success && r.success.user) {
            const data = r.success.user.data;

            delete data.auth0Id;

            data.id = r.success.user.ref["@ref"].id;
            data.ts = new Date().getTime();

            setData(data);
            localStorage.setItem("user", JSON.stringify(data));
          }

          setStatus("fetched");
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchFaunaUser();
  }, [user]);

  return { faunaUserStatus, faunaUserData };
};
