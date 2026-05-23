export type Surface = 'landing' | 'login' | 'signup' | 'recovery' | 'workspace'

export type AppSection =
  | 'dashboard'
  | 'notes'
  | 'subjects'
  | 'videos'
  | 'planner'
  | 'flashcards'
  | 'uploads'
  | 'settings'

export type TimestampNote = {
  id: string
  label: string
  seconds: number
  excerpt: string
}

export type NoteRecord = {
  id: string
  title: string
  subject: string
  folder: string
  updatedLabel: string
  summary: string
  body: string
  tags: string[]
  timestamps: TimestampNote[]
}

export type VideoRecord = {
  id: string
  title: string
  channel: string
  duration: string
  topic: string
  relevance: string
  embedId: string
  description: string
  trusted: boolean
}

export type PlannerRecord = {
  id: string
  title: string
  course: string
  dueLabel: string
  countdown: string
  status: 'upcoming' | 'in progress' | 'complete'
}

export type FlashcardRecord = {
  id: string
  front: string
  back: string
  noteTitle: string
  subject: string
  intervalLabel: string
}

export type UploadRecord = {
  id: string
  name: string
  kind: 'pdf' | 'slides' | 'text'
  subject: string
  excerpt: string
  updatedLabel: string
}

export type SubjectRecord = {
  id: string
  name: string
  notes: number
  videos: number
  flashcards: number
  focus: string
}

export type ContextRecord = {
  keys: string[]
  title: string
  summary: string
}

export const navigationItems: { id: AppSection; label: string }[] = [
  { id: 'dashboard', label: 'dashboard' },
  { id: 'notes', label: 'notes' },
  { id: 'subjects', label: 'subjects' },
  { id: 'videos', label: 'videos' },
  { id: 'planner', label: 'planner' },
  { id: 'flashcards', label: 'flashcards' },
  { id: 'uploads', label: 'uploads' },
  { id: 'settings', label: 'settings' },
]

export const initialNotes: NoteRecord[] = [
  {
    id: 'photosynthesis-systems',
    title: 'photosynthesis and energy transfer',
    subject: 'biology',
    folder: 'life sciences',
    updatedLabel: '2 min ago',
    summary: 'reaction stages, chloroplast structure, and atp transfer.',
    tags: ['biology', 'cell systems', 'exam review'],
    body: `# photosynthesis and energy transfer

## overview
photosynthesis converts light energy into chemical energy stored in glucose. the process happens mainly in the chloroplast and depends on coordinated light-dependent reactions and the calvin cycle.

## key structure
- chlorophyll inside the thylakoid membrane absorbs light.
- water is split to replace lost electrons and release oxygen.
- proton gradients across the thylakoid drive atp synthase.

## exam note
the chloroplast is efficient because light capture, electron transport, and sugar production are separated into connected spaces. if i can explain why nadph and atp are needed before carbon fixation starts, i understand the system instead of memorizing it.

> question to revisit. why does a drop in light intensity slow the calvin cycle even though carbon fixation is not directly light powered?
`,
    timestamps: [
      {
        id: 'bio-1',
        label: '02:18',
        seconds: 138,
        excerpt: 'water splitting begins the electron replacement chain.',
      },
      {
        id: 'bio-2',
        label: '09:42',
        seconds: 582,
        excerpt: 'atp and nadph link light reactions to carbon fixation.',
      },
      {
        id: 'bio-3',
        label: '16:05',
        seconds: 965,
        excerpt: 'exam framing. explain why oxygen is a byproduct.',
      },
    ],
  },
  {
    id: 'bayesian-updating',
    title: 'bayesian updating in plain language',
    subject: 'mathematics',
    folder: 'probability',
    updatedLabel: '11 min ago',
    summary: 'prior belief, likelihood, posterior, and evidence.',
    tags: ['mathematics', 'statistics', 'problem sets'],
    body: `# bayesian updating in plain language

## intuition
bayes' theorem updates an existing belief after new evidence appears. the prior is what i believed before the new data. the likelihood tells me how expected the data would be if the hypothesis were true.

## practical checkpoint
if the evidence is common in many competing explanations, it should not move the posterior very much. strong evidence is specific, not merely dramatic.

## worked reminder
1. define the hypothesis clearly.
2. state the base rate first.
3. compare how likely the evidence is under each explanation.

\`posterior = prior x likelihood / evidence\`

the biggest mistake is ignoring the base rate and treating vivid evidence as decisive proof.
`,
    timestamps: [
      {
        id: 'math-1',
        label: '04:10',
        seconds: 250,
        excerpt: 'base rates matter before the new observation arrives.',
      },
      {
        id: 'math-2',
        label: '12:33',
        seconds: 753,
        excerpt: 'likelihood compares explanations, not just one answer.',
      },
    ],
  },
]

export const subjectDirectory: SubjectRecord[] = [
  { id: 'biology', name: 'biology', notes: 14, videos: 28, flashcards: 62, focus: 'metabolism and cell signalling' },
  { id: 'mathematics', name: 'mathematics', notes: 22, videos: 19, flashcards: 87, focus: 'probability, calculus, linear algebra' },
  { id: 'history', name: 'history', notes: 9, videos: 13, flashcards: 31, focus: 'state formation and political conflict' },
  { id: 'economics', name: 'economics', notes: 11, videos: 17, flashcards: 28, focus: 'monetary policy and incentives' },
]

