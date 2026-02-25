import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Browse from "./pages/Browse";
import Cart from "./pages/Cart";
import Product from "./pages/Product";

import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import React from 'react'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App
