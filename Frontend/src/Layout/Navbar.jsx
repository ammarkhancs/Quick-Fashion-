import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      gap: "20px",
      padding: "12px",
      borderBottom: "1px solid #ddd"
    }}>
      <Link to="/">Home</Link>
      <Link to="/browse">Browse</Link>
      <Link to="/profile/testuser">Profile</Link>
      <Link to="/cart">Cart</Link>
    </nav>
  );
}