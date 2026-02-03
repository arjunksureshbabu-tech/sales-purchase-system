import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./layout.css";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      {/* Header */}
      <div className="container-fluid">
        <div className="row">
          <header className="app-header">
            <h2 className="header-title fw-bold  ">SALES & PURCHASE SYSTEM</h2>

            <div className="nav-buttons ms-4 ">
              <button
                className={`btn btn-outline-primary ${
                  location.pathname === "/sales" ? "active" : ""
                }`}
                onClick={() => navigate("/sales")}
              >
                Sales
              </button>

              <button
                className={`btn btn-outline-success ${
                  location.pathname === "/purchase" ? "active" : ""
                }`}
                onClick={() => navigate("/purchase")}
              >
                Purchase
              </button>
            </div>
          </header>

          {/* Page Content */}
        </div>
        <div className="row">
          <main className="app-content">
            <div className="app-content-layout">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
