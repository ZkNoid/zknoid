import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';

export default function Header() {
  return (
    <>
      <DesktopNavbar autoconnect={true} />
      <MobileNavbar autoconnect={true} />
    </>
  );
}
