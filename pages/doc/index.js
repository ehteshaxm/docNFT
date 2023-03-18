import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Heading,
  Stack,
  Text,
  Button,
} from '@chakra-ui/react';
import { Web3Storage } from 'web3.storage';
import { uid } from 'uid';
import axios from 'axios';
import { useAccount, useNetwork } from 'wagmi';
import { app, firestore } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

const index = () => {
  const aadhaar = {
    country: 'India',
    date_of_birth: '2001-08-13',
    district: 'Mumbai',
    document_type: 'AADHAAR',
    email: '4f2d574f30a2d5b1c4fbf85c7e7b37412984aff90a48939d877debc93a83b7c2',
    gender: 'MALE',
    house: 'K E M 328 1/3 KADAR KIRANA SHOP',
    landmark: 'BANDRA PLOT',
    locality: 'NEW BASTI',
    mobile: 'eda9cff5d11f0c0154946f665bfa2910d78d30c5fab0f66aa242c40c5cbb677b',
    name: 'Altamash Aslam Siddiqui',
    photo_base64:
      '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',
    pincode: '400060',
    post_office_name: 'Jogeshwari East',
    reference_id: '656020230318171202708',
    state: 'Maharashtra',
    street: 'NEAR ITTEHAD COMMITTEE',
    sub_district: 'Mumbai',
    vtc_name: 'Mumbai',
    xml_base64: 'UEsDBBQACQAIAEFdclYAAAAAAAAAAAAAAAAjAAAAb2ZmbGluZ',
  };

  const account = useAccount();

  const web3Storage = new Web3Storage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg2YWM2RDE0Njk0NzM1OTBBM0NGYzRFOEJlQjRDNjY0NmVhYTBCREIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzkxNTgzODM4MjAsIm5hbWUiOiJteVRva2VuIn0.lvMITWk8W1z_qcVzdv3GUM7SJkI-MOMMVt6RptOlQbU',
  });

  // (async function retrieveFiles(cid) {
  //   const res = await web3Storage.get(
  //     'bafybeifijxr5gsg3vqmeiq2uibacgzkb5fub36nrfelajbyjg2gromlzz4'
  //   );
  //   console.log(`Got a response! [${res.status}] ${res.statusText}`);
  //   if (!res.ok) {
  //     throw new Error(
  //       `failed to get ${cid} - [${res.status}] ${res.statusText}`
  //     );
  //   }

  //   // unpack File objects from the response
  //   const files = await res.files();
  //   console.log(files);
  //   for (const file of files) {
  //     console.log(JSON.stringify(file));
  //   }
  // })();

  (async function subdoc() {
    await setDoc(doc(firestore, 'users', account.address), {
      aadhaar: 'bafybeifijxr5gsg3vqmeiq2uibacgzkb5fub36nrfelajbyjg2gromlzz4',
    });
  })();

  axios
    .get(
      'https://bafybeifqko6pvdmwrbsi6zjytlgekq5r6y73y3xt6gbrahnl2dqtppgmza.ipfs.dweb.link/b1379a516597'
    )
    .then((res) => console.log(res.data));

  return (
    <div className='min-h-screen flex justify-center items-center flex-col'>
      <div className='max-w-lg relative'>
        <div className='h-96 w-96 bg-orange-400 absolute z-0 -top-10 -left-10 blur-3xl rounded-full bg-blend-overlay'></div>
        <div className='h-96 w-96 bg-green-400 absolute z-0 -bottom-10 -right-10 blur-3xl rounded-full bg-blend-overlay'></div>
        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          className='relative z-10'
        >
          <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '200px' }}
            src={`data:image/png;base64,${aadhaar.photo_base64}`}
            alt='Caffe Latte'
          />

          <Stack>
            <CardBody>
              <Heading size='lg'>Shaikh Mohd Saif</Heading>

              <Text pt=''>
                <span className='font-bold'>Gender:</span> Male
              </Text>
              <Text pt='2'>
                <span className='font-bold'>D.O.B:</span> 1-2-2000
              </Text>
              <Text pt='2'>
                <span className='font-bold'>Address:</span>{' '}
                {`${aadhaar.house}, ${aadhaar.street}, ${aadhaar.landmark}, ${aadhaar.locality}, ${aadhaar.district}, ${aadhaar.pincode}, ${aadhaar.state}`}
              </Text>
              <Heading size='md' pt='5' textAlign='center'>
                2345 6543 5678
              </Heading>
            </CardBody>
          </Stack>
        </Card>
        <div className='flex justify-center items-center mt-5'>
          <Button
            colorScheme='blackAlpha'
            className='ml-4'
            onClick={() => getAadhaarData()}
          >
            Claim NFT
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 ml-3'
            >
              <path
                fillRule='evenodd'
                d='M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z'
                clipRule='evenodd'
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default index;
