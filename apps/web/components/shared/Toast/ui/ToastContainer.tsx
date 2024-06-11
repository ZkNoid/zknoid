import { useToasterStore } from '@/lib/stores/toasterStore';
import { AnimatePresence } from 'framer-motion';

export default function ToastContainer() {
  const toasterStore = useToasterStore();
  return (
    <div
      className={
        'fixed bottom-5 right-10 z-40 flex h-full flex-col-reverse gap-4'
      }
    >
      <AnimatePresence initial={true} mode={'popLayout'}>
        {toasterStore.toasts.map((item) => item.content)}
      </AnimatePresence>
    </div>
  );
}
