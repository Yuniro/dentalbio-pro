import Image from 'next/image';

const Footer = () => {
  return (
    <div className="footer-logo text-center mb-0">
      <a href="#">
        <Image src="/Dentalbio.svg" alt="Dentalbio Logo" className="img-fluid" width={100} height={50} />
      </a>
    </div>
  );
};

export default Footer;
