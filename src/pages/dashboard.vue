<script setup lang="ts">
import { STATUS_LABEL, useBookingDashboard } from '~/composables/useBookingDashboard'
import type { BookingStatus, DashboardBooking } from '~/composables/useBookingDashboard'

definePageMeta({ layout: false })
useHead({ title: 'Dashboard · Samlot Diamond Resort' })

const { today, rooms, stats, bookings, loading, error, load, setStatus } = useBookingDashboard()

const filter = ref<'all' | BookingStatus>('all')
const search = ref('')
const sortBy = ref<'check_in' | 'total' | 'guest'>('check_in')
const selected = ref<DashboardBooking | null>(null)
const nextStatus = ref<BookingStatus>('pending')
const toast = ref('')
const saving = ref(false)

onMounted(load)

const statuses = Object.keys(STATUS_LABEL) as BookingStatus[]
const DAYS = 14
const DAY = 86400000

const start = computed(() => new Date((today.value || new Date().toISOString().slice(0, 10)) + 'T00:00:00'))
const days = computed(() => Array.from({ length: DAYS }, (_, i) => new Date(start.value.getTime() + i * DAY)))

const fmt = (v: string | Date) => new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const usd = (n: number) => '$' + n.toLocaleString()
const initials = (n: string) => n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

const live = computed(() => bookings.value.filter((b) => b.status !== 'cancelled'))
const arrivals = computed(() => live.value.filter((b) => b.check_in === today.value))
const departures = computed(() => live.value.filter((b) => b.check_out === today.value))

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  const list = bookings.value.filter(
    (b) => (filter.value === 'all' || b.status === filter.value) && `${b.guest}${b.room}${b.code}`.toLowerCase().includes(q),
  )
  return list.sort((a, b) =>
    sortBy.value === 'total' ? b.total - a.total : sortBy.value === 'guest' ? a.guest.localeCompare(b.guest) : a.check_in.localeCompare(b.check_in),
  )
})

const count = (s: 'all' | BookingStatus) => (s === 'all' ? bookings.value.length : bookings.value.filter((b) => b.status === s).length)

function barsFor(room: string) {
  return live.value
    .filter((b) => b.room === room)
    .map((b) => {
      const s = Math.round((new Date(b.check_in + 'T00:00:00').getTime() - start.value.getTime()) / DAY)
      return { b, from: Math.max(s, 0), to: Math.min(s + b.nights, DAYS) }
    })
    .filter((x) => x.to > x.from)
}

function open(b: DashboardBooking) {
  selected.value = b
  nextStatus.value = b.status
}

function notify(msg: string) {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 2600)
}

async function save() {
  if (!selected.value) return
  saving.value = true
  try {
    await setStatus(selected.value.id, nextStatus.value)
    selected.value = bookings.value.find((b) => b.id === selected.value!.id) ?? null
    notify('Status saved')
  } catch {
    notify('Could not save. Sign in as staff and try again.')
  } finally {
    saving.value = false
  }
}

const icons = {
  in: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3',
  out: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
}
</script>

