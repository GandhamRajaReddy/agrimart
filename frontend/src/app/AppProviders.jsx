import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";

import { store } from "../store/store";
import { queryClient } from "./queryClient";

function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}

export default AppProviders;