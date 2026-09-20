import { useQuery } from "@tanstack/react-query";

import env from "../../../config/env";
import { homeApi } from "../api/homeApi";
import { homeContent } from "../data/homeContent";

export const homeQueryKeys = {
  all: ["home"],
  content: (locale) => [...homeQueryKeys.all, "content", locale || "default"],
};

/**
 * The API is opt-in until the public home endpoint exists. This keeps local
 * development usable while preserving a single query boundary for production.
 */
export const useHomeContent = ({ locale, enabled = env.enableHomeApi } = {}) => {
  const query = useQuery({
    queryKey: homeQueryKeys.content(locale),
    queryFn: () => homeApi.getLandingPage({ locale }),
    enabled,
  });

  return {
    ...query,
    content: query.data || homeContent,
    isRemote: enabled,
  };
};