<template>
  <div class="app">
    <aside class="side">
 <div class="p-6 border-b border-emerald-800 flex items-center gap-3">
        <!-- Logo Image -->
        <img 
          src="/logo/logo.png" 
          alt="Samlot Diamond Resort Logo" 
          class="w-10 h-10 object-contain rounded-full bg-white p-1 shadow-sm"
        />
        <div>
          <h1 class="text-lg font-serif font-bold tracking-wider leading-tight">Samlot Admin</h1>
          <p class="text-xs text-emerald-300">Resort Management</p>
        </div>
      </div>
      
      <nav class="p-4 space-y-2">
        <a class="block px-4 py-2 bg-emerald-800 text-white rounded on" href="/dashboard">Bookings</a>
        <a class="block px-4 py-2 text-emerald-200 hover:bg-emerald-800 rounded" href="http://localhost:8000/admin/rooms-dashboard/">Rooms</a>
        <a class="block px-4 py-2 text-emerald-200 hover:bg-emerald-800 rounded" href="http://localhost:8000/admin/">Django admin</a>
        <a class="block px-4 py-2 text-emerald-200 hover:bg-emerald-800 rounded" href="/">View website</a>
      </nav>
    </aside>

    <div class="main">
      <header class="head">
        <div>
          <h1>Bookings overview</h1>
          <p>{{ start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
        </div>
        <button class="btn" :disabled="loading" @click="load">{{ loading ? 'Refreshing…' : 'Refresh' }}</button>
      </header>

      <div v-if="error" class="alert" role="alert">
        <span>{{ error }}</span>
        <a href="http://localhost:8000/admin/login/?next=/admin/" target="_blank" rel="noopener">Sign in to Django admin</a>
      </div>

      <section class="kpis">
        <div class="kpi">
          <span class="chip g"><svg viewBox="0 0 24 24"><path :d="icons.in" /></svg></span>
          <div><b>{{ stats.arrivals_today }}</b><span>Arrivals today</span></div>
        </div>
        <div class="kpi">
          <span class="chip b"><svg viewBox="0 0 24 24"><path :d="icons.out" /></svg></span>
          <div><b>{{ stats.departures_today }}</b><span>Departures today</span></div>
        </div>
        <div class="kpi">
          <span class="chip a"><svg viewBox="0 0 24 24"><path :d="icons.clock" /></svg></span>
          <div><b>{{ stats.pending }}</b><span>Awaiting confirmation</span></div>
        </div>
        <div class="kpi">
          <div class="ring" :style="{ '--p': stats.occupancy_percent }"><span>{{ stats.occupancy_percent }}%</span></div>
          <div><b class="sm">Occupied tonight</b><span>of {{ rooms.length }} room{{ rooms.length === 1 ? '' : 's' }}</span></div>
        </div>
      </section>

      <section class="split">
        <div class="card">
          <div class="card-h"><h2>Next 14 days</h2><p>Each bar is a stay. Select one to open it.</p></div>
          <div class="scroll">
            <div class="tl">
              <div class="tl-row head-row">
                <span />
                <div class="cells">
                  <span v-for="(d, i) in days" :key="i" :class="{ now: i === 0 }">
                    {{ d.toLocaleDateString('en-GB', { weekday: 'short' }) }}<b>{{ d.getDate() }}</b>
                  </span>
                </div>
              </div>
              <div v-for="room in rooms" :key="room" class="tl-row">
                <span class="room">{{ room }}</span>
                <div class="cells lane">
                  <button
                    v-for="x in barsFor(room)"
                    :key="x.b.id"
                    class="bar"
                    :class="'s-' + x.b.status"
                    :style="{ gridColumn: `${x.from + 1} / ${x.to + 1}` }"
                    :title="`${x.b.guest} · ${fmt(x.b.check_in)} – ${fmt(x.b.check_out)}`"
                    @click="open(x.b)"
                  >{{ x.b.guest }}</button>
                </div>
              </div>
              <p v-if="!rooms.length" class="empty">No rooms yet. Add rooms in Django admin to see the timeline.</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-h"><h2>Today</h2><p>Guests arriving and leaving.</p></div>
          <h3 class="sub">Arriving</h3>
          <ul v-if="arrivals.length" class="people">
            <li v-for="b in arrivals" :key="b.id" @click="open(b)">
              <span class="av">{{ initials(b.guest) }}</span>
              <div><b>{{ b.guest }}</b><small>{{ b.room }} · {{ b.nights }} night{{ b.nights === 1 ? '' : 's' }}</small></div>
            </li>
          </ul>
          <p v-else class="empty sm">No arrivals today.</p>
          <h3 class="sub">Leaving</h3>
          <ul v-if="departures.length" class="people">
            <li v-for="b in departures" :key="b.id" @click="open(b)">
              <span class="av">{{ initials(b.guest) }}</span>
              <div><b>{{ b.guest }}</b><small>{{ b.room }}</small></div>
            </li>
          </ul>
          <p v-else class="empty sm">No departures today.</p>
        </div>
      </section>

      <section class="card">
        <div class="card-h row">
          <div><h2>All reservations</h2><p>{{ filtered.length }} of {{ bookings.length }} shown</p></div>
          <div class="tools">
            <input v-model="search" type="search" placeholder="Search guest, room or code" aria-label="Search bookings" />
            <select v-model="sortBy" aria-label="Sort bookings">
              <option value="check_in">Check-in date</option>
              <option value="total">Total amount</option>
              <option value="guest">Guest name</option>
            </select>
          </div>
        </div>
        <div class="tabs">
          <button v-for="s in ['all', ...statuses]" :key="s" :class="{ on: filter === s }" @click="filter = s as any">
            {{ s === 'all' ? 'All' : STATUS_LABEL[s as BookingStatus] }}<em>{{ count(s as any) }}</em>
          </button>
        </div>
        <div class="scroll">
          <table>
            <thead>
              <tr><th>Guest</th><th>Room</th><th>Stay</th><th>Status</th><th class="amt">Total</th></tr>
            </thead>
            <tbody>
              <tr v-for="b in filtered" :key="b.id" tabindex="0" @click="open(b)" @keydown.enter="open(b)">
                <td><div class="who"><span class="av">{{ initials(b.guest) }}</span><div><b>{{ b.guest }}</b><small>{{ b.code }}</small></div></div></td>
                <td>{{ b.room }}</td>
                <td>{{ fmt(b.check_in) }} – {{ fmt(b.check_out) }}<small>{{ b.nights }} night{{ b.nights === 1 ? '' : 's' }}</small></td>
                <td><span class="pill" :class="'s-' + b.status">{{ STATUS_LABEL[b.status] }}</span></td>
                <td class="amt">{{ usd(b.total) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="!filtered.length && !loading" class="empty">No bookings match. Clear the search or pick another status.</p>
        </div>
      </section>
    </div>

    <div v-if="selected" class="scrim" @click="selected = null" />
    <aside v-if="selected" class="drawer" role="dialog" aria-label="Booking details" @keydown.esc="selected = null">
      <div class="drawer-top">
        <span class="av lg">{{ initials(selected.guest) }}</span>
        <div><h2>{{ selected.guest }}</h2><small>{{ selected.code }}</small></div>
      </div>
      <span class="pill" :class="'s-' + selected.status">{{ STATUS_LABEL[selected.status] }}</span>
      <dl>
        <dt>Room</dt><dd>{{ selected.room }}</dd>
        <dt>Check-in</dt><dd>{{ fmt(selected.check_in) }}</dd>
        <dt>Check-out</dt><dd>{{ fmt(selected.check_out) }}</dd>
        <dt>Nights</dt><dd>{{ selected.nights }}</dd>
        <dt>Total</dt><dd>{{ usd(selected.total) }}</dd>
      </dl>
      <label for="st">Change status</label>
      <select id="st" v-model="nextStatus">
        <option v-for="s in statuses" :key="s" :value="s">{{ STATUS_LABEL[s] }}</option>
      </select>
      <div class="actions">
        <button class="btn" :disabled="saving" @click="save">{{ saving ? 'Saving…' : 'Save status' }}</button>
        <button class="btn ghost" @click="selected = null">Close</button>
      </div>
    </aside>

    <div v-if="toast" class="toast" role="status">{{ toast }}</div>
  </div>
</template>

<style scoped>
.app{--bg:#f1f4f3;--card:#fff;--ink:#14231f;--mute:#66787a;--line:#e1e8e5;--brand:#14513f;--accent:#b8893b;--side:#0e2b24;--pend:#a86d0c;--pendbg:rgba(217,150,30,.16);--ok:#1f7a58;--okbg:rgba(42,160,110,.16);--bad:#b13a33;--badbg:rgba(190,60,50,.14);--shadow:0 1px 2px rgba(15,35,30,.06),0 4px 14px rgba(15,35,30,.04);display:flex;min-height:100vh;background:var(--bg);color:var(--ink);font:400 14px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
@media (prefers-color-scheme:dark){.app{--bg:#0a1512;--card:#112019;--ink:#e6f0ed;--mute:#8aa19c;--line:#1f342d;--brand:#3fae8a;--side:#071310;--pend:#e8b25a;--ok:#6fcf9f;--bad:#f0908a;--shadow:none}}
h1,h2,h3,p{margin:0}
.side{width:224px;flex-shrink:0;background:var(--side);color:#cfe3dc;padding:22px 14px;position:sticky;top:0;height:100vh}
.brand{display:flex;gap:10px;align-items:center;padding:0 8px 22px;color:#fff;font-weight:600}
.brand small{display:block;font-weight:400;font-size:12px;color:#8fb3a8}
.mark{width:34px;height:34px;border-radius:9px;background:var(--accent);color:#1b1405;display:grid;place-items:center;font-weight:700}
.side nav{display:flex;flex-direction:column;gap:2px}
.side a{padding:9px 12px;border-radius:8px;color:inherit;text-decoration:none}
.side a:hover{background:rgba(255,255,255,.07)}
.side a.on{background:rgba(255,255,255,.12);color:#fff;box-shadow:inset 3px 0 0 var(--accent)}
.main{flex:1;min-width:0;padding:28px 32px 48px;display:flex;flex-direction:column;gap:20px}
.head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap}
.head h1{font-size:24px;font-weight:650;letter-spacing:-.01em}
.head p,.card-h p,.empty,small,.kpi span{color:var(--mute)}
.btn{border:0;background:var(--brand);color:#fff;font:inherit;font-weight:600;padding:9px 16px;border-radius:8px;cursor:pointer}
.btn:disabled{opacity:.6;cursor:default}
.btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.alert{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;background:var(--badbg);color:var(--bad);padding:12px 16px;border-radius:10px;font-weight:500}
.alert a{color:inherit;font-weight:700}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;display:flex;align-items:center;gap:14px;box-shadow:var(--shadow)}
.kpi b{display:block;font-size:30px;line-height:1.1;font-weight:650;letter-spacing:-.02em}
.kpi b.sm{font-size:16px;line-height:1.3}
.chip{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;flex-shrink:0}
.chip svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.chip.g{background:var(--okbg);color:var(--ok)}.chip.b{background:rgba(50,130,200,.15);color:#3282c8}.chip.a{background:var(--pendbg);color:var(--pend)}
.ring{--p:0;width:52px;height:52px;border-radius:50%;background:conic-gradient(var(--brand) calc(var(--p) * 1%),var(--line) 0);display:grid;place-items:center;flex-shrink:0;position:relative}
.ring::before{content:"";position:absolute;inset:6px;border-radius:50%;background:var(--card)}
.ring span{position:relative;font-size:12px;font-weight:700;color:var(--ink)}
.split{display:grid;grid-template-columns:minmax(0,2fr) minmax(260px,1fr);gap:16px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px;box-shadow:var(--shadow);min-width:0}
.card-h{margin-bottom:14px}.card-h h2{font-size:16px;font-weight:650}
.card-h.row{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap}
.scroll{overflow-x:auto}
.tl{min-width:640px}
.tl-row{display:grid;grid-template-columns:120px 1fr;border-bottom:1px solid var(--line)}
.tl-row:last-of-type{border-bottom:0}
.cells{display:grid;grid-template-columns:repeat(14,1fr)}
.head-row .cells span{display:flex;flex-direction:column;align-items:center;font-size:11px;color:var(--mute);padding-bottom:6px}
.head-row .cells b{font-size:13px;color:var(--ink);font-weight:600}
.head-row .cells .now b{background:var(--brand);color:#fff;border-radius:50%;width:22px;height:22px;display:grid;place-items:center}
.room{padding:12px 0;font-weight:600}
.lane{min-height:46px;align-items:center;background:repeating-linear-gradient(90deg,transparent 0 calc(100%/14 - 1px),var(--line) calc(100%/14 - 1px) calc(100%/14))}
.bar{height:30px;margin:8px 2px;border:0;border-radius:8px;padding:0 10px;font:inherit;font-size:12px;font-weight:600;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;border-left:4px solid}
.bar:hover{filter:brightness(1.08)}
.s-pending{background:var(--pendbg);color:var(--pend);border-color:var(--pend)}
.s-confirmed{background:var(--okbg);color:var(--ok);border-color:var(--ok)}
.s-cancelled{background:var(--badbg);color:var(--bad);border-color:var(--bad)}
.sub{font-size:12px;font-weight:600;color:var(--mute);margin:14px 0 6px}
.people{list-style:none;margin:0;padding:0}
.people li{display:flex;gap:10px;align-items:center;padding:8px;border-radius:10px;cursor:pointer}
.people li:hover{background:var(--bg)}
.people small,.who small,td small{display:block;font-size:12px}
.av{width:34px;height:34px;border-radius:50%;background:var(--okbg);color:var(--ok);display:grid;place-items:center;font-size:12px;font-weight:700;flex-shrink:0}
.av.lg{width:46px;height:46px;font-size:15px}
.empty{padding:16px 0}.empty.sm{padding:4px 8px}
.tools{display:flex;gap:8px;flex-wrap:wrap}
input,select{font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:8px 10px}
.tools input{min-width:220px}
.tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin-bottom:6px;overflow-x:auto}
.tabs button{border:0;background:none;color:var(--mute);font:inherit;font-weight:600;padding:10px 14px;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap}
.tabs button.on{color:var(--ink);border-bottom-color:var(--brand)}
.tabs em{font-style:normal;margin-left:6px;font-size:12px;background:var(--bg);padding:1px 7px;border-radius:10px}
table{width:100%;border-collapse:collapse;min-width:620px}
th{text-align:left;font-size:12px;font-weight:600;color:var(--mute);padding:10px 12px}
td{padding:12px;border-top:1px solid var(--line);vertical-align:middle}
tbody tr{cursor:pointer}tbody tr:hover{background:var(--bg)}
.amt{text-align:right;font-variant-numeric:tabular-nums;font-weight:600}
.who{display:flex;gap:10px;align-items:center}
.pill{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;border:0}
.scrim{position:fixed;inset:0;background:rgba(5,20,16,.5);z-index:20}
.drawer{position:fixed;top:0;right:0;bottom:0;width:min(400px,100%);background:var(--card);z-index:21;padding:26px;overflow:auto;display:flex;flex-direction:column;gap:12px;box-shadow:-8px 0 30px rgba(0,0,0,.2)}
.drawer-top{display:flex;gap:12px;align-items:center}.drawer h2{font-size:20px}
.drawer .pill{align-self:flex-start}
dl{display:grid;grid-template-columns:100px 1fr;gap:10px 8px;margin:8px 0;padding:14px 0;border-block:1px solid var(--line)}
dt{color:var(--mute)}dd{margin:0;font-weight:600}
label{font-weight:600}
.actions{display:flex;gap:8px;margin-top:6px}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--ink);color:var(--card);padding:10px 18px;border-radius:10px;z-index:30;font-weight:500}
@media (max-width:1000px){.kpis{grid-template-columns:1fr 1fr}.split{grid-template-columns:1fr}}
@media (max-width:760px){.side{display:none}.main{padding:18px 14px 40px}}
</style>