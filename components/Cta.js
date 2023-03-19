import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Cta = () => {
  const router = useRouter();

  return (
    <div className='py-20 mb-20 px-10 max-w-7xl mx-auto'>
      <div className='container px-12'>
        <div className='bg-blue-100 flex justify-between items-center rounded-2xl py-10 px-10 shadow-4xl'>
          <div className='max-w-xl'>
            <h1 className='text-4xl font-heading font-bold'>
              Own and share your identification
            </h1>
            <p className='text-black/80 mt-5 text-xl max-w-lg'>
              Choose from many ID options and verify with Zero-Knowledge
            </p>
            <Button
              className='mt-8 px-10 py-3'
              onClick={() => router.push('/signin')}
              bgColor={'blue.600'}
              color='white'
            >
              Get Started
            </Button>
          </div>
          <div className=''>
            <img className='w-56' src='/aadhaar.svg' alt='tree' />
          </div>
        </div>
      </div>
    </div>
  );
  ß;
};

export default Cta;
