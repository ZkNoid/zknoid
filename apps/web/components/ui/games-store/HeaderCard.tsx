export const HeaderCard = ({ image, text, toggle, onClick }: { image: string, text: string, toggle?: boolean, onClick?: () => void }) => (
    <div
        className="flex bg-left-accent items-center gap-[10px] text-bg-dark p-1 px-2 text-[16px] rounded cursor-pointer"
        onClick={() => onClick?.()}
    >
        <img src={image} width={24} height={24} />
        {text}
        {toggle && (
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 1.5L8 8.5L1 1.5" stroke="#252525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        )}
    </div>
)