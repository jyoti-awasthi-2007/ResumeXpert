import { useEffect, useRef } from 'react'

export default function GradientBackground({ variant = 'default', children }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animationId
        let time = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const colors = {
            default: ['#F5F5F7', '#FFFFFF', '#F7F7F8'],
            auth: ['#F5F5F7', '#FFFFFF', '#F9F9F9'],
            dashboard: ['#F5F5F7', '#FFFFFF', '#F8F8F9'],
        }

        const palette = colors[variant] || colors.default

        function draw() {
            time += 0.002
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < 3; i++) {
                const x = canvas.width * (0.3 + 0.2 * Math.sin(time + i * 2))
                const y = canvas.height * (0.3 + 0.1 * Math.cos(time + i * 1.5))
                const radius = Math.min(canvas.width, canvas.height) * (0.3 + 0.05 * Math.sin(time * 0.5 + i))

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
                gradient.addColorStop(0, palette[i % palette.length] + '80')
                gradient.addColorStop(1, 'transparent')
                ctx.fillStyle = gradient
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            animationId = requestAnimationFrame(draw)
        }
        draw()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
        }
    }, [variant])

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full"
                style={{ zIndex: 0 }}
            />
            <div className="fixed inset-0 bg-background/80" style={{ zIndex: 1 }} />
            <div className="relative" style={{ zIndex: 2 }}>
                {children}
            </div>
        </div>
    )
}
