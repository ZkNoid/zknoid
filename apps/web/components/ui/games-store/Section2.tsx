import { IGame } from "@/app/constants/games"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ALL_GAME_EVENT_TYPES, GAME_EVENTS, ZkNoidEvent, ZkNoidEventType, getEventType, useEventTimer } from "@/lib/platform/game_events"
import { ALL_GAME_FEATURES, ALL_GAME_GENRES, ALL_GAME_TAGS, ZkNoidGameFeature, ZkNoidGameGenre } from "@/lib/platform/game_tags"

const FilterCard = ({ eventType, selected, typesSelected, setTypesSelected }: {
    eventType: ZkNoidEventType,
    typesSelected: ZkNoidEventType[],
    setTypesSelected: (types: ZkNoidEventType[]) => void,
    selected?: boolean
}) => (
    <div
        onClick={
            () => setTypesSelected(typesSelected.includes(eventType) ?
                typesSelected.filter(x => x != eventType) :
                [...typesSelected, eventType])}
        className={`p-1 rounded text-[16px] cursor-pointer border ${selected ? 'bg-left-accent text-bg-dark border-left-accent' : 'border-[#F9F8F4]'}`}
    >
        {eventType}
    </div>
)

const EventCard = ({ headText, description, event }: { headText: string, description: string, event: ZkNoidEvent }) => {
    const eventCounter = useEventTimer(event);
    const time = `${eventCounter.startsIn.days}d ${eventCounter.startsIn.hours}h:${eventCounter.startsIn.minutes}m:${Math.trunc(eventCounter.startsIn.seconds!)}s`
    return (
        <div className="border-left-accent flex flex-col relative">
            <img src="/image/section2/event-box.svg" className="-z-10"></img>
            <div className="absolute flex flex-col top-0 left-0 w-full h-full p-5">
                <div className="text-[24px] font-bold">{headText}</div>
                <div className="text-[16px] text-plexmono max-w-[462px]">
                    {description}
                </div>
                <div className="flex-grow"></div>
                <div className="text-plexmono max-w-[462px] text-[30px]">
                    {eventCounter.type == ZkNoidEventType.UPCOMING_EVENTS && <>START IN {time}</>}
                    {eventCounter.type == ZkNoidEventType.CURRENT_EVENTS && <>END IN {time}</>}
                </div>
            </div>
        </div>
    )
}

function FiltrationBox<T extends string>(
    { expanded, title, items, itemsSelected, setItemsSelected }:
        { 
            expanded: boolean, 
            title: string, 
            items: T[], 
            itemsSelected: T[], 
            setItemsSelected: (genres: T[]) => void 
        }
) {
    return (
        <div className="relative p-5 w-full min-h-[80px]">
            <div className="font-bold text-[24px]">
                {title}
            </div>
            {items.map(item => (
                <div
                    key={item}
                    className={`text-plexmono font-[20] cursor-pointer hover:underline ${itemsSelected.includes(item) ? 'underline' : ''} decoration-left-accent underline-offset-[5px]`}
                    onClick={() => {
                        setItemsSelected(itemsSelected.includes(item) ?
                        itemsSelected.filter(x => x != item) :
                        [...itemsSelected, item])
                    }}
                >
                    {item}
                </div>
            ))}

            <div className="absolute -z-10 top-0 left-0 w-full h-full flex flex-col">
                <svg viewBox="0 0 351 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 17.5234V111.731V174.523C1 182.808 7.71573 189.523 16 189.523H335C343.284 189.523 350 182.808 350 174.523V58.1101C350 54.1286 348.417 50.3105 345.6 47.4969L304.963 6.91027C302.151 4.10124 298.338 2.52344 294.363 2.52344H16C7.71573 2.52344 1 9.23917 1 17.5234Z" stroke="#D2FF00" stroke-width="2" />
                    <path d="M348 2.52344H312.912C311.118 2.52344 310.231 4.7018 311.515 5.95459L346.603 40.2072C347.87 41.4438 350 40.5463 350 38.7761V4.52344C350 3.41887 349.105 2.52344 348 2.52344Z" fill={expanded ? "#D2FF00" : ""} stroke="#D2FF00" stroke-width="2" />
                    <rect x="331.775" y="6.89062" width="20" height="2" transform="rotate(45 331.775 6.89062)" fill={expanded ? "#252525" : "#D2FF00"} />
                    <rect x="345.924" y="8.30469" width="20" height="2" transform="rotate(135 345.924 8.30469)" fill={expanded ? "#252525" : "#D2FF00"} />
                </svg>
                <div className="flex flex-grow w-full border-x-2 border-b-2 rounded-b-2xl border-left-accent"></div>
            </div>

        </div>
    )
};

