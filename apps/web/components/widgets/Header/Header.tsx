import MobileNavbar from '@/components/widgets/Header/MobileNavbar';
import DesktopNavbar from '@/components/widgets/Header/DesktopNavbar';

export default function Header() {
  return (
    <>
      <DesktopNavbar autoconnect={true} />
      <MobileNavbar autoconnect={true} />
    </>
  );
}
