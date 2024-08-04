import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/topics/topicsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditTopics = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    title: '',

    posts: [],

    user: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { topics } = useAppSelector((state) => state.topics);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { topicsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: topicsId }));
  }, [topicsId]);

  useEffect(() => {
    if (typeof topics === 'object') {
      setInitialValues(topics);
    }
  }, [topics]);

  useEffect(() => {
    if (typeof topics === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = topics[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [topics]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: topicsId, data }));
    await router.push('/topics/topics-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit topics')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit topics'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Title'>
                <Field name='title' placeholder='Title' />
              </FormField>

              <FormField label='Posts' labelFor='posts'>
                <Field
                  name='posts'
                  id='posts'
                  component={SelectFieldMany}
                  options={initialValues.posts}
                  itemRef={'posts'}
                  showField={'content'}
                ></Field>
              </FormField>

              <FormField label='user' labelFor='user'>
                <Field
                  name='user'
                  id='user'
                  component={SelectField}
                  options={initialValues.user}
                  itemRef={'users'}
                  showField={'name'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/topics/topics-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditTopics.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_TOPICS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditTopics;