const GenreCard = ({ image, genre, genresSelected, setGenresSelected }:
    { image: string, genre: ZkNoidGameGenre, genresSelected: ZkNoidGameGenre[], setGenresSelected: (genres: ZkNoidGameGenre[]) => void }) => (

    <div className="w-full h-full flex items-center justify-center relative flex-col p-5" onClick={() => {
        setGenresSelected(genresSelected.includes(genre) ?
            genresSelected.filter(x => x != genre) :
            [...genresSelected, genre])
    }
    }>
        <div className="w-full h-[60%] bottom-0 left-0 absolute -z-10 bg-[#252525] rounded z-1"></div>
        <img src={image} className="w-[80%] h-full z-0"></img>
        <div className="z-0 text-[24px]">{genre}</div>
    </div>
)

export const Section2 = ({ games }: { games: IGame[] }) => {
    const [eventTypesSelected, setEventTypesSelected] = useState<ZkNoidEventType[]>([]);
    const [genresSelected, setGenresSelected] = useState<ZkNoidGameGenre[]>([]);
    const [featuresSelected, setFeaturesSelected] = useState<ZkNoidGameFeature[]>([]);

    return (
        <div className='relative flex flex-col'>
            <div className="top-0 left-0 w-full h-full absolute -z-10 flex flex-col">
                <svg viewBox="0 0 1502 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M1451 2341H51C23.3858 2341 1 2318.37 1 2290.75V107V51C1 23.3857 23.3858 1 51 1H650.474C663.726 1 676.436 6.26099 685.812 15.627L723.596 53.373C732.971 62.739 745.681 68 758.933 68H1451C1478.61 68 1501 90.3857 1501 118V182V2291C1501 2318.61 1478.61 2341 1451 2341Z" stroke="#D2FF00" stroke-width="2" />
                </svg>
                <div className="border-x-2 border-left-accent flex-grow" />
                <svg viewBox="0 2142 1502 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M1451 2341H51C23.3858 2341 1 2318.37 1 2290.75V107V51C1 23.3857 23.3858 1 51 1H650.474C663.726 1 676.436 6.26099 685.812 15.627L723.596 53.373C732.971 62.739 745.681 68 758.933 68H1451C1478.61 68 1501 90.3857 1501 118V182V2291C1501 2318.61 1478.61 2341 1451 2341Z" stroke="#D2FF00" stroke-width="2" />
                </svg>
            </div>

            <div className="top-0 w-full h-full p-10 gap-5 flex flex-col">
                <div className="flex flex-col gap-3">
                    <div className="text-[32px]">
                        Events & competitions
                    </div>
                    <div className="flex flex-row gap-3">
                        {ALL_GAME_EVENT_TYPES
                            .map(eventType => (
                                <FilterCard
                                    key={eventType}
                                    eventType={eventType}
                                    typesSelected={eventTypesSelected}
                                    setTypesSelected={setEventTypesSelected}
                                    selected={eventTypesSelected.includes(eventType)}
                                />
                            ))}
                    </div>
                    <div className="grid grid-cols-2 gap-5 min-h-[352px]">
                        {GAME_EVENTS
                            .filter(x => eventTypesSelected.includes(getEventType(x)) || eventTypesSelected.length == 0)
                            .map(event => (
                                <EventCard
                                    key={event.name}
                                    headText={event.name}
                                    description={event.description}
                                    event={event}
                                />
                            ))}
                    </div>
                </div>

                <div>
                    <div className="text-[32px]">
                        Popular genres
                    </div>
                    <div className="grid grid-cols-4 gap-5">
                        <GenreCard
                            image="/image/genres/arcade.svg"
                            genre={ZkNoidGameGenre.Arcade}
                            genresSelected={genresSelected}
                            setGenresSelected={setGenresSelected}
                        />
                        <GenreCard
                            image="/image/genres/board.svg"
                            genre={ZkNoidGameGenre.BoardGames}
                            genresSelected={genresSelected}
                            setGenresSelected={setGenresSelected}
                        />
                        <GenreCard
                            image="/image/genres/lucky.svg"
                            genre={ZkNoidGameGenre.Lucky}
                            genresSelected={genresSelected}
                            setGenresSelected={setGenresSelected}
                        />
                        <GenreCard
                            image="/image/genres/soon.svg"
                            genre={ZkNoidGameGenre.ComingSoon}
                            genresSelected={genresSelected}
                            setGenresSelected={setGenresSelected}
                        />
                    </div>
                </div>
                <div className="flex gap-5">
                    <div className="min-w-[350px]">
                        <div className="text-[24px] font-bold">Filtration</div>
                        <div className="flex flex-col gap-3">
                            <FiltrationBox 
                                key={0}
                                expanded={true} 
                                title="Genre" 
                                items={ALL_GAME_GENRES}
                                itemsSelected={genresSelected}
                                setItemsSelected={setGenresSelected}
                            />
                            <FiltrationBox 
                                key={1}
                                expanded={false} 
                                title="Features" 
                                items={ALL_GAME_FEATURES}
                                itemsSelected={featuresSelected}
                                setItemsSelected={setFeaturesSelected}    
                            />
                            <div 
                                className="border-2 rounded-2xl border-left-accent h-[40px] flex items-center justify-center text-[24px] text-left-accent cursor-pointer"
                                onClick={() => {
                                    setGenresSelected([]);
                                    setFeaturesSelected([]);
                                    setEventTypesSelected([]);
                                }}
                            >
                                Reset filters
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-[32px] font-bold">Games</div>
                        <div className="flex flex-row gap-3">
                            {
                                ALL_GAME_TAGS.map(
                                    x => <div 
                                        className={`p-1 border rounded cursor-pointer ${(genresSelected == x.genres && featuresSelected == x.features) ? 'bg-left-accent text-bg-dark border-left-accent' : 'border-[#F9F8F4]'}`}
                                        onClick={() => {
                                            setGenresSelected(x.genres);
                                            setFeaturesSelected(x.features);
                                        }}
                                    >
                                        {x.name}
                                    </div>
                                )
                            }
                        </div>
                        <div>
                            <div className="grid grid-cols-3 gap-5">
                                {games
                                    .filter(x => genresSelected.includes(x.genre) || genresSelected.length == 0)
                                    .map((game) =>
                                        <div
                                            className="rounded-xl bg-[#252525] min-h-[500px]"
                                            key={game.id}
                                        >
                                            <Link
                                                className="m-5 flex h-full flex-col gap-5"
                                                href={`/games/${game.id}/${game.defaultPage}`}
                                            >
                                                <Image
                                                    src={game.logo}
                                                    alt="Game logo"
                                                    width={220}
                                                    height={251}
                                                    className="w-full"
                                                />
                                                <div className="text-[24px]">{game.name}</div>
                                                <div className="text-[16px] font-plexmono font-[16]">{game.description}</div>
                                            </Link>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}