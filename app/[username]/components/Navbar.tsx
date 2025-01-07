import React from "react";

export default function Navbar() {

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, target: string) => {
    e.preventDefault(); // Prevent default anchor behavior

    const targetElement = document.querySelector(target);
    const offset = 120; // Adjust this value for your navbar height or desired gap
    const elementPosition = targetElement!.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth', // Enables smooth scrolling
    });
  }

  return (
    <section className="profile-tab-wrapper">
      <nav className="navbar navbar-expand justify-center p-0">
        <div className="navbar-wrapper">
          <ul className="navbar-nav custom-navbar-links justify-around">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#links" onClick={e => handleScroll(e, "#links")}>
                Links
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#blog" onClick={e => handleScroll(e, "#blog")}>
                Blog
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#gallery" onClick={e => handleScroll(e, "#gallery")}>
                Gallery
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#gallery" onClick={e => handleScroll(e, "#gallery")}>
                Videos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#review" onClick={e => handleScroll(e, "#review")}>
                Reviews
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#location" onClick={e => handleScroll(e, "#location")}>
                Location
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </section>
  );
}