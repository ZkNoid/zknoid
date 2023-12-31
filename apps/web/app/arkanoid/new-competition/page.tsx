'use client'

import { useEffect, useRef, useState } from "react"

export default function NewCompetitionPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [seed, setSeed] = useState(0);
    const canvas = useRef<HTMLCanvasElement>(null);
    const [ctx, setContext] = useState<
        CanvasRenderingContext2D | null | undefined
    >(null);
    const [preregistrationEnabled, setPreregistrationEnabled] = useState(true);
    const [preregistrationFrom, setPreregistrationFrom] = useState('');
    const [preregistrationTo, setPreregistrationTo] = useState('');

    const [competitionFrom, setCompetitionFrom] = useState('');
    const [competitionTo, setCompetitionTo] = useState('');
    const [funding, setFunding] = useState(0);
    const [participationFee, setPerticipationFee] = useState(0);

    useEffect(() => {
        const ctx = canvas!.current?.getContext('2d');
        ctx?.rect(0, 0, 300, 300);
        ctx!.fillStyle = 'white';
        ctx?.fill()
        setContext(ctx);
    }, [canvas]);

    const onSubmit = () => {

    }

    return (
        <div className="flex flex-col justify-center items-center py-10 gap-5">
            <div className="py-3">Create competition</div>
            <div className="flex flex-col items-center">
                <a>Name</a>
                <input className="w-50" value={name} onChange={e => setName(e.target.value)}></input>
            </div>
            <div className="flex flex-col items-center">
                <a>Description</a>
                <textarea className="w-50" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <div className="flex flex-col items-center">
                <a>Map seed</a>
                <a className="text-xs">(do not share until competition started)</a>
                <input className="w-20" type="number" value={seed} onChange={e => setSeed(parseInt(e.target.value))}></input>
                <canvas style={{ width: 300, height: 300 }} className="py-5" ref={canvas}></canvas>
            </div>
            <div className="flex flex-col items-center">
                <a>Competition preregistration</a>
                <input
                    type="checkbox"
                    checked={preregistrationEnabled}
                    onChange={e => setPreregistrationEnabled(e.target.checked)}>
                </input>
            </div>
            {
                preregistrationEnabled && (
                    <div className="flex flex-col items-center">
                        <a>Competition preregistration</a>
                        <div className="flex gap-5">
                            <input
                                type="date"
                                value={preregistrationFrom}
                                onChange={e => setPreregistrationFrom(e.target.value)}>
                            </input> -
                            <input
                                type="date"
                                value={preregistrationTo}
                                onChange={e => setPreregistrationTo(e.target.value)}>
                            </input>
                        </div>
                    </div>
                )
            }
            <div className="flex flex-col items-center">
                <a>Competition dates</a>
                <div className="flex gap-5">
                    <input
                        type="date"
                        value={competitionFrom}
                        onChange={e => setCompetitionFrom(e.target.value)}>
                    </input> -
                    <input
                        type="date"
                        value={competitionTo}
                        onChange={e => setCompetitionTo(e.target.value)}>
                    </input>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <a>Funding</a>
                <div className="flex">
                    <input className="w-20" type="number" value={funding} onChange={e => setFunding(parseInt(e.target.value))}></input> 🪙
                </div>
            </div>
            <div className="flex flex-col items-center">
                <a>Participation fee</a>
                <div className="flex">
                    <input className="w-20" type="number" value={participationFee} onChange={e => setPerticipationFee(parseInt(e.target.value))}></input> 🪙
                </div>
            </div>

            <div className="py-3 cursor-pointer" onClick={() => onSubmit()}>[Create]</div>
        </div>
    )
}