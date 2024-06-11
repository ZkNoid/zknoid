import GradientButton from '@/components/shared/GradientButton';
import { HappySmileSVG } from '@/components/shared/misc/svg';

export const Win = ({
  onBtnClick,
  title,
  subTitle,
  btnText,
}: {
  onBtnClick: () => void;
  title: string;
  btnText: string;
  subTitle?: string;
}) => {
  return (
    <div
      className={
        'flex h-full w-full items-center justify-center px-[10%] py-[15%] lg:p-0'
      }
    >
      <div className={'flex flex-col items-center justify-center gap-4'}>
        <HappySmileSVG />
        <span className={'text-headline-1'}>{title}</span>
        <GradientButton
          title={btnText}
          onClick={onBtnClick}
          icon={
            <div
              className={
                'flex items-center justify-center rounded-[5px] bg-left-accent p-4 group-hover:bg-bg-dark'
              }
            >
              <svg
                width="28"
                height="24"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.18446 24C1.49366 24 1.79021 23.8772 2.00885 23.6585C2.22749 23.4399 2.35032 23.1433 2.35032 22.8341C2.35217 20.9795 3.08976 19.2013 4.40121 17.8898C5.71267 16.5784 7.49085 15.8408 9.34552 15.8389H16.1425V17.688C16.1426 18.1491 16.2794 18.5998 16.5357 18.9832C16.7919 19.3665 17.156 19.6653 17.582 19.8418C18.008 20.0182 18.4768 20.0644 18.929 19.9745C19.3813 19.8845 19.7967 19.6625 20.1228 19.3365L26.9769 12.4824C27.6326 11.8265 28.001 10.9371 28.001 10.0096C28.001 9.08218 27.6326 8.19272 26.9769 7.53682L20.1228 0.6827C19.7967 0.356702 19.3813 0.134707 18.929 0.0447774C18.4768 -0.0451517 18.008 0.00102331 17.582 0.177465C17.156 0.353908 16.7919 0.652694 16.5357 1.03605C16.2794 1.41941 16.1426 1.87013 16.1425 2.33123V4.1803H10.5114C7.72947 4.18338 5.06238 5.28986 3.09527 7.25697C1.12815 9.22408 0.0216753 11.8912 0.0185895 14.6731V22.8341C0.0185895 23.1433 0.141421 23.4399 0.360063 23.6585C0.578705 23.8772 0.875249 24 1.18446 24ZM18.4743 2.33123L25.3284 9.18535C25.547 9.40399 25.6697 9.70048 25.6697 10.0096C25.6697 10.3188 25.547 10.6153 25.3284 10.8339L18.4743 17.688V14.6731C18.4743 14.3639 18.3514 14.0673 18.1328 13.8487C17.9141 13.63 17.6176 13.5072 17.3084 13.5072H9.34552C8.02158 13.5068 6.71278 13.7889 5.5065 14.3345C4.30022 14.8801 3.22422 15.6768 2.35032 16.6714V14.6731C2.35279 12.5094 3.21341 10.435 4.74337 8.90507C6.27333 7.37511 8.3477 6.51449 10.5114 6.51203H17.3084C17.6176 6.51203 17.9141 6.38919 18.1328 6.17055C18.3514 5.95191 18.4743 5.65537 18.4743 5.34616V2.33123Z"
                  fill="#252525"
                  className={'group-hover:fill-left-accent'}
                />
              </svg>
            </div>
          }
        />
        {subTitle && (
          <div
            className={
              'w-[80%] text-center font-plexsans text-[14px]/[14px] font-normal text-foreground'
            }
          >
            {subTitle}
          </div>
        )}
      </div>
    </div>
  );
};
