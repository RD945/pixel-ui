import { Route, Routes, useNavigate, useLocation, Link, useParams } from 'react-router-dom'
import { Button, Card, Input, TabBar, Badge, Chip, Switch, SegmentedControl } from './components/ui'
import { Home, CalendarDays, Users, UserRound, Search, Menu, MapPin, Clock, Share2, Ticket, X, ChevronLeft, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import euphoriaImg from './assets/uphoria.png'
import hackaccinoImg from './assets/hackaccino.png'
import profileImg from './assets/profile.png'
import splashImg from './assets/load.png'
import { useEffect, useMemo, useState } from 'react'

type EventItem = {
  id: string
  slug: string
  title: string
  clubName: string
  isoDate: string
  type: 'Hackathon' | 'Workshop' | 'Talk' | 'Competition'
  imageSrc?: string
  description: string
}

const events: EventItem[] = [
  {
    id: 'uphoria',
    slug: 'uphoria',
    title: 'Uphoria',
    clubName: 'Google Developers Club',
    isoDate: '2025-03-26',
    type: 'Hackathon',
    imageSrc: euphoriaImg,
    description: 'A student hackathon to build, learn, and collaborate across disciplines.',
  },
  {
    id: 'hackaccino',
    slug: 'hackaccino',
    title: 'Hackaccino',
    clubName: 'CSI',
    isoDate: '2025-03-29',
    type: 'Hackathon',
    imageSrc: hackaccinoImg,
    description: 'Caffeine-fueled code sprint with workshops and prizes for innovative ideas.',
  },
  {
    id: 'web-workshop',
    slug: 'web-workshop',
    title: 'Modern Web Workshop',
    clubName: 'Web Dev Club',
    isoDate: '2025-04-05',
    type: 'Workshop',
    imageSrc: 'https://images.unsplash.com/photo-1522071901873-411886a10004?auto=format&fit=crop&w=1200&q=60',
    description: 'Hands-on session covering React, Tailwind CSS, and deployment.',
  },
  {
    id: 'ai-talk',
    slug: 'ai-talk',
    title: 'AI for Everyone',
    clubName: 'ML Club',
    isoDate: '2025-04-12',
    type: 'Talk',
    imageSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=60',
    description: 'Introductory talk on AI concepts, use-cases, and ethical implications.',
  },
  {
    id: 'design-sprint',
    slug: 'design-sprint',
    title: 'Design Sprint',
    clubName: 'Design Guild',
    isoDate: '2025-04-18',
    type: 'Competition',
    imageSrc: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=60',
    description: 'Rapid ideation and prototyping challenge with peer critique.',
  },
  {
    id: 'cloud-bootcamp',
    slug: 'cloud-bootcamp',
    title: 'Cloud Bootcamp',
    clubName: 'Cloud Native',
    isoDate: '2025-04-22',
    type: 'Workshop',
    imageSrc: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=60',
    description: 'Learn the basics of containers, Kubernetes, and cloud deployments.',
  },
  {
    id: 'robotics-arena',
    slug: 'robotics-arena',
    title: 'Robotics Arena',
    clubName: 'Robotics Society',
    isoDate: '2025-05-03',
    type: 'Competition',
    imageSrc: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60',
    description: 'Team up to build and battle autonomous bots in the arena.',
  },
  {
    id: 'open-source-day',
    slug: 'open-source-day',
    title: 'Open Source Day',
    clubName: 'OSS Hub',
    isoDate: '2025-05-10',
    type: 'Workshop',
    imageSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60',
    description: 'Contribute to real projects, get mentored, and learn Git workflows.',
  },
]

const clubs = [
  { name: 'GDC', slug: 'gdc', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=60', tags: ['Tech','Cloud'], members: 1820, desc: 'Google Developers community at campus.' },
  { name: 'CSI', slug: 'csi', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=60', tags: ['Tech'], members: 980, desc: 'Computer Society activities and hackathons.' },
  { name: 'IEEE', slug: 'ieee', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=300&q=60', tags: ['AI','Robotics'], members: 1320, desc: 'Engineering excellence, talks and workshops.' },
  { name: 'Fullstack', slug: 'fullstack', img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=300&q=60', tags: ['Tech','Web'], members: 760, desc: 'Web to backend, build full products.' },
  { name: 'Mobile', slug: 'mobile', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=60', tags: ['Tech','Mobile'], members: 540, desc: 'Android, iOS and cross‑platform dev.' },
  { name: 'Design', slug: 'design', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=60', tags: ['Design'], members: 610, desc: 'UI/UX, visual and product design.' },
]

function formatBadgeDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatLongDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
}

function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}

function getNext7Days(): Array<{ iso: string; label: string }> {
  const out: Array<{ iso: string; label: string }> = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })
    out.push({ iso, label })
  }
  return out
}

function Shell({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    const last = Number(localStorage.getItem('splashLast') || '0')
    const now = Date.now()
    return now - last >= 60_000
  })
  useEffect(() => {
    if (!showSplash) return
    localStorage.setItem('splashLast', String(Date.now()))
    const id = setTimeout(() => setShowSplash(false), 2000)
    return () => clearTimeout(id)
  }, [showSplash])
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[480px] flex-col bg-soft">
      {showSplash && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black">
          <img src={splashImg} alt="Loading" className="max-h-[40vh] max-w-[80%] object-contain" />
        </div>
      )}
      <Header />
      <main className="flex-1 overflow-y-auto px-4 pb-24">{children}</main>
      <TabBar
        items={[
          { to: '/', label: 'Home', icon: <Home size={14} /> },
          { to: '/events', label: 'Events', icon: <CalendarDays size={14} /> },
          { to: '/clubs', label: 'Clubs', icon: <Users size={14} /> },
          { to: '/profile', label: 'Profile', icon: <UserRound size={14} /> },
        ]}
      />
    </div>
  )
}

