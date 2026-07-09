import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { UserProvider } from "./context/UserContext";
import { VotesProvider } from "./context/VotesContext";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => (
  <BrowserRouter>
    <UserProvider>
      <VotesProvider>
        <ToastProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </VotesProvider>
    </UserProvider>
  </BrowserRouter>
);

export default App;
