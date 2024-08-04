import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/topics/topicsSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const TopicsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { topics } = useAppSelector((state) => state.topics);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View topics')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View topics')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Title</p>
            <p>{topics?.title}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Posts</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr></tr>
                  </thead>
                  <tbody>
                    {topics.posts &&
                      Array.isArray(topics.posts) &&
                      topics.posts.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/posts/posts-view/?id=${item.id}`)
                          }
                        ></tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!topics?.posts?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>user</p>

            <p>{topics?.user?.name ?? 'No data'}</p>
          </div>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/topics/topics-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

TopicsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_TOPICS'}>{page}</LayoutAuthenticated>
  );
};

export default TopicsView;
