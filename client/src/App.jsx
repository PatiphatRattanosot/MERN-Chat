import "./App.css";
import { RouterProvider } from "react-router";
import router from "./routes/route.jsx";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.jsx";

function App() {
  const { theme } = useThemeStore();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <div data-theme={theme}>
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </>
  );
}

export default App;
