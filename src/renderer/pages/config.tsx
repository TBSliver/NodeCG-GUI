import React, { useState } from 'react';

import { Button, Typography } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { ipcRenderer } from 'electron';

import { string, object, number } from 'yup';
import { ipcCommands, ipcMessages } from 'common/ipc-messages';

interface ConfigForm {
  host: string
}

export const Config = () => {
  const fetchConfig = () => ipcRenderer.sendSync(ipcCommands.getConfig, 'nodecg');
  const [config, setConfig] = useState(fetchConfig());

  const handleFormSubmit = async (values: ConfigForm) => {
    ipcRenderer.sendSync(ipcCommands.setConfig, ['nodecg', values]);
  };

  // Defaults taken from https://github.com/nodecg/nodecg/blob/master/lib/config/loader.js
  const schema = object({
    host: string().default('localhost'),
    port: number().default(9090)
  });

  ipcRenderer.on(ipcMessages.configUpdated, (e, confFile) => {
    if (confFile === 'nodecg')
      setConfig(fetchConfig());
  });

  const initialValues = schema.cast(config);

  return (
    <>
      <Typography variant="h3" component="h1">Config</Typography>
      <Typography>Making any changes here will require restarting NodeCG</Typography>
      {/* @ts-ignore Getting defaults wrong for some reason */}
      <Formik initialValues={initialValues} onSubmit={handleFormSubmit} validationSchema={schema}>
        {({ submitForm, isSubmitting }) => (
          <Form>
            <Field component={TextField} name="host" type="text" label="Host" fullWidth margin="normal"
                   helperText={(<>The IP address or hostname that NodeCG should bind to. <i>Default:
                     localhost</i></>)} />
            <Field component={TextField} name="port" type="number" label="Port" fullWidth margin="normal" min="1"
                   helperText={(<>The port that NodeCG should listen on. <i>Default: 9090</i></>)} />
            <Button onClick={submitForm} disabled={isSubmitting} variant="contained" fullWidth>Save</Button>
          </Form>
        )}
      </Formik>
    </>
  );
};