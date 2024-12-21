import React from "react";

export default function Navbar() {
  return (
    <section className="profile-tab-wrapper">
      <nav className="navbar navbar-expand justify-content-center p-0">
        <div className="navbar-wrapper">
          <ul className="navbar-nav custom-navbar-links">
            {/* <li className="nav-item">
              <a className="nav-link" href="#treatments">
                Treatments
              </a>
            </li> */}
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#links">
                Links
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#location">
                Location
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#location">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </section>
  );
}