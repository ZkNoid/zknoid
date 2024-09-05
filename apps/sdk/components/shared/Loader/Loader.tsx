import { useEffect } from 'react';

export default function Loader({
  size,
  color,
  speed,
}: {
  size?: string | number;
  color?: string | number;
  speed?: string | number;
}) {
  useEffect(() => {
    async function getLoader() {
      const { tailspin } = await import('ldrs');
      tailspin.register();
    }
    getLoader();
  }, []);
  return <l-tailspin size={size} color={color} speed={speed}></l-tailspin>;
}