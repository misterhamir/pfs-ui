import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SchemaLibrary } from "./pages/SchemaLibrary";
import { Dashboard } from "./pages/Dashboard";
import { TrainingFiles } from "./pages/TrainingFiles";
import { UsersRoles } from "./pages/UsersRoles";
import { Workflows } from "./pages/Workflows";
import { Deployments } from "./pages/Deployments";
import { SchemaDetail } from "./pages/SchemaDetail";
import { CreateSchema } from "./pages/CreateSchema";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schemas" element={<SchemaLibrary />} />
          <Route path="/schemas/new" element={<CreateSchema />} />
          <Route path="/schemas/:id" element={<SchemaDetail />} />
          <Route path="/training-files" element={<TrainingFiles />} />
          <Route path="/users" element={<UsersRoles />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/deployments" element={<Deployments />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
