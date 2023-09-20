import { Component, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// import * as firebase from "firebase";
import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
// import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import { useForm } from 'react-hook-form';
import { Controller, set, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';

import { db, storage } from '../../../firebase';
import { mockDataResult } from '../data/mockData';
import { tokens } from '../theme';
import Sidebar from './global/Sidebar';
import Topbar from './global/Topbar';

// import { Controller } from 'react-hook-form';

const schema = yup.object().shape({
  content_eng: yup.string().required('content_eng is required'),
  content_punj: yup.string().required('content_punj is required'),
  option1_eng: yup.string().required('option1_eng is required'),
  option2_eng: yup.string().required('option2_eng is required'),
  option3_eng: yup.string().required('option3_eng is required'),
  option4_eng: yup.string().required('option4_eng is required'),
  option1_punj: yup.string().required('option1_punj is required'),
  option2_punj: yup.string().required('option2_punj is required'),
  option3_punj: yup.string().required('option3_punj is required'),
  option4_punj: yup.string().required('option4_punj is required'),
  correct_option: yup.number().required('correct_option is required'),
  img: yup.string().required('img is required'),
});

const Admin_Result = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSidebar, setIsSidebar] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [open, setOpen] = useState(false);

  const [open_eng, setOpenEng] = useState(false);

  const handleCloseEng = () => {
    setOpenEng(false);
  };

  const handleOpenEng = () => {
    setOpenEng(true);
  };

  const [open_punj, setOpenPunj] = useState(false);

  const handleClosePunj = () => {
    setOpenPunj(false);
  };

  const handleOpenPunj = () => {
    setOpenPunj(true);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const onSubmit = async (data, e) => {
    try {
      console.log(data);
      setOpen(false);

      setError('');
      setLoading(true);

      data.id = uuidv4();

      // tkae data from form and upload it to firebase
      const uploadData = async (data) => {
        try {
          const engData = {
            QuestionId: data.id,
            Content: data.content_eng,
            Options: [
              data.option1_eng,
              data.option2_eng,
              data.option3_eng,
              data.option4_eng,
            ],
            Correct_option: data.correct_option,
            Image: data.img,
            Language: 'English',
          };

          const punjData = {
            QuestionId: data.id,
            Content: data.content_punj,
            Options: [
              data.option1_punj,
              data.option2_punj,
              data.option3_punj,
              data.option4_punj,
            ],
            Correct_option: data.correct_option,
            Image: data.img,
            Language: 'Punjabi',
          };

          const docRefEng = await addDoc(
            collection(db, 'test-questions'),
            engData
          );
          console.log('Document Eng written with ID: ', docRefEng.id);

          const docRefPunj = await addDoc(
            collection(db, 'test-questions'),
            punjData
          );
          console.log('Document Punj written with ID: ', docRefPunj.id);
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      };

      try {
        console.log('heyy');

        const testImageData = ref(storage, `test-images/${data.id}`);
        await uploadBytes(testImageData, e.target.img.files[0])
          .then((snapshot) => {
            console.log(snapshot);
            getDownloadURL(snapshot.ref).then(async (doc_URL) => {
              console.log(doc_URL);
              data.img = doc_URL;
              await uploadData(data);
            });
          })
          .catch((er) => {
            window.alert("Couldn't upload Image");
            console.log(er);
          });

        console.log('uploading Image');
      } catch (e) {
        console.error('Error uploading Image: ', e);
        setError('Failed to upload Image');
      }

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const [info, setInfo] = useState([]);

  useEffect(() => {
    const subscriber = db
      .collection('test-questions')
      .get()
      .then((querySnapshot) => {
        const InfoisList = [];
        querySnapshot.forEach((documentSnapshot) => {
          InfoisList.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        // setInfo(InfoisList);
        console.log(InfoisList);
        // Club the data with the same id
        const unique = [...new Set(InfoisList.map((item) => item.id))];
        const uniqueData = [];
        unique.forEach((id) => {
          const data = InfoisList.filter((item) => item.id === id);
          uniqueData.push(data);
        });
        console.log(uniqueData);
        setInfo(uniqueData);

        // console.log(uniqueData[0][0].QuestionId);
      });
  }, []);

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <div>
        <Topbar />
      </div>
      <div className='flex flex-1'>
        <div>
          <Sidebar isSidebar={isSidebar} />
        </div>
        <div className='flex-1 overflow-x-auto'>
          <div className='text-center'>
            <Typography variant='h5' color={colors.greenAccent[400]}>
              Test Questions
            </Typography>
          </div>
          <hr class='h-px my-8 bg-gray-200 border-2 dark:bg-gray-700'></hr>
          <div className='flex flex-row justify-between'>
            <button
              className='bg-[#c54545] px-3 py-2 text-white mx-20'
              onClick={handleOpen}
            >
              Add Test Questions
            </button>
          </div>

          <Modal onClose={handleClose} open={open}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 900,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography
                id='modal-modal-correct_option'
                variant='h6'
                component='h2'
              >
                Add Questions{' '}
                {/* Content_eng Image Options Correct_Option Language */}
              </Typography>
              <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='content_eng'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Content English'
                            error={!!errors.content_eng}
                            helperText={errors?.content_eng?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='content_punj'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Content Punjabi'
                            error={!!errors.content_punj}
                            helperText={errors?.content_punj?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='option1_eng'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Option 1 English'
                            error={!!errors.option1_eng}
                            helperText={errors?.option1_eng?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='option1_punj'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Option 1 Punjabi'
                            error={!!errors.option1_punj}
                            helperText={errors?.option1_punj?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='option2_eng'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Option 2 English'
                            error={!!errors.option2_eng}
                            helperText={errors?.option2_eng?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='option2_punj'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Option 2 Punjabi'
                            error={!!errors.option2_punj}
                            helperText={errors?.option2_punj?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='option3_eng'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Option 3 English'
                            error={!!errors.option3_eng}
                            helperText={errors?.option3_eng?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='option3_punj'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Option 3 Punjabi'
                            error={!!errors.option3_punj}
                            helperText={errors?.option3_punj?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='option4_eng'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Option 4 English'
                            error={!!errors.option4_eng}
                            helperText={errors?.option4_eng?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='option4_punj'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Option 4 Punjabi'
                            error={!!errors.option4_punj}
                            helperText={errors?.option4_punj?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='correct_option'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Correct Option'
                            type='number'
                            InputProps={{ inputProps: { min: 1, max: 4 } }}
                            error={!!errors.correct_option}
                            helperText={errors?.correct_option?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='img'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Upload Image'
                            error={!!errors.img}
                            helperText={errors?.img?.message}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type='file'
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <div className='flex flex-row justify-between my-4'>
                    <Button variant='contained' color='primary' type='submit'>
                      Submit
                    </Button>
                  </div>
                </form>
              </Typography>
            </Box>
          </Modal>

          <hr class='h-px my-8 bg-gray-200 border-2 dark:bg-gray-700'></hr>

          <div className='flex flex-col'>
            <div className='-my-4 overflow-x-auto'>
              <div className='py-6 align-middle inline-block min-w-full pl-4 pr-4'>
                <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          UID
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          View Eng
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          View Punj
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          correct_option
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Image
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Delete
                        </th>
                      </tr>
                    </thead>
                    {}
                    {info.map((info) => (
                      <tbody className='bg-white divide-y divide-gray-200'>
                        <tr key={info}>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {info[0].QuestionId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  <Button
                                    variant='contained'
                                    color='secondary'
                                    onClick={() => {
                                      // create Modal and show the data
                                      // console.log(info);
                                      // setModalData(info);

                                      //open the modal
                                      handleOpenEng();
                                    }}
                                  >
                                    View
                                  </Button>

                                  <Modal
                                    onClose={handleCloseEng}
                                    open={open_eng}
                                  >
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 900,
                                        bgcolor: 'background.paper',
                                        border: '2px solid #000',
                                        boxShadow: 24,
                                        p: 4,
                                      }}
                                    >
                                      <Typography
                                        id='modal-modal-correct_option'
                                        variant='h6'
                                        component='h2'
                                      >
                                        {
                                          // check if the language is english
                                          info[0].Language === 'English'
                                            ? info[0].Content
                                            : info[1].Content
                                        }
                                      </Typography>
                                      {/*Display options */}
                                      <Typography
                                        id='modal-modal-description'
                                        sx={{ mt: 2 }}
                                      >
                                        <div className='flex flex-col'>
                                          <div className='-my-4 overflow-x-auto'>
                                            <div className='py-6 align-middle inline-block min-w-full pl-4 pr-4'>
                                              <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                                                <table className='min-w-full divide-y divide-gray-200'>
                                                  <thead className='bg-gray-50'>
                                                    <tr>
                                                      <th
                                                        scope='col'
                                                        className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                                                      >
                                                        Option 1
                                                      </th>
                                                      <th
                                                        scope='col'
                                                        className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                                                      >
                                                        Option 2
                                                      </th>
                                                      <th
                                                        scope='col'
                                                        className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                                                      >
                                                        Option 3
                                                      </th>
                                                      <th
                                                        scope='col'
                                                        className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                                                      >
                                                        Option 4
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody className='bg-white divide-y divide-gray-200'>
                                                    <tr key={info}>
                                                      <td className='px-6 py-4 whitespace-nowrap'>
                                                        <div className='flex items-center'>
                                                          <div className='ml-4'>
                                                            <div className='text-sm font-medium text-gray-900'>
                                                              {info[0]
                                                                .Language ===
                                                              'English'
                                                                ? info[0]
                                                                    .Options[0]
                                                                : info[1]
                                                                    .Options[0]}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </td>
                                                      <td className='px-6 py-4 whitespace-nowrap'>
                                                        <div className='flex items-center'>
                                                          <div className='ml-4'>
                                                            <div className='text-sm font-medium text-gray-900'>
                                                              {info[0]
                                                                .Language ===
                                                              'English'
                                                                ? info[0]
                                                                    .Options[1]
                                                                : info[1]
                                                                    .Options[1]}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </td>
                                                      <td className='px-6 py-4 whitespace-nowrap'>
                                                        <div className='flex items-center'>
                                                          <div className='ml-4'>
                                                            <div className='text-sm font-medium text-gray-900'>
                                                              {info[0]
                                                                .Language ===
                                                              'English'
                                                                ? info[0]
                                                                    .Options[2]
                                                                : info[1]
                                                                    .Options[2]}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </td>
                                                      <td className='px-6 py-4 whitespace-nowrap'>
                                                        <div className='flex items-center'>
                                                          <div className='ml-4'>
                                                            <div className='text-sm font-medium text-gray-900'>
                                                              {info[0]
                                                                .Language ===
                                                              'English'
                                                                ? info[0]
                                                                    .Options[3]
                                                                : info[1]
                                                                    .Options[3]}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Typography>
                                    </Box>
                                  </Modal>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  <Button
                                    variant='contained'
                                    color='secondary'
                                    onClick={() => {
                                      // create Modal and show the data
                                      // console.log(info);
                                      // setModalData(info);
                                      handleOpenPunj();
                                    }}
                                  >
                                    View
                                  </Button>

                                  <Modal
                                    onClose={handleClosePunj}
                                    open={open_punj}
                                  >
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 900,
                                        bgcolor: 'background.paper',
                                        border: '2px solid #000',
                                        boxShadow: 24,
                                        p: 4,
                                      }}
                                    >
                                      <Typography
                                        id='modal-modal-correct_option'
                                        variant='h6'
                                        component='h2'
                                      >
                                        {
                                          // check if the language is english
                                          info[0].Language === 'Punjabi'
                                            ? info[0].Content
                                            : info[1].Content
                                        }
                                      </Typography>
                                      {/*Display options */}
                                      <Typography
                                        id='modal-modal-description'
                                        sx={{ mt: 2 }}
                                      >
                                        <div className='flex flex-col'>
                                          <div className='-my-4 overflow-x-auto'>
                                            <div className='py-6 align-middle inline-block min-w-full pl-4 pr-4'>
                                              <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                                                <table className='min-w-full divide-y divide-gray-200'>
                                                  <thead className='bg-gray-50'>
                                                    <tr>
                                                      <th
                                                        scope='col'
                                                        className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                                                      >
                                                        Option 1
                                                      </th>
                                                      <th
                                                        scope='col'
                                                        className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                                                      >
                                                        Option 2
                                                      </th>
                                                      <th
                                                        scope='col'
                                                        className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                                                      >
                                                        Option 3
                                                      </th>
                                                      <th
                                                        scope='col'
                                                        className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                                                      >
                                                        Option 4
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody className='bg-white divide-y divide-gray-200'>
                                                    <tr key={info}>
                                                      <td className='px-6 py-4 whitespace-nowrap'>
                                                        <div className='flex items-center'>
                                                          <div className='ml-4'>
                                                            <div className='text-sm font-medium text-gray-900'>
                                                              {info[0]
                                                                .Language ===
                                                              'Punjabi'
                                                                ? info[0]
                                                                    .Options[0]
                                                                : info[1]
                                                                    .Options[0]}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </td>
                                                      <td className='px-6 py-4 whitespace-nowrap'>
                                                        <div className='flex items-center'>
                                                          <div className='ml-4'>
                                                            <div className='text-sm font-medium text-gray-900'>
                                                              {info[0]
                                                                .Language ===
                                                              'Punjabi'
                                                                ? info[0]
                                                                    .Options[1]
                                                                : info[1]
                                                                    .Options[1]}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </td>
                                                      <td className='px-6 py-4 whitespace-nowrap'>
                                                        <div className='flex items-center'>
                                                          <div className='ml-4'>
                                                            <div className='text-sm font-medium text-gray-900'>
                                                              {info[0]
                                                                .Language ===
                                                              'Punjabi'
                                                                ? info[0]
                                                                    .Options[2]
                                                                : info[1]
                                                                    .Options[2]}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </td>
                                                      <td className='px-6 py-4 whitespace-nowrap'>
                                                        <div className='flex items-center'>
                                                          <div className='ml-4'>
                                                            <div className='text-sm font-medium text-gray-900'>
                                                              {info[0]
                                                                .Language ===
                                                              'Punjabi'
                                                                ? info[0]
                                                                    .Options[3]
                                                                : info[1]
                                                                    .Options[3]}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Typography>
                                    </Box>
                                  </Modal>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {info[0].Correct_option}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                            <a
                              href={info[0].Image}
                              className='text-indigo-600 hover:text-indigo-900'
                            >
                              Download
                            </a>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                            <Button
                              variant='contained'
                              color='secondary'
                              type='submit'
                              onClick={async () => {
                                // Delete both the documents
                                const q = query(
                                  collection(db, 'test-questions'),
                                  where('QuestionId', '==', info[0].QuestionId)
                                );
                                await getDocs(q).then(async (response) => {
                                  let data = response.docs.map((ele) => ({
                                    ...ele.data(),
                                  }));
                                  const ref = doc(
                                    db,
                                    'test-questions',
                                    response.docs[0].id
                                  );
                                  await deleteDoc(ref);
                                });

                                const q1 = query(
                                  collection(db, 'test-questions'),
                                  where('QuestionId', '==', info[1].QuestionId)
                                );
                                await getDocs(q1).then(async (response) => {
                                  let data = response.docs.map((ele) => ({
                                    ...ele.data(),
                                  }));
                                  const ref = doc(
                                    db,
                                    'test-questions',
                                    response.docs[0].id
                                  );
                                  await deleteDoc(ref);
                                });

                                // console.log(info.id);
                                // // get the document id and delete it
                                // const q = query(collection(db, "study"), where("id", "==", info.id));
                                // await getDocs(q).then(async (response) => {
                                //     let data = response.docs.map((ele) => ({ ...ele.data() }));
                                //     const ref = doc(db, 'study', response.docs[0].id);
                                //     await deleteDoc(ref);
                                //     // Refresh the page
                                //     window.location.reload();
                                // });
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Result;