export const trustedVideos: VideoRecord[] = [
  {
    id: 'video-1',
    title: 'essence of linear algebra',
    channel: '3Blue1Brown',
    duration: '15:35',
    topic: 'linear algebra',
    relevance: '94%',
    embedId: 'kjBOesZCoqc',
    description: 'intuition-first explanation of vectors, transformations, and basis changes.',
    trusted: true,
  },
  {
    id: 'video-2',
    title: 'photosynthesis overview',
    channel: 'Khan Academy',
    duration: '11:12',
    topic: 'photosynthesis',
    relevance: '92%',
    embedId: 'xuCn8ux2gbs',
    description: 'a compact walkthrough of light-dependent reactions and the calvin cycle.',
    trusted: true,
  },
  {
    id: 'video-3',
    title: 'bayes theorem, clearly explained',
    channel: 'StatQuest with Josh Starmer',
    duration: '12:05',
    topic: 'bayes theorem',
    relevance: '96%',
    embedId: 'HZGCoVF3YvM',
    description: 'a step-by-step explanation of priors, likelihoods, and posteriors.',
    trusted: true,
  },
  {
    id: 'video-4',
    title: 'the fall of the roman republic',
    channel: 'Kings and Generals',
    duration: '19:24',
    topic: 'roman republic',
    relevance: '88%',
    embedId: 'rgg4nLehw7s',
    description: 'political tensions, military power, and institutional breakdown.',
    trusted: true,
  },
  {
    id: 'video-5',
    title: 'understanding uncertainty with confidence',
    channel: 'Veritasium',
    duration: '17:02',
    topic: 'probability',
    relevance: '82%',
    embedId: 'bVG2OQp6jEQ',
    description: 'a conceptual route into uncertainty, evidence, and reasoning.',
    trusted: true,
  },
  {
    id: 'video-6',
    title: 'cellular respiration and photosynthesis',
    channel: 'Amoeba Sisters',
    duration: '8:48',
    topic: 'cell biology',
    relevance: '84%',
    embedId: '4Eo7JtRA7lg',
    description: 'a concise refresher built for memorability without losing the core logic.',
    trusted: true,
  },
  {
    id: 'video-7',
    title: 'probability explained visually',
    channel: 'Numberphile',
    duration: '10:31',
    topic: 'probability',
    relevance: '79%',
    embedId: 'ZA4JkHKZM50',
    description: 'short visual treatment of chance, sampling, and expectation.',
    trusted: true,
  },
  {
    id: 'video-8',
    title: 'how political systems decay',
    channel: 'Caspian Report',
    duration: '13:16',
    topic: 'political systems',
    relevance: '76%',
    embedId: 'qEV9qoup2mQ',
    description: 'context for institutional fragility and concentrated power.',
    trusted: true,
  },
]

export const generalVideos: VideoRecord[] = [
  {
    id: 'video-9',
    title: 'intro to photosynthesis for exam revision',
    channel: 'Open Learning Lab',
    duration: '9:18',
    topic: 'photosynthesis',
    relevance: '75%',
    embedId: 'sQK3Yr4Sc_k',
    description: 'fast summary designed for revision and concept checks.',
    trusted: false,
  },
  {
    id: 'video-10',
    title: 'bayesian reasoning with real examples',
    channel: 'MIT OpenCourseWare',
    duration: '21:08',
    topic: 'bayes theorem',
    relevance: '78%',
    embedId: 'lG4VkPoG3ko',
    description: 'formal framing with examples from diagnostics and forecasting.',
    trusted: false,
  },
  {
    id: 'video-11',
    title: 'why republics fail',
    channel: 'World History Forum',
    duration: '14:44',
    topic: 'roman republic',
    relevance: '70%',
    embedId: 'kDqTB3fV3sw',
    description: 'general history overview with comparisons across states.',
    trusted: false,
  },
  {
    id: 'video-12',
    title: 'probability intuition for beginners',
    channel: 'Study Sessions',
    duration: '7:56',
    topic: 'probability',
    relevance: '68%',
    embedId: 'Z5myJ8dg_rM',
    description: 'a beginner-oriented walkthrough of everyday uncertainty.',
    trusted: false,
  },
]

export const plannerItems: PlannerRecord[] = [
  {
    id: 'planner-1',
    title: 'photosynthesis short-answer drill',
    course: 'biology',
    dueLabel: 'monday 08:00',
    countdown: '2 days',
    status: 'in progress',
  },
  {
    id: 'planner-2',
    title: 'bayes problem set 4',
    course: 'mathematics',
    dueLabel: 'wednesday 13:00',
    countdown: '4 days',
    status: 'upcoming',
  },
  {
    id: 'planner-3',
    title: 'roman republic essay outline',
    course: 'history',
    dueLabel: 'friday 17:00',
    countdown: '6 days',
    status: 'upcoming',
  },
  {
    id: 'planner-4',
    title: 'organic mechanisms review',
    course: 'chemistry',
    dueLabel: 'completed',
    countdown: 'done',
    status: 'complete',
  },
]

