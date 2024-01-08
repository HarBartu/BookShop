import React, { useState, useEffect } from "react";
import Preloader from "./components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Collections from "./components/Collections/Collections";
import CollectionDetails from "./components/Collections/CollectionDetails";
import BookDetails from "./components/Books/BookDetails";
import Orders from "./components/Orders/Orders";
import OrderDetails from "./components/Orders/OrderDetails";
import EditCollection from "./components/Collections/EditCollection";
import AddCollection from "./components/Collections/AddCollection";
import AddBook from "./components/Books/AddBook";
import EditBook from "./components/Books/EditBook";
import AddOrder from "./components/Orders/AddOrder";
import EditOrder from "./components/Orders/EditOrder";
import Register from "./components/Register";
import NotFound from "./components/404";

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route
          path="/collections/:collectionId"
          element={<CollectionDetails />}
        />
        <Route path="/collections/:id/edit" element={<EditCollection />} />
        <Route path="/collections/add" element={<AddCollection />} />
        <Route
          path="/collections/:collectionId/books/:bookId"
          element={<BookDetails />}
        />
        <Route
          path="/collections/:collectionId/books/:bookId/edit"
          element={<EditBook />}
        />
        <Route
          path="/collections/:collectionId/books/add"
          element={<AddBook />}
        />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/add" element={<AddOrder />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/orders/:id/edit" element={<EditOrder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
