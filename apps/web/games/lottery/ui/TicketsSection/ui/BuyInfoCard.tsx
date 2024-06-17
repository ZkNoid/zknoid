export default function BuyInfoCard({
  numberOfTickets,
  cost,
}: {
  numberOfTickets: number;
  cost: number;
}) {
  return (
    <div className="flex h-[13.53vw] w-[22vw] flex-col rounded-[0.67vw] bg-[#252525] p-[1.33vw] text-[1.07vw]">
      <div className="flex flex-row">
        <div className="text-nowrap">Number of tickets</div>
        <div className="mb-[0.3vw] w-full  border-spacing-6 border-b	 border-dotted border-[#F9F8F4]"></div>
        <div className="">{numberOfTickets}</div>
      </div>
      <div className="flex flex-row">
        <div className="text-nowrap">Cost</div>
        <div className="mb-[0.3vw] w-full  border-spacing-6 border-b	 border-dotted border-[#F9F8F4]"></div>
        <div className="">{cost}$</div>
      </div>

      <div className="mt-auto flex flex-row">
        <div className="text-nowrap">TOTAL AMOUNT</div>
        <div className="mb-[0.3vw] w-full  border-spacing-6 border-b	 border-dotted border-[#F9F8F4]"></div>
        <div className="">{cost}$</div>
      </div>
    </div>
  );
}
