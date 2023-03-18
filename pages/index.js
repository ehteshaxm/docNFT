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

const index = () => {
  const [accountExists, setAccountExists] = useState(false);
  const [doc, setDoc] = useState('');
  const account = useAccount();
  const toast = useToast();
  const router = useRouter();

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
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
      });
    console.log(otp);
    setAadhaarData({});
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
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <>
      {aadhaarData === null && licenseData === null ? (
        <div className='min-h-screen bg-slate-50 flex justify-center items-center flex-col'>
          <h1 className='text-7xl font-black text-black block mb-8'>
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
            basesd on NFTs connect your wallet and claim your Id now.
          </div>
          {accountExists === false ? <Web3Button /> : null}
          {doc === '' && accountExists === true ? (
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
            ) : (
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default index;
