import { Image } from '@chakra-ui/react';

const Work = () => {
  return (
    <div className='pt-32 pb-28' id='work'>
      <div className='container px-12 flex flex-col items-center'>
        <h1 className='text-4xl font-bold tracking-tight'>
          How does it <span className='text-blue-500'>work</span>?
        </h1>
        <p className='text-black/60 mt-8 max-w-2xl text-center'>
          Environmental events are sponsored by brnads that allow you to earn
          coins and then use those coins to get coupons.
        </p>

        <div className='mt-20 flex justify-between w-full xl:w-10/12'>
          <div className='border-4 border-black shadow-4xl rounded-3xl flex flex-col items-center px-6 py-8 w-72 text-center'>
            <Image className='h-12 w-12' src='/metamask.png' alt='metamask' />
            <h1 className='text-xl font-medium mt-4'>Signup with metamask</h1>
            <p className='text-black/60 mt-3'>
              Download metamask from chrome, use eth account for signup.
            </p>
          </div>
          <div className='border-4 border-black shadow-4xl rounded-3xl flex flex-col items-center px-6 py-8 w-72 text-center'>
            <img className='h-12 w-12' src='/token.png' alt='token' />
            <h1 className='text-xl font-medium mt-4'>Create document NFTs</h1>
            <p className='text-black/60 mt-3'>
              Generate NFTs with official government documents
            </p>
          </div>
          <div className='border-4 border-black shadow-4xl rounded-3xl flex flex-col items-center px-6 py-8 w-72 text-center'>
            <div className='rounded-lg bg-purple-200 p-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-8 h-8'
              >
                <path
                  fillRule='evenodd'
                  d='M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 9.375v-4.5zM4.875 4.5a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 01-1.875-1.875v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75A.75.75 0 016 7.5v-.75zm9.75 0A.75.75 0 0116.5 6h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 19.125v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm6 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM6 16.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm9.75 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm-3 3a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm6 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <h1 className='text-xl font-medium mt-4'>Verify with one Scan</h1>
            <p className='text-black/60 mt-3'>
              Use your crypto wallet and scan for verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
