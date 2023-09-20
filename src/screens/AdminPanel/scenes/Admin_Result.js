import { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { mockDataResult } from '../data/mockData';
import { tokens } from '../theme';
import Sidebar from './global/Sidebar';
import Topbar from './global/Topbar';

import { db } from '../../../firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

const Admin_Result = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSidebar, setIsSidebar] = useState(true);

  const [data, setData] = useState([]);

  useEffect(() => {
    // fetch result data from database

    const getData = async () => {
      const q = query(
        collection(db, 'users'),
      );
      await getDocs(q).then((response) => {
        let data = response.docs.map((ele) => ({ ...ele.data() }));
        // console.log(data[0].score);
        // setScore(data[0].score);
        setData(data);
      });
    }

    getData();
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
              Test Result and Certificate
            </Typography>
          </div>
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
                          Candidate Name
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Father/Mother Name
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Age
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Gender
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Batch FROM
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Batch TO
                        </th>
                        {/* <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Marksheet
                        </th> */}
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Pass/Fail
                        </th>
                        {/* <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Click to Download Certificate
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Send Email to Download Certificate
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {data.map((data) => (
                        <tr key={data.uid}>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {data.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {data.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {data.fathersName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {data.age}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {data.gender}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {data.batch_from}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {data.batch_to}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {data.score >= 30 ? 'Pass' : 'Fail'}
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                            <a
                              href='#'
                              className='text-indigo-600 hover:text-indigo-900'
                            >
                              Download
                            </a>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='ml-4'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {data.status}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                            <a
                              href='#'
                              className='text-indigo-600 hover:text-indigo-900'
                            >
                              Download
                            </a>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                            <a
                              href='#'
                              className='text-indigo-600 hover:text-indigo-900'
                            >
                              Email
                            </a>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
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
