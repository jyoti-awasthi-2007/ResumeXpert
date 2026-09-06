import { FileText, Brain, Upload, ArrowRight, Compass, Code2, Target, BarChart3, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import { useCareerLens } from '../context/CareerLensContext'

export default function Dashboard() {
    const { analyticsOverview, careerMatches, skillGap } = useCareerLens()
    const metrics = analyticsOverview.main || {}
    const readiness = metrics.career_readiness ?? metrics.career_readiness_score ?? 0
    const missingSkills = skillGap.missingSkills?.length || metrics.skill_gap_count || 0
    const priorityCount = skillGap.priorities?.find((group) => group.level?.toLowerCase() === 'high')?.skills?.length || 0
    const scoreCards = [
        { title: 'Resume Score', value: metrics.resume_score || 0, icon: FileText, color: 'mint' },
        { title: 'Skills Detected', value: metrics.skills_detected || 0, icon: Code2, color: 'blue', suffix: '' },
        { title: 'Career Matches', value: careerMatches?.filter((career) => career.score > 0).length || 0, icon: Target, color: 'orange', suffix: '' },
        { title: 'Assessment Score', value: metrics.assessment_score || 0, icon: BarChart3, color: 'purple' },
    ]
    const quickActions = [
        { label: 'Upload Resume', detail: 'Get started with AI analysis', icon: Upload, path: '/upload-resume', color: 'blue' },
        { label: 'Take Assessment', detail: 'Test your skills', icon: Brain, path: '/assessment', color: 'rose' },
        { label: 'View Recommendations', detail: 'Get personalized learning path', icon: Sparkles, path: '/recommendations', color: 'mint' },
        { label: 'Explore Careers', detail: 'Find your best fit', icon: Compass, path: '/career-suggestions', color: 'orange' },
    ]
    return (
        <PageTransition>
            <DashboardLayout title="Dashboard">
                <div className="dashboard-page">
                    <section className="dashboard-hero">
                        <div className="dashboard-hero-copy">
                            <p className="dashboard-eyebrow">👋 Welcome to <span>ResumeXpert</span></p>
                            <h2>Your <strong>Career Growth</strong> Partner</h2>
                            <p className="dashboard-hero-text">Upload your resume, analyze your skills, find the right career path<br className="hidden sm:block" /> and get AI-powered guidance to build a brighter future.</p>
                            <div className="flex flex-wrap gap-3"><Link to="/upload-resume" className="dashboard-primary-button"><Upload size={17} /> Upload Resume <ArrowRight size={16} /></Link><Link to="/resume-analysis" className="dashboard-secondary-button"><span className="dashboard-play">▶</span> See How It Works</Link></div>
                        </div>
                        <div className="dashboard-hero-art" aria-hidden="true"><div className="hero-document"><FileText size={62} /><CheckCircle2 className="hero-check" size={27} /></div><ArrowUpRight size={78} className="hero-arrow" /><span className="hero-tag hero-tag-grow">Grow</span><span className="hero-tag hero-tag-learn">Learn</span><span className="hero-star">✦</span></div>
                    </section>

                    <div className="dashboard-stat-grid">{scoreCards.map((card) => <div key={card.title} className="dashboard-stat-card"><div className={`dashboard-stat-icon ${card.color}`}><card.icon size={22} /></div><div className="min-w-0"><p>{card.title}</p><div className="flex items-baseline gap-2"><strong>{card.value}{card.suffix ?? '%'}</strong></div><div className="dashboard-stat-line"><i className={card.color} style={{ width: `${Math.min(card.value, 100)}%` }} /></div></div></div>)}</div>

                    <div className="dashboard-content-grid">
                        <section className="dashboard-panel readiness-panel"><h3>Your Career Readiness</h3><div className="readiness-content"><div className="readiness-ring" style={{ '--readiness': `${readiness * 3.6}deg` }}><div><strong>{readiness}%</strong><span>Good Preparation</span></div></div><div className="readiness-legend"><p><i className="legend-green" />Resume Analysis <b>{metrics.resume_score || 0}%</b></p><p><i className="legend-teal" />Skill Match <b>{metrics.career_match || 0}%</b></p><p><i className="legend-yellow" />Assessment <b>{metrics.assessment_score || 0}%</b></p><p><i className="legend-blue" />Confidence <b>{metrics.confidence_score || 0}%</b></p></div></div></section>
                        <section className="dashboard-panel careers-panel"><div className="dashboard-panel-heading"><h3>Top Career Matches</h3><Link to="/career-suggestions">View All <ArrowRight size={14} /></Link></div>{(careerMatches || []).filter((career) => career.score > 0).slice(0, 4).map((career, index) => <Link to={`/career/${career.id}`} className="career-match-row" key={career.id}><span className={`career-rank rank-${index + 1}`}>{index + 1}</span><strong>{career.title}</strong><span className="career-match-bar"><i style={{ width: `${career.score}%` }} /></span><b>{career.score}%</b></Link>)}{!(careerMatches || []).some((career) => career.score > 0) && <p className="text-sm text-secondary">Upload a resume to calculate your best career matches.</p>}</section>
                        <section className="dashboard-panel gap-panel"><h3>Skill Gap Overview</h3><div className="gap-ring" style={{ '--gap-angle': `${Math.min(missingSkills, 10) * 36}deg` }}><div><strong>{missingSkills}</strong><span>Missing Skills</span></div></div><div className="gap-legend"><p><i className="legend-red" />High Priority <b>{priorityCount}</b></p><p><i className="legend-yellow" />Medium Priority <b>{Math.max(missingSkills - priorityCount, 0)}</b></p><p><i className="legend-blue" />Low Priority <b>0</b></p></div></section>
                    </div>

                    <section className="dashboard-panel quick-panel"><div className="dashboard-panel-heading"><h3>Quick Actions</h3><span className="quick-note">Small Steps<br />Big Opportunities ↗</span></div><div className="quick-action-grid">{quickActions.map((action) => <Link to={action.path} className="quick-action" key={action.path}><span className={`quick-action-icon ${action.color}`}><action.icon size={21} /></span><span><strong>{action.label}</strong><small>{action.detail}</small></span></Link>)}</div></section>
                </div>
            </DashboardLayout>
        </PageTransition>
    )
}
