export default function BuyInfoCard({
  numberOfTickets,
  cost,
}: {
  numberOfTickets: number;
  cost: number;
}) {
  return (
    <div className="h-[13.53vw] w-[22vw] rounded-[0.67vw] bg-[#252525] p-[1.33vw] text-[1.07vw] flex flex-col">
      <div className="flex flex-row">
        <div className="text-nowrap">Number of tickets</div>
        <div className="w-full border-b  border-dotted border-spacing-6	 mb-[0.3vw] border-[#F9F8F4]"></div>
        <div className="">{numberOfTickets}</div>
      </div>
      <div className="flex flex-row">
        <div className="text-nowrap">Cost</div>
        <div className="w-full border-b  border-dotted border-spacing-6	 mb-[0.3vw] border-[#F9F8F4]"></div>
        <div className="">{cost}$</div>
      </div>

      <div className="flex flex-row mt-auto">
        <div className="text-nowrap">TOTAL AMOUNT</div>
        <div className="w-full border-b  border-dotted border-spacing-6	 mb-[0.3vw] border-[#F9F8F4]"></div>
        <div className="">{cost}$</div>
      </div>
    </div>
  );
}