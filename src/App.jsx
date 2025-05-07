import { Route, Routes, useLocation } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Navbar from "./components/layouts/Navbar";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Group = lazy(() => import("./pages/Group"));
const GroupBreakDown = lazy(() => import("./pages/groupBreakDown")); 
const User = lazy(() => import("./pages/User"));
const Enroll = lazy(() => import("./pages/Enroll"));
const Auction = lazy(() => import("./pages/Auction"));
const Payment = lazy(() => import("./pages/Payment"));
const WeekGroup = lazy(() => import("./pages/WeekGroup"));
const Agent = lazy(() => import("./pages/Agent"));
const Daybook = lazy(() => import("./pages/Daybook"));
const Test = lazy(() => import("./pages/Test"));
const Lead = lazy(() => import("./pages/Lead"));
const LeadSetting = lazy(() => import("./pages/LeadSetting"));
const Receipt = lazy(() => import("./pages/Receipt"));
const GroupReport = lazy(() => import("./pages/GroupReport"));
const UserReport = lazy(() => import("./pages/UserReport"));
const Profile = lazy(() => import("./pages/Profile"));
const AuctionReport = lazy(() => import("./pages/AuctionReport"));
const Print = lazy(() => import("./pages/Print"));
const AppSettings = lazy(() => import("./pages/AppSettings"));
const GroupSettings = lazy(() => import("./pages/GroupSettings"));
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import CircularLoader from "./components/loaders/CircularLoader";
import Marketing from "./pages/Marketing";
import WhatsappAdd from "./pages/WhatsappAdd";
import WhatsappFailed from "./pages/WhatsappFailed";
import AllGroupReport from "./pages/AllGroupReport";
import Reports from "./pages/Reports";
import LeadReport from "./pages/LeadReport";
import AllUserReport from "./pages/AllUserReport";
import Designation from "./pages/Designation";
import Sidebar from "./components/layouts/Sidebar";

function App() {
  return (
    <>
      <div className="overflow-x">
        <Suspense fallback={<CircularLoader seconds={30} />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Navbar />
                </ProtectedRoute>
              }
            />

            <Route
              path="/group"
              element={
                <ProtectedRoute>
                  <Group />
                </ProtectedRoute>
              }
            />
<Route
              path="/group-breakdown"
              element={
                <ProtectedRoute>
                  <GroupBreakDown />
                </ProtectedRoute>
              }
            />

            <Route
              path="/week-group"
              element={
                <ProtectedRoute>
                  <WeekGroup />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enrollment"
              element={
                <ProtectedRoute>
                  <Enroll />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auction"
              element={
                <ProtectedRoute>
                  <Auction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <ProtectedRoute>
                  <Agent />
                </ProtectedRoute>
              }
            />

<Route
              path="/designation"
              element={
                <ProtectedRoute>
                  <Designation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/lead"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Lead />
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={
                <>
                  <Login />
                </>
              }
            />
            <Route
              path="/lead-setting"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <LeadSetting />
                </ProtectedRoute>
              }
            >
              <Route
                path="app-settings"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <AppSettings />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="groups"
                  element={
                    <ProtectedRoute>
                      <Navbar />
                      <GroupSettings />
                    </ProtectedRoute>
                  }
                />
                <Route />
              </Route>
            </Route>

            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            >
              <Route path="daybook" element={<Daybook />} />
              <Route path="receipt" element={<Receipt />} />
              <Route path="group-report" element={<GroupReport />} />
              <Route path="all-group-report" element={<AllGroupReport />} />
              <Route path="all-user-report" element={<AllUserReport />} />
              <Route path="auction-report" element={<AuctionReport />} />
              <Route path="lead-report" element={<LeadReport />} />
              <Route path="user-report" element={<UserReport />} />
              <Route path="all-user-report" element={<AllUserReport />} />
            </Route>

            <Route
              path="/marketing"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Marketing />
                </ProtectedRoute>
              }
            >
              <Route path="what-add" element={<WhatsappAdd />} />
              <Route path="failed-whatuser" element={<WhatsappFailed />} />
            </Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/print/:id"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Print />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Test />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
