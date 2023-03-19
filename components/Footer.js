const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <div className='py-10 bg-blue-900 text-white border-b-2'>
      <div className='container px-12 max-w-7xl mx-auto'>
        <div className='flex justify-between items-center border-b border-white py-10'>
          <div className='flex items-center text-5xl'>🖼️</div>
          <div className='ml-14'>
            <ul className='flex gap-8 text-sm z-10 relative'>
              <li>
                <a href='#home'>Home</a>
              </li>
              <li>
                <a href='#work'>How It Works</a>
              </li>
              <li>
                <a href='#why'>Why Us</a>
              </li>
            </ul>
          </div>
          <div className='flex gap-4'>
            <a href='#'>
              <img className='w-4 h-4' src='/facebook.ico' alt='facebook' />
            </a>
            <a href='#'>
              <img className='w-4 h-4' src='/instagram.png' alt='facebook' />
            </a>
            <a href='#'>
              <img className='w-4 h-4' src='/twitter.ico' alt='facebook' />
            </a>
            <a href='#'>
              <img className='w-4 h-4' src='/linkedin.ico' alt='facebook' />
            </a>
          </div>
        </div>
        <div className='text-center mt-6'>
          <small>&copy; Copyright {year} - docNFT. All Rights Reserved.</small>
        </div>
      </div>
    </div>
  );
};

export default Footer;
