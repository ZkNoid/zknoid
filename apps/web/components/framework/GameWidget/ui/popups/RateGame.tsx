import { useState } from 'react';
import { clsx } from 'clsx';
import { api } from '@/trpc/react';
import { useNetworkStore } from '@/lib/stores/network';
import { getEnvContext } from '@/lib/envContext';
import { useToasterStore } from '@/lib/stores/toasterStore';
import { useRateGameStore } from '@/lib/stores/rateGameStore';
import toast from '@/components/shared/Toast';

export const RateGame = ({
  gameId,
  onClick,
  isModal = false,
}: {
  gameId: string;
  onClick: () => void;
  isModal?: boolean;
}) => {
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const feedbackMutation = api.ratings.setGameFeedback.useMutation();
  const network = useNetworkStore();
  const progress = api.progress.setSolvedQuests.useMutation();
  const toasterStore = useToasterStore();
  const rateGameStore = useRateGameStore();

  const sendFeedback = () => {
    feedbackMutation.mutate({
      userAddress: network.address!,
      gameId,
      feedback,
      rating: stars,
    });

    progress.mutate({
      userAddress: network.address!,
      section: 'UI_TESTS_WEB',
      id: 0,
      txHash: '',
      envContext: getEnvContext(),
    });

    rateGameStore.addRatedGame(gameId);
  };
  return (
    <div className={'flex h-full w-full items-center justify-center px-[10%]'}>
      <div
        className={clsx(
          'relative max-w-[600px] rounded-2xl border-left-accent p-4',
          { 'border bg-[#252525]': !isModal }
        )}
      >
        <div
          className={
            'absolute right-5 top-5 h-[40px] w-[40px] cursor-pointer hover:opacity-80'
          }
          onClick={onClick}
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
            {[5, 4, 3, 2, 1].map((i) => (
              <svg
                key={i}
                width="40"
                height="37"
                viewBox="0 0 40 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={clsx(
                  'hover:fill-left-accent [&:hover~*]:fill-left-accent',
                  { 'fill-left-accent': stars > 0 && stars >= i }
                )}
                onClick={() => setStars(i)}
              >
                <path
                  d="M20 1.61804L24.0148 13.9742L24.127 14.3197H24.4903H37.4823L26.9715 21.9562L26.6776 22.1697L26.7899 22.5152L30.8046 34.8713L20.2939 27.2348L20 27.0213L19.7061 27.2348L9.19535 34.8713L13.2101 22.5152L13.3224 22.1697L13.0285 21.9562L2.51771 14.3197H15.5097H15.873L15.9852 13.9742L20 1.61804Z"
                  stroke="#D2FF00"
                />
              </svg>
            ))}
          </div>
          <div className={'rounded-[5px] border p-2'}>
            <textarea
              className={clsx(
                'min-h-[200px] w-full appearance-none font-plexsans text-[14px]/[14px] outline-none',
                {
                  'bg-[#252525]': !isModal,
                  'bg-bg-dark': isModal,
                }
              )}
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
              onClick={() => {
                sendFeedback();
                onClick();
                toast.success(toasterStore, 'Feedback successfully sent', true);
              }}
            >
              Send feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
