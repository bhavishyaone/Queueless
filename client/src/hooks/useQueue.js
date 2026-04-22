import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLiveQueue } from "../api/queue";
import { socket } from "../api/socket";

export const useQueue = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["queue"],
    queryFn: fetchLiveQueue,
  });

  useEffect(() => {
    socket.on("queue updated", () => {
      queryClient.invalidateQueries({ queryKey: ["queue"] });
    });

    return () => {
      socket.off("queue updated");
    };
  }, [queryClient]);

  return query;
};
