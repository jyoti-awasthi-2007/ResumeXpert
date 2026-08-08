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
            default: ['#6C5CE7', '#00D4FF', '#0F172A'],
            auth: ['#6C5CE7', '#a29bfe', '#020617'],
            dashboard: ['#1E293B', '#6C5CE7', '#020617'],
            interview: ['#00D4FF', '#6C5CE7', '#020617'],
        }

        const palette = colors[variant] || colors.default

        function draw() {
            time += 0.003
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < 3; i++) {
                const x = canvas.width * (0.3 + 0.2 * Math.sin(time + i * 2))
                const y = canvas.height * (0.3 + 0.2 * Math.cos(time + i * 1.5))
                const radius = Math.min(canvas.width, canvas.height) * (0.3 + 0.1 * Math.sin(time * 0.5 + i))

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
                gradient.addColorStop(0, palette[i % palette.length] + '40')
                gradient.addColorStop(1, 'transparent')
                ctx.fillStyle = gradient
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            // Particles
            for (let i = 0; i < 30; i++) {
                const px = (canvas.width * ((i * 37 + time * 50) % canvas.width)) / canvas.width
                const py = (canvas.height * ((i * 53 + Math.sin(time + i) * 30) % canvas.height)) / canvas.height
                ctx.beginPath()
                ctx.arc(px * canvas.width, py * canvas.height, 1.5, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(108, 92, 231, 0.3)'
                ctx.fill()
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
        <div className="relative min-h-screen overflow-hidden">
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full"
                style={{ zIndex: 0 }}
            />
            <div className="fixed inset-0 bg-dark-900/60" style={{ zIndex: 1 }} />
            <div className="relative" style={{ zIndex: 2 }}>
                {children}
            </div>
        </div>
    )
}
