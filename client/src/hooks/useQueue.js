import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveQueue } from "../api/queue";
import { socket } from "../api/socket";

export const useQueue = () => {
  const query = useQuery({
    queryKey: ["queue"],
    queryFn: fetchLiveQueue,
  });

  useEffect(() => {
    socket.on("queue:updated", () => {
      query.refetch();
    });

    return () => {
      socket.off("queue:updated");
    };
  }, []);

  return query;
};
