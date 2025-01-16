import React from "react";

type NavbarProps = {
  toggleShopOpen: () => void;
}

export default function Navbar({ toggleShopOpen }: NavbarProps) {

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
    <section className="profile-tab-wrapper flex justify-center">
      <nav className="navbar justify-center navbar-expand p-0">
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
              <a className="nav-link" href="#video" onClick={e => handleScroll(e, "#video")}>
                Videos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#review" onClick={e => handleScroll(e, "#review")}>
                Reviews
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link cursor-pointer" onClick={toggleShopOpen}>
                Shop
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </section>
  );
}