function Header() {
  const location = useLocation()
  const showAvatar = location.pathname !== '/profile'
  return (
    <header className="px-4 pt-6 pb-2">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-4xl ml-2">Pixel</h1>
        {showAvatar ? (
          <Link to="/profile" aria-label="Profile">
            <img src={profileImg} alt="Profile" className="h-14 w-14 rounded-full object-cover" />
          </Link>
        ) : null}
      </div>
    </header>
  )
}

function HomeScreen() {
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')
  const navigate = useNavigate()
  const cards = useMemo(() => {
    const list = events.slice(0, 6)
    return list.sort((a, b) => (sort === 'asc' ? a.isoDate.localeCompare(b.isoDate) : b.isoDate.localeCompare(a.isoDate)))
  }, [sort])
  const [showAnn, setShowAnn] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>('')
  return (
    <Shell>
      {showAnn && (
        <div className="mb-3 rounded-2xl border bg-white p-3 text-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium">Hackathon registrations close Friday</div>
              <div className="text-xs text-gray-600">Don’t miss the deadline. Submit your team details before 6 PM.</div>
            </div>
            <button className="rounded-full border px-2 py-1 text-xs" onClick={()=>setShowAnn(false)}>Dismiss</button>
          </div>
        </div>
      )}
      <div className="no-scrollbar -mx-4 mb-3 flex gap-3 overflow-x-auto px-4">
        {[
          { label: 'GDC', src: euphoriaImg },
          { label: 'CSI', src: hackaccinoImg },
          { label: 'IEEE', src: euphoriaImg },
          { label: 'ML', src: hackaccinoImg },
          { label: 'Web', src: euphoriaImg },
          { label: 'DSA', src: hackaccinoImg },
          { label: 'AI', src: euphoriaImg },
          { label: 'Design', src: hackaccinoImg },
          { label: 'Robotics', src: euphoriaImg },
          { label: 'Cloud', src: hackaccinoImg },
        ].map((s, i) => (
          <div key={i} className="flex w-16 shrink-0 flex-col items-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-tr from-brand-400 to-pink-400 p-[2px]">
              <img src={s.src} className="h-full w-full rounded-full object-cover" />
            </div>
            <div className="mt-1 truncate text-center text-[11px] text-gray-600" title={s.label}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900 p-5 text-white shadow-glass">
        <div className="pointer-events-none absolute -top-10 -right-12 h-44 w-44 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_400px_at_-10%_-20%,rgba(255,255,255,.06),transparent),radial-gradient(600px_200px_at_120%_120%,rgba(255,255,255,.04),transparent)]" />

        <div className="relative">
			<h2 className="text-2xl font-semibold">Discover Amazing Events</h2>
			<p className="mt-2 text-sm text-white/70">Connect with your community and join exciting hackathons, workshops, and networking events.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-2 py-1 backdrop-blur">Hackathons</span>
            <span className="rounded-full bg-white/10 px-2 py-1 backdrop-blur">Workshops</span>
            <span className="rounded-full bg-white/10 px-2 py-1 backdrop-blur">Talks</span>
            <span className="rounded-full bg-white/10 px-2 py-1 backdrop-blur">Clubs</span>
          </div>
          <Link to="/events" className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-black">Explore Events</Link>
        </div>
      </div>

      <div className="mb-4 mt-4 flex items-center gap-2 rounded-2xl border bg-white px-4 py-3.5">
        <Menu size={20} className="text-gray-600" />
        <Input className="flex-1 border-0 p-0 text-[16px] focus:outline-none focus:ring-0" placeholder="Search events, clubs..." />
        <Search size={20} className="text-gray-600" />
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Your Events</h2>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Sort:</span>
            <button className={`rounded-full border px-2 py-1 ${sort === 'asc' ? 'bg-gray-100' : ''}`} onClick={() => setSort('asc')}>Oldest</button>
            <button className={`rounded-full border px-2 py-1 ${sort === 'desc' ? 'bg-gray-100' : ''}`} onClick={() => setSort('desc')}>Newest</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {cards.map((c) => (
            <Link key={c.id} to={`/events/${c.slug}`} className="block">
            <Card className="overflow-hidden">
              <div
                className="relative h-24 w-full bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: c.imageSrc ? `url(${c.imageSrc})` : undefined }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute left-2 top-2 flex items-center gap-2">
                  <Badge>{formatBadgeDate(c.isoDate)}</Badge>
                  <Badge className="bg-brand-600 text-white">{c.type}</Badge>
                </div>
              </div>
              <div className="space-y-1.5 p-3">
                <div className="text-sm font-medium">{c.title}</div>
                <div className="text-[10px] text-gray-500">{formatLongDate(c.isoDate)}</div>
                <div className="text-[10px] text-gray-500">{c.clubName}</div>
              </div>
            </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* More sections */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Recommended for you</h2>
          <Link to="/events" className="text-sm text-blue-600">See all</Link>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
          {events.slice(0,5).map((ev) => (
            <Link key={ev.id} to={`/events/${ev.slug}`} className="block w-48 shrink-0">
              <Card className="overflow-hidden">
                <div className="h-28 w-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: ev.imageSrc ? `url(${ev.imageSrc})` : undefined }} />
                <div className="space-y-1.5 p-2">
                  <div className="truncate text-sm font-medium">{ev.title}</div>
                  <div className="text-[10px] text-gray-500">{formatBadgeDate(ev.isoDate)} · {ev.type}</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">Top Clubs</h2>
        <div className="flex flex-wrap gap-2">
          {clubs.slice(0,6).map((c) => (
            <Link key={c.slug} to={`/clubs/${c.slug}`}>
              <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm">
                <img loading="lazy" src={c.img} className="h-6 w-6 rounded-full object-cover" />
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Discover Workshops</h2>
          <Link to="/events" className="text-sm text-blue-600">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {events.filter((e)=> e.type==='Workshop').slice(0,4).map((ev)=> (
            <Link key={ev.id} to={`/events/${ev.slug}`} className="block">
              <Card className="overflow-hidden">
                <div className="h-24 w-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: ev.imageSrc ? `url(${ev.imageSrc})` : undefined }} />
                <div className="space-y-1.5 p-2">
                  <div className="truncate text-sm font-medium">{ev.title}</div>
                  <div className="text-[10px] text-gray-500">{ev.clubName}</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Latest Talks</h2>
          <Link to="/events" className="text-sm text-blue-600">See all</Link>
        </div>
        <div className="space-y-2">
          {events.filter((e)=> e.type==='Talk').slice(0,3).map((ev)=> (
            <Link key={ev.id} to={`/events/${ev.slug}`} className="flex items-center gap-3 rounded-2xl border bg-white p-2">
              <div className="h-14 w-20 rounded-lg bg-cover bg-center" style={{ backgroundImage: ev.imageSrc ? `url(${ev.imageSrc})` : undefined }} />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{ev.title}</div>
                <div className="text-[10px] text-gray-500">{formatLongDate(ev.isoDate)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Upcoming Hackathons</h2>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Sort:</span>
            <button className={`rounded-full border px-2 py-1 ${sort === 'asc' ? 'bg-gray-100' : ''}`} onClick={() => setSort('asc')}>Oldest</button>
            <button className={`rounded-full border px-2 py-1 ${sort === 'desc' ? 'bg-gray-100' : ''}`} onClick={() => setSort('desc')}>Newest</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {cards.map((c) => (
            <Link key={c.id} to={`/events/${c.slug}`} className="block">
            <Card className="overflow-hidden">
              <div
                className="relative h-24 w-full bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: c.imageSrc ? `url(${c.imageSrc})` : undefined }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute left-2 top-2 flex items-center gap-2">
                  <Badge>{formatBadgeDate(c.isoDate)}</Badge>
                  <Badge className="bg-brand-600 text-white">{c.type}</Badge>
                </div>
              </div>
              <div className="space-y-1.5 p-3">
                <div className="text-sm font-medium">{c.title}</div>
                <div className="text-[10px] text-gray-500">{formatLongDate(c.isoDate)}</div>
                <div className="text-[10px] text-gray-500">{c.clubName}</div>
              </div>
            </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 text-sm text-gray-600">This week</div>
        <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
          {getNext7Days().map((d)=> (
            <button key={d.iso} onClick={()=>setSelectedDay(d.iso)} className={`rounded-xl border px-3 py-2 text-xs ${selectedDay===d.iso?'bg-black text-white':'bg-white'}`}>{d.label}</button>
          ))}
          {selectedDay && (
            <button onClick={()=>setSelectedDay('')} className="rounded-xl border px-3 py-2 text-xs">Clear</button>
          )}
        </div>
        {selectedDay && (
          <div className="space-y-2 text-sm">
            {events.filter((e)=> e.isoDate===selectedDay).map((ev)=> (
              <Link key={ev.id} to={`/events/${ev.slug}`} className="flex items-center gap-3 rounded-2xl border bg-white p-2">
                <div className="h-14 w-20 rounded-lg bg-cover bg-center" style={{ backgroundImage: ev.imageSrc ? `url(${ev.imageSrc})` : undefined }} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{ev.title}</div>
                  <div className="text-[10px] text-gray-500">{ev.clubName}</div>
                </div>
              </Link>
            ))}
            {events.filter((e)=> e.isoDate===selectedDay).length===0 && (
              <div className="rounded-2xl border bg-white p-4 text-center text-sm text-gray-600">No events on this day.</div>
            )}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">Find Teammates</h2>
        <div className="space-y-3">
          {[
            { name: 'Aarav Mehta', skills: 'React, Tailwind', img: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=60' },
            { name: 'Peehu Mishra', skills: 'Flutter, Dart', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60' },
            { name: 'Ishaan Verma', skills: 'Node, MongoDB', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=60' },
          ].map((u, i)=> (
            <div key={i} className="flex items-center justify-between rounded-2xl border bg-white p-3">
              <div className="flex items-center gap-3">
                <img loading="lazy" src={u.img} alt={u.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-[10px] text-gray-500">{u.skills}</div>
                </div>
              </div>
              <button className="rounded-full border px-3 py-1 text-xs">Connect</button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 mb-8">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">Newsletter</h2>
        <div className="flex items-center gap-2 rounded-2xl border bg-white p-2">
          <input placeholder="Email address" className="w-full border-0 p-0 text-sm outline-none" />
          <button className="rounded-2xl bg-black px-3 py-2 text-sm text-white">Subscribe</button>
        </div>
      </section>
    </Shell>
  )
}

function EventsScreen() {
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const allTypes: Array<EventItem['type']> = ['Hackathon','Workshop','Talk','Competition']
  const [selectedTypes, setSelectedTypes] = useState<Array<EventItem['type']>>([])
  const list = useMemo(() => {
    let items = events.slice().sort((a, b) => (sort === 'asc' ? a.isoDate.localeCompare(b.isoDate) : b.isoDate.localeCompare(a.isoDate)))
    if (selectedTypes.length) items = items.filter((e) => selectedTypes.includes(e.type))
    if (favoritesOnly) items = items.filter((e) => favorites[e.id])
    return items
  }, [sort, selectedTypes, favoritesOnly, favorites])
  const toggleType = (t: EventItem['type']) => {
    setSelectedTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }
  return (
    <Shell>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Events</h2>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Sort:</span>
          <button className={`rounded-full border px-2 py-1 ${sort === 'asc' ? 'bg-gray-100' : ''}`} onClick={() => setSort('asc')}>Oldest</button>
          <button className={`rounded-full border px-2 py-1 ${sort === 'desc' ? 'bg-gray-100' : ''}`} onClick={() => setSort('desc')}>Newest</button>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {allTypes.map((t) => (
          <button key={t} onClick={() => toggleType(t)} className={`rounded-full border px-3 py-1 text-xs ${selectedTypes.includes(t) ? 'bg-black text-white' : 'bg-white'}`}>{t}</button>
        ))}
        <span className="ml-auto flex items-center gap-2 text-xs text-gray-700">
          <span>Favorites</span>
          <Switch checked={favoritesOnly} onChange={setFavoritesOnly} />
        </span>
      </div>
      <div className="space-y-4">
        {list.map((ev) => (
          <Link key={ev.id} to={`/events/${ev.slug}`} className="block overflow-hidden rounded-2xl border bg-white p-3">
            <div className="relative h-40 w-full rounded-xl bg-gray-300 bg-cover bg-center" style={{ backgroundImage: ev.imageSrc ? `url(${ev.imageSrc})` : undefined }}>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-2 top-2 flex items-center gap-2">
                <Badge>{formatBadgeDate(ev.isoDate)}</Badge>
                <Badge className="bg-brand-600 text-white">{ev.type}</Badge>
              </div>
              <button
                onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); setFavorites(f=>({...f,[ev.id]:!f[ev.id]})) }}
                className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 ${favorites[ev.id]?'text-red-500':'text-gray-700'}`}
              >
                <Heart size={16} />
              </button>
            </div>
            <div className="mt-3">
              <div className="font-medium">{ev.title}</div>
              <div className="text-xs text-gray-500">{ev.clubName}</div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-600">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1"><CalendarDays size={12}/> {formatLongDate(ev.isoDate)}</span>
                <span className="inline-flex items-center gap-1"><MapPin size={12}/> Auditorium</span>
              </div>
              <span className="rounded-full border px-3 py-1">Details</span>
            </div>
          </Link>
        ))}
      </div>
    </Shell>
  )
}

function EventDetailScreen() {
  const { slug } = useParams()
  const ev = events.find((e) => e.slug === slug) ?? events[0]
  const [showNotice, setShowNotice] = useState(true)

  const clubImages: Record<string, string> = {
    'Google Developers Club': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=60',
    'CSI': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=60',
    'Web Dev Club': 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=300&q=60',
    'ML Club': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=300&q=60',
    'Design Guild': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=60',
    'Cloud Native': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=60',
    'Robotics Society': 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=300&q=60',
    'OSS Hub': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=60',
  }
  const organizerImg = clubImages[ev.clubName] ?? ev.imageSrc
  return (
    <Shell>
      <div className="relative -mx-4 mb-4 h-72 overflow-hidden">
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
          <Link to="/events" aria-label="Back" className="grid h-10 w-10 place-items-center rounded-full bg-black/30 text-white backdrop-blur">
            <ChevronLeft size={18} />
          </Link>
          <button aria-label="Share" className="grid h-10 w-10 place-items-center rounded-full bg-black/30 text-white backdrop-blur">
            <Share2 size={16} />
          </button>
        </div>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: ev.imageSrc ? `url(${ev.imageSrc})` : undefined }} />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <h2 className="text-3xl font-semibold">{ev.title}</h2>
          <p className="mt-1 text-xs opacity-90">{formatLongDate(ev.isoDate)}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-900">{ev.type}</span>
            <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white/90">{ev.clubName}</span>
          </div>
          <p className="mt-3 max-w-[30ch] text-[12px] opacity-90 line-clamp-3">{ev.description}</p>
        </div>
      </div>
      <div className="px-1">
        <div className="mb-4 flex items-center gap-3">
          <img src={organizerImg} alt={ev.clubName} className="h-10 w-10 rounded-full object-cover" />
          <div className="text-sm">
            <div className="font-medium">{ev.clubName}</div>
            <div className="text-gray-500">Organizer</div>
          </div>
        </div>

        <section className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">About</h3>
          <p className="text-sm text-gray-700">{ev.description}</p>
        </section>

        <section className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-2xl border bg-white p-3 text-sm">
              <CalendarDays size={16} className="text-gray-600" />
              <span>{formatLongDate(ev.isoDate)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border bg-white p-3 text-sm">
              <Users size={16} className="text-gray-600" />
              <span>Teams up to 4</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border bg-white p-3 text-sm">
              <MapPin size={16} className="text-gray-600" />
              <span>Campus Auditorium</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border bg-white p-3 text-sm">
              <Clock size={16} className="text-gray-600" />
              <span>9:00 AM - 6:00 PM</span>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h3 className="mb-2 text-lg font-semibold">Schedule</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-2xl border bg-white px-3 py-2">
              <span>Registration & Check-in</span>
              <span className="text-gray-500">09:00</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border bg-white px-3 py-2">
              <span>Kickoff & Rules</span>
              <span className="text-gray-500">10:00</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border bg-white px-3 py-2">
              <span>Submission & Demos</span>
              <span className="text-gray-500">17:00</span>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showNotice && (
          <motion.div className="fixed inset-0 z-30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowNotice(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="absolute left-1/2 top-1/2 w-[94%] max-w-[520px] -translate-x-1/2 -translate-y-1/2"
              initial={{ y: 24, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <div role="dialog" aria-modal="true" aria-labelledby="notice-title" className="relative max-h-[80vh] overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                <button
                  aria-label="Close notice"
                  className="absolute right-3 top-3 rounded-full p-1 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowNotice(false)}
                >
                  <X size={18} />
                </button>
                <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-center">
                  <h3 id="notice-title" className="text-lg font-medium text-gray-900">Free registration</h3>
                  <div className="text-xs text-gray-600">Limited seats — register soon</div>
                  <p className="mt-1 max-w-[40ch] text-sm text-gray-700">Join <b>{ev.title}</b> by <b>{ev.clubName}</b>. Showcase your skills and connect with peers.</p>
                  <div className="mt-3 grid w-full grid-cols-1 gap-2">
                    <button onClick={() => setShowNotice(false)} className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700">Register Now</button>
                    <button onClick={() => setShowNotice(false)} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-800">Later</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  )
}

function LoginScreen() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[480px] flex-col bg-white px-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <h1 className="font-mono text-6xl">Pixel</h1>
        <h2 className="text-gray-500">Sign-in</h2>
        <form className="w-full space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input className="mt-1 w-full border-b px-1 py-2 outline-none" />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label>Password</label>
              <a className="text-pink-500">Forget Password</a>
            </div>
            <input type="password" className="mt-1 w-full border-b px-1 py-2 outline-none" />
          </div>
          <button className="mt-4 w-full rounded-2xl bg-gray-900 py-3 text-white">Login</button>
          <div className="text-center text-xs text-gray-500">
            Dont have an account ? <a className="text-pink-500">Sign-up</a>
          </div>
        </form>
      </div>
    </div>
  )
}

function RecommendationScreen() {
  return (
    <Shell>
      <h2 className="text-xl font-semibold">Recommendation</h2>
      <div className="mt-4 space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-2xl bg-gray-900" />
      <div>
                  <div className="text-sm font-medium">Peehu Mishra</div>
                  <div className="text-[10px] text-gray-500">2 Year</div>
                  <div className="text-[10px] text-gray-500">Flutter, Dart Etc</div>
                </div>
              </div>
              <button className="rounded-full bg-black px-3 py-1 text-xs text-white">Know More</button>
            </div>
            <div className="h-px w-full bg-gray-300" />
          </div>
        ))}
      </div>
    </Shell>
  )
}

function ClubsScreen() {
  const [view, setView] = useState<'Grid' | 'List'>('Grid')
  const [query, setQuery] = useState('')
  const [onlyFollowed, setOnlyFollowed] = useState(false)
  const [followed, setFollowed] = useState<Record<string, boolean>>({})
  const debouncedQuery = useDebouncedValue(query, 300)
  const filtered = clubs.filter((c) => c.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
  const shown = onlyFollowed ? filtered.filter((c) => followed[c.slug]) : filtered
  useEffect(()=>{
    const saved = localStorage.getItem('followedClubs')
    if(saved){ try{ setFollowed(JSON.parse(saved)) }catch{}}
  },[])
  useEffect(()=>{
    localStorage.setItem('followedClubs', JSON.stringify(followed))
  },[followed])
  return (
    <Shell>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Clubs</h2>
        <SegmentedControl options={["Grid","List"]} value={view} onChange={(v)=>setView(v as 'Grid'|'List')} />
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl border bg-white px-3 py-2">
        <Search size={18} className="text-gray-600" />
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search clubs" className="w-full border-0 p-0 text-sm outline-none" />
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Followed</span>
          <Switch checked={onlyFollowed} onChange={setOnlyFollowed} />
        </div>
      </div>

      {view === 'Grid' ? (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {shown.map((c) => (
            <div key={c.slug} className="rounded-xl border bg-white p-2">
              <Link to={`/clubs/${c.slug}`} className="block">
                <img loading="lazy" src={c.img} alt={c.name} className="mx-auto h-12 w-12 rounded-full object-cover" />
                <div className="mt-1 truncate text-center text-xs font-medium">{c.name}</div>
                <div className="mt-1 flex justify-center gap-1">
                  {(c.tags||[]).slice(0,2).map((t:string,i:number)=> (<span key={i} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">{t}</span>))}
                </div>
              </Link>
              <button onClick={()=>setFollowed((f)=>({...f,[c.slug]:!f[c.slug]}))} className={`mt-2 w-full rounded-full border px-2 py-1 text-[11px] ${followed[c.slug] ? 'bg-black text-white' : ''}`}>{followed[c.slug] ? 'Following' : 'Follow'}</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {shown.map((c) => (
            <div key={c.slug} className="flex items-center justify-between rounded-xl border bg-white p-2">
              <Link to={`/clubs/${c.slug}`} className="flex items-center gap-3">
                <img loading="lazy" src={c.img} alt={c.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-[10px] text-gray-500">{c.members?.toLocaleString()} members</div>
                </div>
              </Link>
              <button onClick={()=>setFollowed((f)=>({...f,[c.slug]:!f[c.slug]}))} className={`rounded-full border px-3 py-1 text-xs ${followed[c.slug] ? 'bg-black text-white' : ''}`}>{followed[c.slug] ? 'Following' : 'Follow'}</button>
            </div>
          ))}
        </div>
      )}
    </Shell>
  )
}

function ClubDetailScreen() {
  const { slug } = useParams()
  const club = clubs.find((c) => c.slug === slug) ?? clubs[0]
  return (
    <Shell>
      <div className="relative -mx-4 mb-4 h-56 overflow-hidden">
        <img src={club.img} alt={club.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full items-end p-4 text-white">
          <div>
            <div className="text-sm text-white/80">Club</div>
            <h2 className="text-3xl font-semibold">{club.name}</h2>
          </div>
        </div>
      </div>
      <div className="space-y-4 text-sm text-gray-700">
        <p>{club.desc || `Welcome to the ${club.name}. Explore events, meet members, and get involved.`}</p>
        <div className="flex gap-2">
          {(club.tags||[]).map((t:string,i:number)=> (<span key={i} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">{t}</span>))}
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Gallery</h3>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
            {[club.img, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=60'].map((src, i) => (
              <img key={i} src={src} className="h-28 w-44 shrink-0 rounded-xl object-cover" />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Upcoming from {club.name}</h3>
          <div className="space-y-2">
            {events.slice(0,3).map((ev)=> (
              <Link key={ev.id} to={`/events/${ev.slug}`} className="flex items-center gap-3 rounded-xl border bg-white p-2">
                <div className="h-14 w-20 rounded-lg bg-cover bg-center" style={{ backgroundImage: ev.imageSrc ? `url(${ev.imageSrc})` : undefined }} />
                <div>
                  <div className="text-sm font-medium">{ev.title}</div>
                  <div className="text-[10px] text-gray-500">{formatBadgeDate(ev.isoDate)} · {ev.type}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Core Members</h3>
          <div className="flex gap-3">
            {[1,2,3,4].map((i)=> (
              <div key={i} className="flex flex-col items-center">
                <img src={club.img} className="h-12 w-12 rounded-full object-cover" />
                <div className="mt-1 text-[10px]">Member {i}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="rounded-full border px-4 py-2">Message</button>
          <button className="rounded-full bg-black px-4 py-2 text-white">Join</button>
        </div>
      </div>
    </Shell>
  )
}
function ProfileScreen() {
  const [tab, setTab] = useState<'Profile'|'Settings'>('Profile')
  const [skills, setSkills] = useState<string[]>(['React','Tailwind','Node'])
  const [newSkill, setNewSkill] = useState('')
  const [interests, setInterests] = useState<string[]>(['AI','Mobile','Web'])
  const [newInterest, setNewInterest] = useState('')
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [website, setWebsite] = useState('')
  const [bio, setBio] = useState('')
  const bioLimit = 160
  const [openToInvites, setOpenToInvites] = useState(true)
  const [notif, setNotif] = useState(true)
  const [dm, setDm] = useState(false)
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)
  const [showEmail, setShowEmail] = useState(true)
  const [showPhone, setShowPhone] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [theme, setTheme] = useState<'System'|'Light'|'Dark'>('System')
  const [language, setLanguage] = useState('English')
  // Persist a subset of profile/settings
  useEffect(()=>{
    const saved = localStorage.getItem('profileState')
    if(saved){ try{
      const s = JSON.parse(saved)
      setSkills(s.skills||[]); setInterests(s.interests||[]); setGithub(s.github||''); setLinkedin(s.linkedin||''); setWebsite(s.website||'');
      setBio(s.bio||''); setOpenToInvites(!!s.openToInvites)
      setNotif(!!s.notif); setDm(!!s.dm); setEmailNotif(!!s.emailNotif); setPushNotif(!!s.pushNotif); setSmsNotif(!!s.smsNotif);
      setShowEmail(!!s.showEmail); setShowPhone(!!s.showPhone); setTwoFA(!!s.twoFA); setTheme(s.theme||'System'); setLanguage(s.language||'English')
    }catch{}}
  },[])
  useEffect(()=>{
    const s = { skills, interests, github, linkedin, website, bio, openToInvites, notif, dm, emailNotif, pushNotif, smsNotif, showEmail, showPhone, twoFA, theme, language }
    localStorage.setItem('profileState', JSON.stringify(s))
  },[skills, interests, github, linkedin, website, bio, openToInvites, notif, dm, emailNotif, pushNotif, smsNotif, showEmail, showPhone, twoFA, theme, language])
  return (
    <Shell>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <SegmentedControl options={["Profile","Settings"]} value={tab} onChange={(v)=>setTab(v as 'Profile'|'Settings')} />
      </div>

      {tab === 'Profile' ? (
        <>
          <div className="mt-6 flex flex-col items-center gap-2">
            <img src={profileImg} alt="Profile" className="h-24 w-24 rounded-2xl object-cover" />
            <input id="avatar" type="file" accept="image/*" className="hidden" />
            <label htmlFor="avatar" className="inline-block rounded-full border px-3 py-1 text-xs">Change photo</label>
          </div>
          <form className="mt-6 space-y-3">
            {['Name','Semester','University','Email','Phone','Description'].map((p, i) => (
              <Input key={i} placeholder={p} />
            ))}
          </form>
          <div className="mt-4 flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Open to team invites</div>
            <Switch checked={openToInvites} onChange={setOpenToInvites} />
          </div>
          <div className="mt-4">
            <div className="mb-2 text-sm font-medium">Skills</div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i)=> (
                <Chip key={i} label={s} />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Input placeholder="Add a skill" value={newSkill} onChange={(e:any)=>setNewSkill(e.target.value)} />
              <Button onClick={()=>{ if(newSkill.trim()){ setSkills([...skills,newSkill.trim()]); setNewSkill('') }}} className="whitespace-nowrap">Add</Button>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2 text-sm font-medium">Interests</div>
            <div className="flex flex-wrap gap-2">
              {interests.map((s, i)=> (
                <Chip key={i} label={s} />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Input placeholder="Add an interest" value={newInterest} onChange={(e:any)=>setNewInterest(e.target.value)} />
              <Button onClick={()=>{ if(newInterest.trim()){ setInterests([...interests,newInterest.trim()]); setNewInterest('') }}} className="whitespace-nowrap">Add</Button>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2 text-sm font-medium">Links</div>
            <Input placeholder="Website" value={website} onChange={(e:any)=>setWebsite(e.target.value)} />
            <Input placeholder="GitHub URL" value={github} onChange={(e:any)=>setGithub(e.target.value)} className="mt-2" />
            <Input placeholder="LinkedIn URL" value={linkedin} onChange={(e:any)=>setLinkedin(e.target.value)} className="mt-2" />
          </div>
          <div className="mt-6">
            <div className="mb-2 text-sm font-medium">Bio</div>
            <textarea value={bio} onChange={(e)=> e.target.value.length <= bioLimit && setBio(e.target.value)} placeholder="Tell us about yourself..." className="w-full rounded-2xl border bg-white px-4 py-3 text-sm" rows={4} />
            <div className="mt-1 text-right text-[10px] text-gray-500">{bio.length}/{bioLimit}</div>
          </div>
        </>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Notifications</div>
            <Switch checked={notif} onChange={setNotif} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Direct Messages</div>
            <Switch checked={dm} onChange={setDm} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Public Profile</div>
            <Switch checked={true} onChange={()=>{}} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Email notifications</div>
            <Switch checked={emailNotif} onChange={setEmailNotif} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Push notifications</div>
            <Switch checked={pushNotif} onChange={setPushNotif} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">SMS notifications</div>
            <Switch checked={smsNotif} onChange={setSmsNotif} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Show email on profile</div>
            <Switch checked={showEmail} onChange={setShowEmail} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Show phone on profile</div>
            <Switch checked={showPhone} onChange={setShowPhone} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Two-factor authentication</div>
            <Switch checked={twoFA} onChange={setTwoFA} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Theme</div>
            <SegmentedControl options={["System","Light","Dark"]} value={theme} onChange={(v)=>setTheme(v as 'System'|'Light'|'Dark')} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-white p-3">
            <div className="text-sm">Language</div>
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="rounded-xl border px-2 py-1 text-sm">
              {['English','Hindi','Spanish'].map((l)=>(<option key={l} value={l}>{l}</option>))}
            </select>
          </div>
          <div className="rounded-2xl border bg-white p-3">
            <div className="text-sm font-medium">Account</div>
            <div className="mt-2 flex gap-2">
              <button className="rounded-2xl border px-3 py-2 text-sm">Download data</button>
              <button className="rounded-2xl border px-3 py-2 text-sm">Sign out</button>
              <button className="ml-auto rounded-2xl bg-red-600 px-3 py-2 text-sm text-white">Delete account</button>
            </div>
          </div>
        </div>
      )}

    </Shell>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/events" element={<EventsScreen />} />
      <Route path="/events/uphoria" element={<EventDetailScreen />} />
      <Route path="/events/:slug" element={<EventDetailScreen />} />
      <Route path="/recommendation" element={<RecommendationScreen />} />
      <Route path="/clubs" element={<ClubsScreen />} />
      <Route path="/clubs/:slug" element={<ClubDetailScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/login" element={<LoginScreen />} />
    </Routes>
  )
}

export default App
