export const NetworkPicker = () => {
    return (
        <div className="flex flex-col items-center w-40 py-5 absolute bg-slate-300 text-xs gap-7 rounded-xl right-5 top-20">
                            {["Mainnet", "Devnet", "Berkley", "Testworld2"].map(network => (
                                <div className="cursor-pointer">{network}</div>
                                ))}

                            </div>
    )
}