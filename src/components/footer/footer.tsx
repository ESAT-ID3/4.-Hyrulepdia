import './footer.css';

export const Footer = () => {
  return (
    <footer className='footer'>
      <div className='copyRight'>©2025 HYRULEPEDIA</div>
      <div className='footerLinks'>
        <a href='#' className='footerLink'>
          Privacy Policy
        </a>
        <a href='#' className='footerLink'>
          Cookie Policy
        </a>
        <a href='#' className='footerLink'>
          Terms of Use
        </a>
      </div>
    </footer>
  );
};