export const flashcardSeed: FlashcardRecord[] = [
  {
    id: 'flash-1',
    front: 'why does the calvin cycle slow when light intensity drops?',
    back: 'because atp and nadph production falls, reducing the energy carriers required for carbon fixation.',
    noteTitle: 'photosynthesis and energy transfer',
    subject: 'biology',
    intervalLabel: 'due today',
  },
  {
    id: 'flash-2',
    front: 'what does the likelihood measure in bayes\' theorem?',
    back: 'it measures how expected the observed evidence would be if a hypothesis were true.',
    noteTitle: 'bayesian updating in plain language',
    subject: 'mathematics',
    intervalLabel: 'in 2 days',
  },
  {
    id: 'flash-3',
    front: 'what changed when military loyalty shifted in the late republic?',
    back: 'generals gained direct political leverage because soldiers were increasingly loyal to commanders instead of republican norms.',
    noteTitle: 'power and fragility in the roman republic',
    subject: 'history',
    intervalLabel: 'in 5 days',
  },
  {
    id: 'flash-4',
    front: 'what is hyperconjugation?',
    back: 'stabilisation of a carbocation by the overlap of sigma bonds with an empty p-orbital.',
    noteTitle: 'organic chemistry notes',
    subject: 'chemistry',
    intervalLabel: 'new',
  },
]

export const uploadsSeed: UploadRecord[] = [
  {
    id: 'upload-1',
    name: 'cellular-energy-lecture.pdf',
    kind: 'pdf',
    subject: 'biology',
    excerpt: 'light excites electrons in photosystem ii before the transport chain establishes the gradient needed for atp synthase.',
    updatedLabel: 'uploaded today',
  },
  {
    id: 'upload-2',
    name: 'week-7-probability-slides.pptx',
    kind: 'slides',
    subject: 'mathematics',
    excerpt: 'posterior beliefs should be compared against a clearly stated prior rather than an intuitive guess.',
    updatedLabel: 'uploaded yesterday',
  },
]

export const contextualLibrary: ContextRecord[] = [
  {
    keys: ['photosynthesis', 'chloroplast', 'calvin cycle', 'thylakoid'],
    title: 'photosynthesis',
    summary:
      'photosynthesis uses light energy to move electrons, generate atp and nadph, and then fix carbon into sugars. the light-dependent reactions happen in the thylakoid membranes, while carbon fixation happens in the stroma through the calvin cycle.',
  },
  {
    keys: ['bayes', 'bayesian', 'posterior', 'likelihood', 'prior'],
    title: 'bayes\' theorem',
    summary:
      'bayes\' theorem updates prior belief with new evidence. it works best when the prior is explicit, the evidence is compared across competing explanations, and the denominator is treated as the normalizing step rather than ignored.',
  },
  {
    keys: ['roman republic', 'caesar', 'sulla', 'patronage'],
    title: 'roman republic',
    summary:
      'the roman republic mixed formal institutions with informal norms. its later instability is often explained by elite competition, widening social inequality, military loyalty to individual commanders, and reforms pursued in low-trust conditions.',
  },
  {
    keys: ['probability', 'uncertainty', 'base rate'],
    title: 'probability',
    summary:
      'probability helps estimate uncertainty, compare scenarios, and reason with incomplete information. in applied study contexts, the main skill is translating a word problem into assumptions about base rates, conditional likelihoods, and plausible outcomes.',
  },
]

export const dashboardSignals = [
  { label: 'active notes', value: '12', detail: '3 open now' },
  { label: 'trusted videos queued', value: '8', detail: '2 aligned to today\'s planner' },
  { label: 'flashcards due', value: '24', detail: '12 generated from current notes' },
  { label: 'focus time today', value: '01h 40m', detail: 'last sync 40 sec ago' },
]

export const workflowSteps = [
  'capture a note while a lecture is still moving',
  'highlight a concept without leaving the page',
  'open a trusted explanation or compact summary',
  'turn the key idea into a flashcard and planner step',
]

export const trustedChannelNames = [
  'Organic Chemistry Tutor',
  'Veritasium',
  'Front Page',
  '3Blue1Brown',
  'Khan Academy',
  'Kurzgesagt',
  'CrashCourse',
  'Professor Leonard',
  'Fern',
  'Numberphile',
  'Computerphile',
  'StatQuest with Josh Starmer',
  'Michael Van Biezen',
  'Real Engineering',
  'Mark Rober',
  'NileRed',
  'Oversimplified',
  'Kings and Generals',
  'Invicta',
  'Caspian Report',
  'RealLifeLore',
  'Andrew Huberman',
  'Ninja Nerd',
  'Amoeba Sisters',
  'Ben Felix',
  'Asianometry',
  'Patrick Boyle On Finance',
  'Theo - t3.gg',
  'ThioJoe',
  'Fireship',
  'The Primeagen',
  'How Money Works',
  'Morning Brew',
  'How History Works',
  'Monkey Economics',
  'How Money Works Uncut',
]
