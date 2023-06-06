import { useSessionStorage } from "@/utils/hooks/useSessionStorage";

export const useAccessToken = () =>
  useSessionStorage<string | undefined>("AT", undefined);

export const useRefreshToken = () =>
  useSessionStorage<string | undefined>("RT", undefined);

export const useBranchPath = () =>
  useSessionStorage<string | undefined>("BP", undefined);

export const usePlatform = () =>
  useSessionStorage<string | undefined>("PF", undefined);

export const useUserType = () =>
  useSessionStorage<string | undefined>("UT", undefined);
