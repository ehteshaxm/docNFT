import React, { useEffect, useState } from 'react';
import { Highlight } from '@chakra-ui/react';
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import { useAccount, useNetwork } from 'wagmi';
import { Input, Select } from '@chakra-ui/react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { PinInput, PinInputField, HStack } from '@chakra-ui/react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { app, firestore } from '../firebase';
import { doc as fdoc, setDoc as setfdoc, updateDoc } from 'firebase/firestore';
import { Web3Storage } from 'web3.storage';
import { doc, getDoc } from 'firebase/firestore';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react';

const index = () => {
  const [accountExists, setAccountExists] = useState(false);
  const [doc, setDoc] = useState('');
  const account = useAccount();
  const toast = useToast();
  const router = useRouter();

  console.log(account.address);

  const web3Storage = new Web3Storage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg2YWM2RDE0Njk0NzM1OTBBM0NGYzRFOEJlQjRDNjY0NmVhYTBCREIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzkxNTgzODM4MjAsIm5hbWUiOiJteVRva2VuIn0.lvMITWk8W1z_qcVzdv3GUM7SJkI-MOMMVt6RptOlQbU',
  });

  const [license, setLicense] = useState('');
  const [licenseData, setLicenseData] = useState(null);
  const [dob, setDob] = useState('');

  const [otp, setOtp] = useState(null);
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarData, setAadhaarData] = useState(null);
  const [otpCall, setOtpCall] = useState(null);
  const [aadhaarCall, setAadhaarCall] = useState(false);
  const [transactionID, setTransactionID] = useState('');
  const [loading, setLoading] = useState(false);
  const [issueData, setIssueData] = useState({});

  useEffect(() => {
    if (account.address !== null || account.address !== undefined) {
      setAccountExists(true);
    }
  }, [account.address]);

  async function getAadhaarOTP() {
    setLoading(true);
    const options = {
      method: 'POST',
      url: 'https://api.gridlines.io/aadhaar-api/boson/generate-otp',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Type': 'API-Key',
        'X-API-Key': 'wKQuMQ9wN9pFPxG31sP9gV1S1zvv5p27',
      },
      data: { aadhaar_number: aadhaar, consent: 'Y' },
    };

    axios
      .request(options)
      .then(function (response) {
        setLoading(false);
        console.log(response.data.data.transaction_id);
        setTransactionID(response.data.data.transaction_id);
        setOtpCall(response.data);
        toast({
          title: `OTP sent successfully`,
          position: 'top-right',
          isClosable: true,
          status: 'success',
        });
        setAadhaarCall(true);
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
      });
    setAadhaarCall(true);
  }

  async function getAadhaarData() {
    setLoading(true);
    const options = {
      method: 'POST',
      url: 'https://api.gridlines.io/aadhaar-api/boson/submit-otp',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Type': 'API-Key',
        'X-Transaction-ID': transactionID,
        'X-API-Key': 'wKQuMQ9wN9pFPxG31sP9gV1S1zvv5p27',
      },
      data: { otp: otp, include_xml: true, share_code: '1234', consent: 'Y' },
    };

    axios
      .request(options)
      .then(function (response) {
        setLoading(false);
        console.log(response.data);
        console.log(response.data.data.aadhaar_data);
        setAadhaarData(response.data.data.aadhaar_data);
        toast({
          title: `Aadhaar received successfully`,
          position: 'top-right',
          isClosable: true,
          status: 'success',
        });

        setAadhaarIPFS(response.data.data.aadhaar_data);
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
      });
    console.log(otp);
    setAadhaarData({});
  }

  async function setAadhaarIPFS(aadhaarData) {
    try {
      const fileName = `aadhaar${account.address}`;
      const buffer = Buffer.from(JSON.stringify(aadhaarData));
      const newFile = new File([buffer], account.address, {
        type: 'object',
      });
      const rootCid = await web3Storage.put([newFile], {
        name: fileName,
      });
      console.log(`https://${rootCid}.ipfs.w3s.link/${account.address}`);

      const docRef = fdoc(firestore, 'users', account.address);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        await updateDoc(fdoc(firestore, 'users', account.address), {
          aadhaar: `https://${rootCid}.ipfs.w3s.link/${account.address}`,
        });
      } else {
        await setfdoc(fdoc(firestore, 'users', account.address), {
          aadhaar: `https://${rootCid}.ipfs.w3s.link/${account.address}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getLicense() {
    setLoading(true);
    const options = {
      method: 'POST',
      url: 'https://api.gridlines.io/dl-api/fetch',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Type': 'API-Key',
        'X-API-Key': 'wKQuMQ9wN9pFPxG31sP9gV1S1zvv5p27',
      },
      data: {
        driving_license_number: license,
        date_of_birth: dob,
        consent: 'Y',
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setLoading(false);
        console.log(response.data.data.driving_license_data);
        setLicenseData(response.data.data.driving_license_data);
        toast({
          title: `License fetched`,
          position: 'top-right',
          isClosable: true,
          status: 'success',
        });
        setLicenseIPFS(response.data.data.driving_license_data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async function setLicenseIPFS(licenseData) {
    try {
      const fileName = `license${account.address}`;
      const buffer = Buffer.from(JSON.stringify(licenseData));
      const newFile = new File([buffer], account.address, {
        type: 'object',
      });
      const rootCid = await web3Storage.put([newFile], {
        name: fileName,
      });
      // console.log(`https://${rootCid}.ipfs.dweb.link/${fileName}`);

      window.open(
        `https://${rootCid}.ipfs.dweb.link/${account.address}`,
        '_blank'
      );

      const docRef = fdoc(firestore, 'users', account.address);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        await updateDoc(
          fdoc(firestore, 'users', account.address),
          {
            license: `https://${rootCid}.ipfs.w3s.link/${account.address}`,
          },
          { merge: true }
        );
      } else {
        await setfdoc(fdoc(firestore, 'users', account.address), {
          license: `https://${rootCid}.ipfs.dweb.link/${account.address}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getAdhaarNFT() {
    setLoading(true);
    const options = {
      method: 'POST',
      url: 'https://api.verbwire.com/v1/nft/mint/quickMintFromMetadataUrl',
      headers: {
        accept: 'application/json',
        'content-type':
          'multipart/form-data; boundary=---011000010111000001101001',
        'X-API-Key': 'sk_live_2f17853d-cd8a-4a16-85d9-7b7ac0c08aff',
      },
      data: `-----011000010111000001101001\r\nContent-Disposition: form-data; name="allowPlatformToOperateToken"\r\n\r\ntrue\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="chain"\r\n\r\ngoerli\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="metadataUrl"\r\n\r\nhttps://ipfs.io/ipfs/bafyreigzzpvesdodie7k6pqgd5q5b55s3pfh24nf7bxkg7hr4x5oy6nxke/metadata.json\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="recipientAddress"\r\n\r\n${account.address}\r\n-----011000010111000001101001--\r\n\r\n`,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setLoading(false);
        toast({
          title: 'NFT Minted Successfully',
          position: 'top-right',
          isClosable: true,
          status: 'success',
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async function getLicenseNFT() {
    setLoading(true);
    const options = {
      method: 'POST',
      url: 'https://api.verbwire.com/v1/nft/mint/quickMintFromMetadataUrl',
      headers: {
        accept: 'application/json',
        'content-type':
          'multipart/form-data; boundary=---011000010111000001101001',
        'X-API-Key': 'sk_live_2f17853d-cd8a-4a16-85d9-7b7ac0c08aff',
      },
      data: `-----011000010111000001101001\r\nContent-Disposition: form-data; name="allowPlatformToOperateToken"\r\n\r\ntrue\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="chain"\r\n\r\ngoerli\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="metadataUrl"\r\n\r\nhttps://ipfs.io/ipfs/bafyreignfqm3hfcqg2fwv6y46fkoch7gnctugyz435p53gvpijbmbkpnre/metadata.json\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="recipientAddress"\r\n\r\n${account.address}\r\n-----011000010111000001101001--\r\n\r\n`,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setLoading(false);
        toast({
          title: 'NFT Minted Successfully',
          position: 'top-right',
          isClosable: true,
          status: 'success',
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <>
      {aadhaarData === null && licenseData === null ? (
        <div className='min-h-screen bg-slate-50 flex justify-center items-center flex-col relative'>
          <div className='absolute -top-16 w-full h-80 filter blur-3xl bg-gradient-to-r from-indigo-200 to-blue-300'></div>
          <div className='w-20 h-20 absolute bg-stone-800 rounded-full bottom-5 right-5 flex justify-center items-center'>
            <Popover>
              <PopoverTrigger>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-10 h-10 text-white'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155'
                  />
                </svg>
              </PopoverTrigger>
              <PopoverContent mr='3' borderColor={'yellow.300'}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Get Started</PopoverHeader>
                <PopoverBody boder='1px gray'>
                  Sign in with your crypto wallet and choose a document to
                  create an NFT
                </PopoverBody>
                <PopoverBody boder='1px gray'>
                  Add relevant details such as OTPs
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
          <div
            style={{ width: '600px' }}
            className='flex justify-end items-center font-bold text-3xl mb-1 relative z-10 mt-20'
          >
            <span className='font-semibold mr-5'>powered by</span>
            <Image src='/verb.png' className='w-8 mr-2' />
            VERBWIRE
          </div>
          <h1 className='text-9xl font-black text-black block mb-8'>
            🖼️ docNFT
          </h1>
          <div className='max-w-md mb-10 text-center leading-loose'>
            docNFT is a{' '}
            <span className='bg-teal-200 rounded-full p-1 px-2'>
              Blockchain
            </span>{' '}
            based <br />
            <span className='bg-orange-300 rounded-full p-1 px-2'>
              document verification infrastructure
            </span>{' '}
            basesd on NFTs Connect your wallet and claim your Id now.
          </div>
          {account.address === null || account.address === undefined ? (
            <Web3Button />
          ) : null}
          {doc === '' && account.address !== undefined ? (
            <div className='max-w-md mx-auto flex items-center justify-center'>
              <Select
                placeholder='Select Document'
                size='lg'
                focusBorderColor='green.400'
                borderColor='green.400'
                borderWidth='2px'
                width='300px'
                onChange={(e) => setDoc(e.target.value)}
              >
                <option value='Aadhaar'>Aadhaar</option>
                <option value='PAN Card'>PAN Card</option>
                <option value='Driving License'>Driving License</option>
                <option value='Passport'>Passport</option>
                <option value='Voter ID'>Voter ID</option>
              </Select>
            </div>
          ) : null}
          {otp === null && doc == 'Aadhaar' && aadhaarCall === false ? (
            <div className='max-w-md mx-auto flex items-center justify-center'>
              <div className='max-w-md mx-auto flex items-center justify-center'>
                <Input
                  placeholder='Aadhaar Number'
                  size='lg'
                  type='number'
                  focusBorderColor='green.400'
                  borderColor='green.400'
                  borderWidth='2px'
                  width='300px'
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                ></Input>
                <Button
                  colorScheme='green'
                  className='ml-3'
                  isLoading={loading}
                  onClick={() => getAadhaarOTP()}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3'
                    />
                  </svg>
                </Button>
              </div>
            </div>
          ) : doc === 'Driving License' ? (
            <div className='max-w-sm mx-auto flex items-center justify-center'>
              <div>
                <Input
                  placeholder='Driving License Number'
                  size='lg'
                  focusBorderColor='green.400'
                  borderColor='green.400'
                  borderWidth='2px'
                  width='300px'
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                ></Input>
                <Input
                  placeholder='DOB'
                  size='lg'
                  focusBorderColor='green.400'
                  borderColor='green.400'
                  borderWidth='2px'
                  width='300px'
                  value={dob}
                  className='mt-3'
                  onChange={(e) => setDob(e.target.value)}
                ></Input>
              </div>
              <Button
                colorScheme='green'
                isLoading={loading}
                onClick={() => getLicense()}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3'
                  />
                </svg>
              </Button>
            </div>
          ) : null}
          {aadhaarCall === true && (
            <div className='max-w-md mx-auto flex items-center justify-center'>
              <div className='max-w-md mx-auto flex items-center justify-center'>
                <HStack>
                  <PinInput>
                    <PinInputField
                      borderColor='green.300'
                      borderWidth='2px'
                      onChange={(e) => {
                        let temp = e.target.value;
                        setOtp(parseInt(temp));
                      }}
                    />
                    <PinInputField
                      borderColor='green.300'
                      borderWidth='2px'
                      onChange={(e) => {
                        let temp = otp;
                        temp = otp + `${e.target.value}`;
                        setOtp(parseInt(temp));
                      }}
                    />
                    <PinInputField
                      borderColor='green.300'
                      borderWidth='2px'
                      onChange={(e) => {
                        let temp = otp;
                        temp = otp + `${e.target.value}`;
                        setOtp(parseInt(temp));
                      }}
                    />
                    <PinInputField
                      borderColor='green.300'
                      borderWidth='2px'
                      onChange={(e) => {
                        let temp = otp;
                        temp = otp + `${e.target.value}`;
                        setOtp(parseInt(temp));
                      }}
                    />
                    <PinInputField
                      borderColor='green.300'
                      borderWidth='2px'
                      onChange={(e) => {
                        let temp = otp;
                        temp = otp + `${e.target.value}`;
                        setOtp(parseInt(temp));
                      }}
                    />
                    <PinInputField
                      borderColor='green.300'
                      borderWidth='2px'
                      onChange={(e) => {
                        let temp = otp;
                        temp = otp + `${e.target.value}`;
                        setOtp(parseInt(temp));
                      }}
                    />
                  </PinInput>
                </HStack>
                <Button
                  colorScheme='green'
                  className='ml-4'
                  onClick={() => getAadhaarData()}
                  isLoading={loading}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3'
                    />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='min-h-screen flex justify-center items-center flex-col'>
          <div className='max-w-lg relative'>
            <div className='h-96 w-96 bg-orange-400 absolute z-0 -top-10 -left-10 blur-3xl rounded-full bg-blend-overlay'></div>
            <div className='h-96 w-96 bg-green-400 absolute z-0 -bottom-10 -right-10 blur-3xl rounded-full bg-blend-overlay'></div>
            {doc === 'Aadhaar' ? (
              <>
                <Card
                  direction={{ base: 'column', sm: 'row' }}
                  overflow='hidden'
                  variant='outline'
                  className='relative z-10'
                >
                  <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src={`data:image/png;base64,${aadhaarData.photo_base64}`}
                    alt='Caffe Latte'
                  />

                  <Stack>
                    <CardBody>
                      <div className='flex items-center justify-between'>
                        <Heading size='lg'>{aadhaarData.name}</Heading>
                        <Image
                          objectFit='cover'
                          maxW={'50px'}
                          src='/aadhaar.svg'
                          alt='Caffe Latte'
                        />
                      </div>

                      <Text pt='3'>
                        <span className='font-bold'>Gender:</span>{' '}
                        {aadhaarData.gender}
                      </Text>
                      <Text pt='2'>
                        <span className='font-bold'>D.O.B:</span>{' '}
                        {aadhaarData.date_of_birth}
                      </Text>
                      <Text pt='2'>
                        <span className='font-bold'>Address:</span>{' '}
                        {`${aadhaarData.house}, ${aadhaarData.street}, ${aadhaarData.landmark}, ${aadhaarData.locality}, ${aadhaarData.district}, ${aadhaarData.pincode}, ${aadhaarData.state}`}
                      </Text>
                      <Heading size='md' pt='5' textAlign='center'>
                        {aadhaar}
                      </Heading>
                    </CardBody>
                  </Stack>
                </Card>
                <div className='flex justify-center items-center mt-5'>
                  <Button
                    colorScheme='blackAlpha'
                    className='ml-4'
                    onClick={() => getAdhaarNFT()}
                    isLoading={loading}
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
              </>
            ) : (
              <>
                <Card
                  direction={{ base: 'column', sm: 'row' }}
                  overflow='hidden'
                  variant='outline'
                  className='relative z-10'
                >
                  <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src={`data:image/png;base64,${licenseData.photo_base64}`}
                    alt='Caffe Latte'
                  />

                  <Stack>
                    <CardBody>
                      <div className='flex items-center justify-between'>
                        <Heading size='lg'>{licenseData.name}</Heading>
                        <Image
                          objectFit='cover'
                          maxW={'80px'}
                          src='/ashoka.svg'
                          alt='Caffe Latte'
                        />
                      </div>

                      <Text pt='3'>
                        <span className='font-bold'>Vehicles:</span>{' '}
                        {licenseData.vehicle_class_details
                          .map((item) => item.category)
                          .map((item) => (
                            <Text display='inline' mr='1'>
                              {item}
                            </Text>
                          ))}
                      </Text>
                      <Text pt='2'>
                        <span className='font-bold'>D.O.B:</span>{' '}
                        {licenseData.date_of_birth}
                      </Text>
                      <Text pt='2'>
                        <span className='font-bold'>Address:</span>{' '}
                        {licenseData.address}
                      </Text>
                      <Heading size='md' pt='5' textAlign='center'>
                        {aadhaar}
                      </Heading>
                    </CardBody>
                  </Stack>
                </Card>
                <div className='flex justify-center items-center mt-5'>
                  <Button
                    colorScheme='blackAlpha'
                    className='ml-4'
                    onClick={() => getLicenseNFT()}
                    isLoading={loading}
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default index;
