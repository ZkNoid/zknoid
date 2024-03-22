import { useState } from 'react';
import { clsx } from 'clsx';

export const RateGame = ({
  setIsVisible,
}: {
  setIsVisible: (isVisible: boolean) => void;
}) => {
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  return (
    <div className={'flex h-full w-full items-center justify-center px-[10%]'}>
      <div
        className={
          'relative max-w-[600px] rounded-2xl border border-left-accent bg-[#252525] p-4'
        }
      >
        <div
          className={
            'absolute right-5 top-5 h-[40px] w-[40px] cursor-pointer hover:opacity-80'
          }
          onClick={() => setIsVisible(false)}
        >
          <div
            className={
              'absolute bottom-0 left-0 right-0 top-0 m-auto h-[40px] w-1 -rotate-45 bg-left-accent'
            }
          />
          <div
            className={
              'absolute bottom-0 left-0 right-0 top-0 m-auto h-[40px] w-1 rotate-45 bg-left-accent'
            }
          />
        </div>
        <div className={'flex flex-col gap-4 p-8 text-center'}>
          <span className={'text-[20px]/[20px]'}>Please Rate the game!</span>
          <span className={'font-plexsans text-[14px]/[14px]'}>
            We hope you enjoyed playing! Please let us know your opinion about
            the game. Your feedback will help the developers to understand
            whether you enjoyed it or not and what changes should be made in the
            future.
          </span>
          <div
            className={
              'flex flex-row-reverse items-center justify-center gap-8 px-4'
            }
          >
            <svg
              width="40"
              height="37"
              viewBox="0 0 40 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx(
                'hover:fill-left-accent [&:hover~*]:fill-left-accent',
                { 'fill-left-accent': stars > 0 && stars === 5 }
              )}
              onClick={() => setStars(5)}
            >
              <path
                d="M20 1.61804L24.0148 13.9742L24.127 14.3197H24.4903H37.4823L26.9715 21.9562L26.6776 22.1697L26.7899 22.5152L30.8046 34.8713L20.2939 27.2348L20 27.0213L19.7061 27.2348L9.19535 34.8713L13.2101 22.5152L13.3224 22.1697L13.0285 21.9562L2.51771 14.3197H15.5097H15.873L15.9852 13.9742L20 1.61804Z"
                stroke="#D2FF00"
              />
            </svg>
            <svg
              width="40"
              height="37"
              viewBox="0 0 40 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx(
                'hover:fill-left-accent [&:hover~*]:fill-left-accent',
                { 'fill-left-accent': stars > 0 && stars >= 4 }
              )}
              onClick={() => setStars(4)}
            >
              <path
                d="M20 1.61804L24.0148 13.9742L24.127 14.3197H24.4903H37.4823L26.9715 21.9562L26.6776 22.1697L26.7899 22.5152L30.8046 34.8713L20.2939 27.2348L20 27.0213L19.7061 27.2348L9.19535 34.8713L13.2101 22.5152L13.3224 22.1697L13.0285 21.9562L2.51771 14.3197H15.5097H15.873L15.9852 13.9742L20 1.61804Z"
                stroke="#D2FF00"
              />
            </svg>
            <svg
              width="40"
              height="37"
              viewBox="0 0 40 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx(
                'hover:fill-left-accent [&:hover~*]:fill-left-accent',
                { 'fill-left-accent': stars > 0 && stars >= 3 }
              )}
              onClick={() => setStars(3)}
            >
              <path
                d="M20 1.61804L24.0148 13.9742L24.127 14.3197H24.4903H37.4823L26.9715 21.9562L26.6776 22.1697L26.7899 22.5152L30.8046 34.8713L20.2939 27.2348L20 27.0213L19.7061 27.2348L9.19535 34.8713L13.2101 22.5152L13.3224 22.1697L13.0285 21.9562L2.51771 14.3197H15.5097H15.873L15.9852 13.9742L20 1.61804Z"
                stroke="#D2FF00"
              />
            </svg>
            <svg
              width="40"
              height="37"
              viewBox="0 0 40 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx(
                'hover:fill-left-accent [&:hover~*]:fill-left-accent',
                { 'fill-left-accent': stars > 0 && stars >= 2 }
              )}
              onClick={() => setStars(2)}
            >
              <path
                d="M20 1.61804L24.0148 13.9742L24.127 14.3197H24.4903H37.4823L26.9715 21.9562L26.6776 22.1697L26.7899 22.5152L30.8046 34.8713L20.2939 27.2348L20 27.0213L19.7061 27.2348L9.19535 34.8713L13.2101 22.5152L13.3224 22.1697L13.0285 21.9562L2.51771 14.3197H15.5097H15.873L15.9852 13.9742L20 1.61804Z"
                stroke="#D2FF00"
              />
            </svg>
            <svg
              width="40"
              height="37"
              viewBox="0 0 40 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx(
                'hover:fill-left-accent [&:hover~*]:fill-left-accent',
                { 'fill-left-accent': stars > 0 && stars >= 1 }
              )}
              onClick={() => setStars(1)}
            >
              <path
                d="M20 1.61804L24.0148 13.9742L24.127 14.3197H24.4903H37.4823L26.9715 21.9562L26.6776 22.1697L26.7899 22.5152L30.8046 34.8713L20.2939 27.2348L20 27.0213L19.7061 27.2348L9.19535 34.8713L13.2101 22.5152L13.3224 22.1697L13.0285 21.9562L2.51771 14.3197H15.5097H15.873L15.9852 13.9742L20 1.61804Z"
                stroke="#D2FF00"
              />
            </svg>
          </div>
          <div className={'rounded-[5px] border p-2'}>
            <textarea
              className={'w-full appearance-none bg-[#252525] outline-none'}
              placeholder={'Enter you feedback here...'}
              onChange={(event) => setFeedback(event.target.value)}
            />
            <button
              className={clsx(
                'w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-buttons-menu font-medium text-dark-buttons-text disabled:opacity-60',
                {
                  'hover:border-left-accent hover:bg-bg-dark hover:text-left-accent':
                    feedback.length > 0,
                }
              )}
              disabled={feedback.length <= 0}
            >
              Send feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
