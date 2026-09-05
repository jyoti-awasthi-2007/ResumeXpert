import logo from '../assets/image.png'

export default function BrandLockup({ compact = false }) {
    return (
        <div className={`flex items-center ${compact ? 'gap-2' : 'gap-2.5'}`}>
            <img
                src={logo}
                alt=""
                className={`${compact ? 'w-9 h-9' : 'w-11 h-11'} object-contain shrink-0`}
            />
            <span className={`${compact ? 'text-lg' : 'text-xl'} font-display font-bold tracking-tight text-primary whitespace-nowrap`}>
                Resume<span className="gradient-text">Xpert</span>
            </span>
        </div>
    )
}