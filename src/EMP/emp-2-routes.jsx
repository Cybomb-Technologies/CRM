import React from "react";
import { Route } from "react-router-dom";
import TasksPage from "@/pages/files/activities/TasksPage";
import MeetingsPage from "@/pages/files/activities/MeetingsPage";
import CallsPage from "@/pages/files/activities/CallsPage";
import CasesPage from "@/pages/files/support/CasesPage";
import SolutionsPage from "@/pages/files/support/SolutionsPage";

const Emp2Routes = (
  <>
    {/* Activities Routes */}
    <Route path="/tasks" element={<TasksPage />} />
    <Route path="/meetings" element={<MeetingsPage />} />
    <Route path="/calls" element={<CallsPage />} />

    {/* Support Routes */}
    <Route path="/cases" element={<CasesPage />} />
    <Route path="/solutions" element={<SolutionsPage />} />
  </>
);

export default Emp2Routes;
