'use client';

import { LEVELS } from '@/constants';
import { useEffect, useRef, useState } from 'react'

interface Ball {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
}

export default function Home() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [ctx, setContext] = useState<CanvasRenderingContext2D | null | undefined>(null);
    const [running, setRunning] = useState(false);
    const [animationId, setAnimationId] = useState(-1);
    const level = LEVELS[0];

    let ball: Ball;

    useEffect(() => {
        const ctx = canvas!.current?.getContext('2d');
        setContext(ctx);
        ball = {
            x: canvas.current!.width / 2,
            y: canvas.current!.height / 2,
            dx: 4,
            dy: -4,
            radius: 5
          };
    }, [canvas]);

    const gameLoop = () => {
        setRunning(true);

        ctx!.clearRect(0, 0, canvas.current!.width, canvas.current!.height);

        moveBall();
        drawBall();
        setAnimationId(requestAnimationFrame(gameLoop));
    }

    const moveBall = () => {
        ball.x += ball.dx;
        ball.y += ball.dy;
    }

    const drawBall = () => {
        ctx!.beginPath();
        ctx!.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx!.fillStyle = 'black';
        ctx!.fill();
        ctx!.closePath();
    }

    const startGame = () => {
        ball = {
            x: canvas!.current!.width / 2,
            y: canvas!.current!.height / 2,
            dx: 4,
            dy: -4,
            radius: 5
        };
        setRunning(true);
        gameLoop();
    }


    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <div className='p-5 bg-slate-300 rounded-xl' onClick={() => startGame()}>Start</div>
            <canvas id="canvas" width="800" height="600" ref={canvas}>
            </canvas>
        </main>
    )
}
