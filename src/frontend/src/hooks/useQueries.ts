import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Feedback, Nurse } from "../backend";
import { useActor } from "./useActor";

export function useListAllNurses() {
  const { actor, isFetching } = useActor();
  return useQuery<Nurse[]>({
    queryKey: ["nurses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllNurses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilterByPincode(pincode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Nurse[]>({
    queryKey: ["nurses", "pincode", pincode],
    queryFn: async () => {
      if (!actor || !pincode) return [];
      return actor.filterByPincode(BigInt(pincode));
    },
    enabled: !!actor && !isFetching && pincode.length === 6,
  });
}

export function useGetNurse(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Nurse | null>({
    queryKey: ["nurse", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNurse(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetNurseFeedback(nurseId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Feedback[]>({
    queryKey: ["feedback", nurseId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNurseFeedback(nurseId);
    },
    enabled: !!actor && !isFetching && !!nurseId,
  });
}

export function useGetAggregateRating(nurseId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<number | null>({
    queryKey: ["rating", nurseId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAggregateRating(nurseId);
    },
    enabled: !!actor && !isFetching && !!nurseId,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (feedback: Feedback) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitFeedback(feedback);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["feedback", variables.nurseId] });
      qc.invalidateQueries({ queryKey: ["rating", variables.nurseId] });
    },
  });
}

export function useAddNurse() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nurse: Nurse) => {
      if (!actor) throw new Error("Not connected");
      return actor.addNurse(nurse);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["nurses"] });
    },
  });
}

export function useUpdateNurse() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nurse: Nurse) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateNurse(nurse);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["nurses"] });
      qc.invalidateQueries({ queryKey: ["nurse", variables.id] });
    },
  });
}

export function useDeleteNurse() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nurseId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteNurse(nurseId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["nurses"] });
    },
  });
}

export function useRegisterNurse() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nurse: Nurse) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerNurse(nurse);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["nurses"] });
    },
  });
}
