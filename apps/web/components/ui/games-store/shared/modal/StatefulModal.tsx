import { ReactNode, useState } from 'react';
import BaseModal from './BaseModal';

export default function StatefulModal({
  children,
  isOpen = false,
  isDismissible = true,
  cross = true,
  border,
}: {
  children: ReactNode;
  isOpen: boolean;
  isDismissible?: boolean;
  cross?: boolean;
  border?: string;
}) {
  const [isOpenInternal, setIsOpenInternal] = useState<boolean>(isOpen);

  return (
    <BaseModal
      isOpen={isOpenInternal}
      setIsOpen={setIsOpenInternal}
      border={border}
      isDismissible={isDismissible}
      cross={cross}
    >
      {children}
    </BaseModal>
  );
}
