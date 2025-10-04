import "./App.css";
import {Route,Routes} from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar";
import Signup from "./pages/Signup";
import OpenRoute from "./components/core/auth/OpenRoute";
import Login from "./pages/Login";
import DashBoard from "./pages/Dashboard.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import About from "./pages/About.jsx"
import MyProfile from "./components/core/Dashboard/MyProfile.jsx";
import Contact from "./pages/Contact.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/core/auth/PrivateRoute.jsx";
import Error from "./pages/Error.jsx"
import Settings from "./components/core/Dashboard/Settings"
import { ACCOUNT_TYPE } from "./utils/constants.js";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses.jsx";
import Cart from "./components/core/Dashboard/Cart/index.jsx";
import AddCourses from "./components/core/Dashboard/AddCourses/index.jsx";
import MyCourses from "./components/core/Dashboard/MyCourses.jsx";
import EditCourse from "./components/core/Dashboard/EditCourse/index.jsx";
import AdminDashboard from "./components/core/Dashboard/AdminDashBoard/AdminDashboard.jsx";
import AdminLogin from "./components/core/auth/AdminLogin.jsx";
import Catalog from "./pages/Catalog.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import ViewCourse from "./pages/ViewCourse.jsx";
import NewEnrolledCourses from "./pages/EnrolledCourses.jsx";
import Payment from "./pages/Payment.jsx";


function App() {
  const { user } = useSelector((state) => state.profile)
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path="/"  element={<Home/>}  ></Route>
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route path="/login" element={<OpenRoute>
              <Login />
            </OpenRoute>} />

        <Route path="/dashboard" element={<DashBoard/>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        /> 
        

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        /> 

        <Route
          path="/about"
          element={
            <OpenRoute>
              <About/>
            </OpenRoute>
          }
        /> 

        <Route path="/contact" element={<Contact/>} />

        <Route 
        element={
          <PrivateRoute>
              <Dashboard/>
          </PrivateRoute>
        }
        >
          <Route path="/dashboard/my-profile" element={<MyProfile/>} />
          <Route path="/dashboard/settings" element={<Settings/>} />
          
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
              <Route path="dashboard/add-course" element={<AddCourses />} />
              <Route path="dashboard/my-courses" element={<MyCourses/> }/>
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse/> }/>
              </>
            )
          }
        </Route>

        {/* Public course discovery routes */}
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/payment/:courseId" element={<Payment />} />
        
        {/* Student enrolled courses page */}
        <Route 
          path="/enrolled-courses" 
          element={
            <PrivateRoute>
              <NewEnrolledCourses />
            </PrivateRoute>
          } 
        />
        
        {/* Course viewing route - only for enrolled students */}
        <Route 
          path="/view-course/:courseId" 
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          } 
        />


        <Route path="*" element={<Error/>} />

      </Routes>
    </div>
  );
}

export default App;
