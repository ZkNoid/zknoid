import { useState } from "react";
import { useNetworkStore } from "@sdk/lib/stores/network";
import BaseModal from "@sdk/components/shared/Modal/BaseModal";
import Image from "next/image";
import { clsx } from "clsx";
import { api } from "@sdk/trpc/react";
import { useRateGameStore } from "@sdk/lib/stores/rateGameStore";
import { useNotificationStore } from "@sdk/components/shared/Notification/lib/notificationStore";

export default function RateGameModal({
  gameId,
  gameImage,
}: {
  gameId: string;
  gameImage: any;
}) {
  const networkStore = useNetworkStore();
  const rateGameStore = useRateGameStore();
  const notificationStore = useNotificationStore();
  const feedbackMutation = api.ratings.setGameFeedback.useMutation();

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const sendFeedback = () => {
    feedbackMutation.mutate({
      userAddress: networkStore.address!,
      gameId,
      feedback,
      rating: stars,
    });

    rateGameStore.addRatedGame(gameId);
    notificationStore.create({
      type: "success",
      message: "Feedback sent! Thank you!",
    });
  };

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} isDismissible={true}>
      <div className={"flex max-w-[25vw] flex-col"}>
        <Image
          src={gameImage}
          alt={"gameImage"}
          className={"mx-auto h-[15vw] w-auto object-contain object-center"}
        />
        <span
          className={
            "my-[1vw] text-center font-museo text-[1.4vw] font-semibold"
          }
        >
          Please rate this game!
        </span>
        <span
          className={"my-[1vw] text-justify font-museo text-[1vw] font-medium"}
        >
          We hope you enjoyed playing! Please let us know your opinion about the
          game. Your feedback will help the developers to understand whether you
          enjoyed it or not and what changes should be made in the future.
        </span>
        <div className={"flex flex-col gap-[1vw]"}>
          <div
            className={
              "flex flex-row-reverse items-center justify-center gap-[2.604vw]"
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
                  "hover:fill-left-accent [&:hover~*]:fill-left-accent",
                  { "fill-left-accent": stars > 0 && stars >= i },
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
          <textarea
            placeholder={"Write your feedback..."}
            onChange={(event) => setFeedback(event.target.value)}
            className={
              "h-full min-h-[5.208vw] w-full appearance-none rounded-[0.26vw] border border-foreground bg-bg-dark p-[0.521vw] font-museo text-[0.833vw] font-medium text-foreground outline-0 focus:border-right-accent"
            }
          />
          <button
            className={
              "w-full rounded-[0.26vw] bg-left-accent p-[0.5vw] text-center font-museo text-[0.833vw] font-medium text-bg-dark hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            }
            disabled={feedback.length === 0 || stars == 0}
            onClick={() => {
              sendFeedback();
              setIsOpen(false);
            }}
          >
            Send feedback
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
