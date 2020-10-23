import React from 'react';

import { Grid, InputAdornment, Typography } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { ipcRenderer } from 'electron';

import { string, object, number, boolean, array } from 'yup';

interface ConfigForm {
  host: string
}

export const Config = () => {

  const handleSubmit = (values: ConfigForm) => {
    console.log(values);
  };

  // Defaults taken from https://github.com/nodecg/nodecg/blob/master/lib/config/loader.js

  const logLevelSchema = string().oneOf(['trace', 'debug', 'info', 'warn', 'error']).default('info');

  const schema = object().shape({
    host: string().default('localhost'),
    port: number().default(9090),
    baseURL: string().default(''),
    developer: boolean().default(false),
    exitOnUncaught: boolean().default(true),
    logging: object().shape({
      replicants: boolean().default(false),
      console: object().shape({
        enabled: boolean().default(false),
        level: logLevelSchema
      }),
      file: object().shape({
        enabled: boolean().default(false),
        path: string().default('logs/nodecg.log'),
        level: logLevelSchema
      })
    }),
    bundles: object().shape({
      enabled: array().when('$disabled', {
        is: null,
        then: array().of(string()),
        otherwise: null,
      }).default(null),
      disabled: array().when('$enabled', {
        is: null,
        then: array().of(string()),
        otherwise: null,
      }).default(null)
    })
  });

  const config = ipcRenderer.sendSync('sync-get-config', ['core']);

  return (
    <>
      <Typography variant="h6">Config</Typography>
      <Typography>Work in Progress</Typography>
      <Formik initialValues={config} onSubmit={handleSubmit} validationSchema={schema}>
        <Form>
          <Grid container>
            <Grid item xs={6}>
              <Field component={TextField} name="host" type="text" label="Host" fullWidth margin="normal"
                     helperText={(<>The IP address or hostname that NodeCG should bind to. <i>Default:
                       localhost</i></>)} />
            </Grid>
            <Grid item xs={6}>
              <Field component={TextField} name="port" type="number" label="Port" fullWidth margin="normal" min="1"
                     helperText={(<>The port that NodeCG should listen on. <i>Default: 9090</i></>)}
                     InputProps={{ startAdornment: <InputAdornment position="start">:</InputAdornment> }} />
            </Grid>
          </Grid>
          <Field component={TextField} name="baseURL" type="string" label="Base URL" fullWidth margin="normal"
                 helperText={(<>The URL of this instance. <i>Defaults to the above</i></>)} />
        </Form>
      </Formik>
    </>
  );
};