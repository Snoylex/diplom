import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import MenuPage from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Reviews from './pages/Reviews';
import DiscountsPage from './pages/DiscountsPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import AdminRoute from './routes/AdminRoute';

import AdminLayout from './components/admin/AdminLayout';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminImagesPage from './pages/admin/AdminImagesPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminPromotionsPage from './pages/admin/AdminPromotionsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminArchiveOrdersPage from './pages/admin/AdminArchiveOrdersPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/menu" element={<MenuPage />} />
		
		<Route path="/reviews" element={<Reviews />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
		
		<Route path="/discounts" element={<DiscountsPage />} />

        <Route path="/events" element={<EventsPage />} />
		
		<Route path="/profile" element={<ProfilePage />} />
		
		<Route path="/forgot-password" element={<ForgotPasswordPage  />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="menu" element={<AdminMenuPage />} />

          <Route path="categories" element={<AdminCategoriesPage />} />
		  <Route path="reviews" element={<AdminReviewsPage />}/>
		  <Route path="images" element={<AdminImagesPage />} />
		  <Route path="promotions" element={<AdminPromotionsPage />} />
		  <Route path="events" element={<AdminEventsPage />} />
		  <Route path="orders" element={<AdminOrdersPage />} />
		  <Route path="ordersarchive" element={<AdminArchiveOrdersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;