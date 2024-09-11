import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Field, useField } from 'formik';

export default function Checkbox({
  name,
  value,
}: {
  name: string;
  value?: boolean;
}) {
  const [field, meta] = useField(name);

  return (
    <motion.div
      className={clsx(
        'relative cursor-pointer rounded-[5px] border p-1 hover:opacity-80',
        {
          'hover:border-[#FF00009C]': meta.error && meta.touched,
        }
      )}
      variants={{
        default: { borderColor: '#F9F8F4', backgroundColor: '#212121' },
        active: { borderColor: '#D2FF00', backgroundColor: '#D2FF00' },
        error: { borderColor: '#FF0000' },
      }}
      animate={
        meta.error && meta.touched
          ? 'error'
          : field.value
            ? 'active'
            : 'default'
      }
      transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
    >
      <Field
        {...field}
        name={name}
        type={'checkbox'}
        value={value}
        className={'absolute left-0 top-0 h-full w-full opacity-0'}
      />
      <motion.svg
        aria-hidden="true"
        role="presentation"
        viewBox="0 0 17 18"
        className={'h-3.5 w-3.5'}
      >
        <motion.polyline
          fill="none"
          points="1 9 7 14 15 4"
          stroke="#252525"
          strokeDasharray="22"
          strokeDashoffset="44"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          animate={field.value ? { pathLength: 1 } : { pathLength: 0 }}
        />
      </motion.svg>
    </motion.div>
  );
}
