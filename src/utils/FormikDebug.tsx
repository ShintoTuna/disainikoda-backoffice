/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormikConsumer } from 'formik';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const FORMIK_DEBUG_KEY = 'formik-debug';

const FormikDebug = () => {
  const [isOpen, setOpen] = useState(() => !!window.localStorage.getItem(FORMIK_DEBUG_KEY));
  const [el] = useState(() => document.createElement('div'));
  const toggle = () => {
    setOpen((isOpen) => {
      if (!isOpen) {
        window.localStorage.setItem(FORMIK_DEBUG_KEY, 'open');
      } else {
        window.localStorage.removeItem(FORMIK_DEBUG_KEY);
      }
      return !isOpen;
    });
  };

  useEffect(() => {
    document.body.appendChild(el);

    return () => {
      document.body.removeChild(el);
    };
  }, [el]);

  return createPortal(
    <div
      style={{
        borderRadius: 4,
        background: '#f6f8fa',
        boxShadow: '0 0 1px #eee inset',
        color: '#000',
        position: 'absolute',
        bottom: 0,
        right: 0,
        maxHeight: '500px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          textTransform: 'uppercase',
          fontSize: 11,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          fontWeight: 500,
          padding: '.5rem',
          background: '#555',
          color: '#fff',
          letterSpacing: '1px',
        }}
        onClick={toggle}
      >
        Form State
      </div>
      <div style={{ display: isOpen ? 'inherit' : 'none' }}>
        <FormikConsumer>
          {({ validationSchema, validate, ...rest }) => (
            <pre
              style={{
                fontSize: '.65rem',
                padding: '.25rem .5rem',
                overflowX: 'scroll',
                maxHeight: '450px',
              }}
            >
              {JSON.stringify(rest.values, null, 2)}
            </pre>
          )}
        </FormikConsumer>
      </div>
    </div>,
    el,
  );
};

export default FormikDebug;
