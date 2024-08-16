import { Field, Form, Formik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import * as Yup from 'yup';
import { api } from '@/trpc/react';
import { useState } from 'react';

export default function UseGiftCodeForm({
  submitForm,
}: {
  submitForm: (giftCode: string) => void;
}) {
  const [code, setCode] = useState<string>('');
  const getCodeQuery = api.giftCodes.checkGiftCodeValidity.useQuery({
    code: code,
  });
  const validateSchema = Yup.object().shape({
    giftCode: Yup.string()
      .required('This field required')
      .test(
        'Check giftCode validity',
        'Gift code invalid',
        () => getCodeQuery.data === true
      ),
  });

  return (
    <div
      className={
        'flex w-[22.5vw] flex-col gap-[0.521vw] rounded-b-[0.521vw] bg-[#252525] p-[0.521vw]'
      }
    >
      <span className={'font-plexsans text-[0.729vw] text-foreground'}>
        Enter your gift code here
      </span>
      <Formik
        initialValues={{ giftCode: '' }}
        onSubmit={({ giftCode }) => submitForm(giftCode)}
        validationSchema={validateSchema}
      >
        {({ errors, touched }) => (
          <Form
            className={
              'flex w-[80%] flex-row items-center justify-start gap-[0.521vw]'
            }
            onChange={(event) => {
              // @ts-ignore
              setCode(event.target.value);
            }}
          >
            <div className={'flex w-full flex-col gap-[0.521vw]'}>
              <Field
                name={'giftCode'}
                type={'text'}
                className={
                  'w-full rounded-[0.26vw] border border-foreground bg-[#252525] p-[0.208vw] font-plexsans text-[0.729vw] text-foreground placeholder:opacity-60'
                }
                placeholder={'Type your gift code...'}
              />
              <AnimatePresence>
                {errors.giftCode && touched.giftCode && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: 'spring',
                      duration: 0.8,
                      bounce: 0,
                    }}
                    className={
                      'flex w-full flex-row items-center gap-[0.417vw]'
                    }
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="7"
                        cy="7"
                        r="6"
                        fill="#FF0000"
                        stroke="#FF0000"
                        strokeWidth="0.500035"
                      />
                      <path
                        d="M6.71858 8.69036L6.29858 5.10236V2.71436H7.71458V5.10236L7.31858 8.69036H6.71858ZM7.01858 11.2344C6.71458 11.2344 6.49058 11.1624 6.34658 11.0184C6.21058 10.8664 6.14258 10.6744 6.14258 10.4424V10.2384C6.14258 10.0064 6.21058 9.81836 6.34658 9.67436C6.49058 9.52236 6.71458 9.44636 7.01858 9.44636C7.32258 9.44636 7.54258 9.52236 7.67858 9.67436C7.82258 9.81836 7.89458 10.0064 7.89458 10.2384V10.4424C7.89458 10.6744 7.82258 10.8664 7.67858 11.0184C7.54258 11.1624 7.32258 11.2344 7.01858 11.2344Z"
                        fill="#F9F8F4"
                      />
                    </svg>
                    <span
                      className={'font-plexsans text-[0.729vw] text-[#FF0000]'}
                    >
                      {errors.giftCode}
                    </span>
                  </motion.div>
                )}
                {!errors.giftCode &&
                  touched.giftCode &&
                  getCodeQuery.data === true && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        duration: 0.8,
                        bounce: 0,
                      }}
                      className={
                        'flex w-full flex-row items-center gap-[0.417vw]'
                      }
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="7"
                          cy="7"
                          r="6"
                          fill="#22c55e"
                          stroke="#22c55e"
                          strokeWidth="0.500035"
                        />
                        <path
                          d="M6.71858 8.69036L6.29858 5.10236V2.71436H7.71458V5.10236L7.31858 8.69036H6.71858ZM7.01858 11.2344C6.71458 11.2344 6.49058 11.1624 6.34658 11.0184C6.21058 10.8664 6.14258 10.6744 6.14258 10.4424V10.2384C6.14258 10.0064 6.21058 9.81836 6.34658 9.67436C6.49058 9.52236 6.71458 9.44636 7.01858 9.44636C7.32258 9.44636 7.54258 9.52236 7.67858 9.67436C7.82258 9.81836 7.89458 10.0064 7.89458 10.2384V10.4424C7.89458 10.6744 7.82258 10.8664 7.67858 11.0184C7.54258 11.1624 7.32258 11.2344 7.01858 11.2344Z"
                          fill="#F9F8F4"
                        />
                      </svg>
                      <span
                        className={
                          'font-plexsans text-[0.729vw] text-[#22c55e]'
                        }
                      >
                        Gift code valid!
                      </span>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
            <button
              type={'submit'}
              className={
                'mb-auto w-[3.646vw] rounded-[0.26vw] bg-middle-accent p-[0.313vw] text-center font-museo text-[0.729vw] font-medium hover:opacity-80'
              }
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
