import { useEffect, useState, useMemo, useRef } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import {
  BookIcon,
  UploadIcon,
  VideoIcon,
  ClockIcon,
  CloseIcon,
  FolderIcon,
} from './icons'

function formatNow() {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date())
}

function toPreview(markdown: string) {
  if (!markdown) return ''
  return markdown
    .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/^## (.*)$/gm, '<h2 class="text-xl font-bold mt-3 mb-1">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/==(.+?)==/g, '<mark>$1</mark>')
    .replace(/<u>(.+?)<\/u>/g, '<u class="decoration-cornflower">$1</u>')
    .replace(/^\* (.*)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br />')
}

import { useAuth } from '@workos-inc/authkit-react'

export function Workspace() {
  const { signOut } = useAuth()

  const [activeSection, setActiveSection] = useState<'notes' | 'uploads'>('notes')
  const [activeNoteId, setActiveNoteId] = useState<Id<'notes'> | null>(null)
  const [activeSubject, setActiveSubject] = useState<string | null>(null)
  const [hoverMenu, setHoverMenu] = useState<{ x: number, y: number, text: string } | null>(null)
  const [focusedLine, setFocusedLine] = useState<number | null>(null)
  const [editingSubject, setEditingSubject] = useState<Id<'subjects'> | 'new' | null>(null)
  const [subjectInput, setSubjectInput] = useState('')

  const workspaceData = useQuery(api.workspace.bootstrap, {})

  const saveNote = useMutation(api.notes.save)
  const createNote = useMutation(api.notes.create)
  const updateNoteMetadata = useMutation(api.notes.updateMetadata)
  const addVideo = useMutation(api.notes.addVideo)
  const addTimestamp = useMutation(api.notes.addTimestamp)
  const createSubject = useMutation(api.workspace.createSubject)
  const createUpload = useMutation(api.workspace.createUpload)
  const seedDemoData = useMutation(api.workspace.seedDemoData)
  
  const allNotes = workspaceData?.notes ?? []
  const uploads = workspaceData?.uploads ?? []
  const subjects = workspaceData?.subjects ?? []
  
  const notes = useMemo(() => {
    if (!activeSubject) return allNotes
    return allNotes.filter(n => n.subject === activeSubject)
  }, [allNotes, activeSubject])

  const activeNote = notes.find((n) => n._id === activeNoteId) || (notes.length > 0 ? notes[0] : null)

  const [localTitle, setLocalTitle] = useState('')
  useEffect(() => {
    if (activeNote) setLocalTitle(activeNote.title)
  }, [activeNote?._id, activeNote?.title])
  
  useEffect(() => {
    if (workspaceData && allNotes.length === 0) {
      void seedDemoData({ replace: true })
    }
  }, [workspaceData, allNotes.length, seedDemoData])

  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0]._id)
    }
  }, [notes, activeNoteId])

  const handleSelection = () => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setHoverMenu(null)
      return
    }
    const text = selection.toString().trim()
    if (text.length > 0) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setHoverMenu({
        x: rect.left + rect.width / 2,
        y: rect.top - 40,
        text
      })
    }
  }

  const applyFormat = (prefix: string, suffix: string) => {
    if (!activeNote) return
    const selection = window.getSelection()
    if (!selection) return
    const text = selection.toString()
    const newBody = localBody.replace(text, `${prefix}${text}${suffix}`)
    debouncedSave(newBody)
    setHoverMenu(null)
  }

  const searchExternal = (type: 'google' | 'wiki' | 'youtube') => {
    if (!hoverMenu) return
    const queries = {
      google: `https://www.google.com/search?q=${encodeURIComponent(hoverMenu.text)}`,
      wiki: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(hoverMenu.text)}`,
      youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(hoverMenu.text)}`
    }
    window.open(queries[type], '_blank')
    setHoverMenu(null)
  }

  const [localBody, setLocalBody] = useState<string>('')
  const [lastSavedBody, setLastSavedBody] = useState<string>('')
  
  useEffect(() => {
    if (activeNote && activeNote.body !== lastSavedBody) {
      setLocalBody(activeNote.body)
      setLastSavedBody(activeNote.body)
    }
  }, [activeNote, lastSavedBody])

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSave = (newBody: string) => {
    setLocalBody(newBody)
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      if (activeNote) {
        void saveNote({ id: activeNote._id, body: newBody, updatedAt: new Date().toISOString() })
        setLastSavedBody(newBody)
      }
    }, 500)
  }

  const lines = useMemo(() => localBody.split('\n'), [localBody])

  const handleLineChange = (index: number, value: string) => {
    const newLines = [...lines]
    newLines[index] = value
    debouncedSave(newLines.join('\n'))
  }

  const handleAddVideo = () => {
    if (!activeNote) return
    const url = prompt('Enter YouTube URL:')
    if (!url) return
    const title = prompt('Video Title:', 'Lecture Video')
    if (url && title) {
      void addVideo({ id: activeNote._id, url, title })
    }
  }

  const handleAddUpload = () => {
    const name = prompt('File Name:')
    if (!name) return
    const url = prompt('File URL:')
    if (!url) return
    const kind = prompt('Kind (pdf, slides, text, image):', 'pdf') as any
    const category = prompt('Category (optional):', 'Reading List')
    void createUpload({ name, url, kind, category: category || undefined })
  }

  const handleAddTimestamp = (videoUrl: string) => {
    if (!activeNote) return
    const label = prompt('Timestamp Label:')
    const seconds = parseInt(prompt('Seconds:') ?? '0')
    if (label) {
      void addTimestamp({ id: activeNote._id, videoUrl, label, seconds })
    }
  }

  const handleCreateSubject = async () => {
    if (!subjectInput.trim()) return
    await createSubject({ name: subjectInput.trim() })
    setSubjectInput('')
    setEditingSubject(null)
  }

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null
  }

  const [uploadCategory, setUploadCategory] = useState<string | null>(null)

  const filteredUploads = useMemo(() => {
    if (!uploadCategory) return uploads
    return uploads.filter(u => u.category === uploadCategory)
  }, [uploads, uploadCategory])

  const handleUpdateNoteSubject = (subjectName: string) => {
    if (!activeNote) return
    void updateNoteMetadata({ id: activeNote._id, subject: subjectName })
  }

  const handleUpdateNoteTitle = (title: string) => {
    setLocalTitle(title)
    if (!activeNote) return
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      void updateNoteMetadata({ id: activeNote._id, title })
    }, 500)
  }

  if (!workspaceData) {
    return (
      <div className="grid h-dvh place-items-center bg-start">
        <div className="animate-pulse text-ocean text-[10px] uppercase tracking-widest">loading workspace...</div>
      </div>
    )
  }

  return (
    <div className="grid min-h-dvh grid-cols-[16rem_1fr] bg-start text-charcoal font-sans selection:bg-cornflower/30" onMouseUp={handleSelection}>
      {/* SIDEBAR */}
      <aside className="flex h-dvh flex-col border-r border-cornflower p-4 overflow-hidden">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-sm font-bold tracking-tighter lowercase italic">quing.</span>
        </div>
        
        <nav className="flex flex-col gap-1 text-sm mb-8">
          <button
            onClick={() => { setActiveSection('notes'); setActiveSubject(null); setUploadCategory(null); }}
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-all ${activeSection === 'notes' && !activeSubject ? 'bg-cornflower text-white' : 'hover:bg-cornflower/10'}`}
          >
            <BookIcon className="h-4 w-4" />
            Notes
          </button>
          <button
            onClick={() => { setActiveSection('uploads'); setActiveSubject(null); }}
            className={`flex items-center gap-2 rounded-md px-3 py-2 transition-all ${activeSection === 'uploads' ? 'bg-cornflower text-white' : 'hover:bg-cornflower/10'}`}
          >
            <UploadIcon className="h-4 w-4" />
            Uploads
          </button>
        </nav>

        <div className="flex-1 overflow-y-auto space-y-6 min-h-0 pr-2">
           {/* SUBJECTS SECTION */}
           <div>
              <div className="flex items-center justify-between mb-3 pr-1">
                <div className="text-[10px] uppercase tracking-widest text-ocean font-bold">Subjects</div>
                <button onClick={() => setEditingSubject('new')} className="text-[10px] text-cornflower hover:underline">+ Add</button>
              </div>
              
              {editingSubject === 'new' && (
                <div className="mb-3 px-2">
                  <input
                    autoFocus
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateSubject()}
                    className="w-full bg-transparent border-b border-cornflower py-1 text-xs outline-none"
                    placeholder="Subject name..."
                  />
                </div>
              )}

              <div className="space-y-1">
                {subjects.map(s => (
                  <button 
                    key={s._id} 
                    onClick={() => { setActiveSection('notes'); setActiveSubject(s.name); }}
                    className={`w-full text-left flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${activeSubject === s.name ? 'bg-cornflower/10 text-cornflower font-bold' : 'text-ocean hover:bg-cornflower/5'}`}
                  >
                    <FolderIcon className={`h-3 w-3 ${activeSubject === s.name ? 'text-cornflower' : 'text-cornflower/60'}`} />
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>
           </div>

           {/* LIBRARY/NOTES SECTION */}
           <div>
             <div className="text-[10px] uppercase tracking-widest text-ocean mb-3 font-bold">My Notes</div>
             <div className="space-y-1">
               {notes.map(n => (
                 <button
                    key={n._id}
                    onClick={() => setActiveNoteId(n._id)}
                    className={`w-full text-left px-3 py-2 rounded text-xs truncate transition-all ${activeNoteId === n._id ? 'bg-cornflower/10 text-cornflower font-bold border-l-2 border-cornflower' : 'text-ocean hover:bg-cornflower/5 border-l-2 border-transparent'}`}
                 >
                   {n.title}
                 </button>
               ))}
               <button onClick={() => void createNote({ title: 'New Note', subject: activeSubject ?? 'General' }).then(id => setActiveNoteId(id as Id<'notes'>))} className="w-full text-left px-3 py-2 text-xs text-cornflower/60 italic hover:text-cornflower">+ New Note...</button>
             </div>
           </div>

           {/* UPLOADS CATEGORIES (Shortcuts) */}
           <div>
             <div className="text-[10px] uppercase tracking-widest text-ocean mb-3 font-bold">Shortcuts</div>
             <div className="space-y-1">
               {['Reading List', 'Assignments', 'Research'].map(cat => (
                 <button 
                    key={cat} 
                    onClick={() => { setActiveSection('uploads'); setUploadCategory(cat); }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${uploadCategory === cat ? 'bg-cornflower/10 text-cornflower' : 'text-ocean hover:bg-cornflower/5'}`}
                 >
                    <div className={`w-1.5 h-1.5 rounded-full ${uploadCategory === cat ? 'bg-cornflower' : 'bg-cornflower/40'}`} />
                    {cat}
                 </button>
               ))}
             </div>
           </div>
        </div>

        <div className="mt-auto pt-4 border-t border-cornflower">
          <button onClick={() => void signOut()} className="text-[10px] uppercase tracking-widest text-ocean hover:text-alert underline">Sign Out</button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex h-dvh flex-col overflow-hidden relative">
        {activeSection === 'notes' ? (
          <>
            {/* HEADER */}
            <header className="flex items-center justify-between border-b border-cornflower px-8 py-5 bg-start/80 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex flex-col">
                <select 
                  value={activeNote?.subject ?? 'General'}
                  onChange={(e) => handleUpdateNoteSubject(e.target.value)}
                  className="text-[10px] uppercase tracking-[0.2em] text-ocean font-bold bg-transparent outline-none cursor-pointer hover:text-cornflower transition-colors"
                >
                  {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
                <input 
                  value={localTitle} 
                  onChange={(e) => handleUpdateNoteTitle(e.target.value)}
                  className="text-2xl font-bold tracking-tight bg-transparent outline-none border-none p-0"
                  placeholder="Untitled Note"
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="text-[10px] text-ocean font-mono opacity-60">AUTO-SAVED {activeNote ? formatNow() : ''}</div>
                <div className="flex items-center gap-2">
                  <button onClick={handleAddVideo} className="p-2.5 rounded-xl bg-cornflower/5 text-cornflower hover:bg-cornflower/15 transition-all" title="Append Video">
                    <VideoIcon className="h-5 w-5" />
                  </button>
                  <button onClick={handleAddUpload} className="p-2.5 rounded-xl bg-cornflower/5 text-cornflower hover:bg-cornflower/15 transition-all" title="Upload File">
                    <UploadIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </header>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-12 py-12 scroll-smooth">
              {!activeNote ? (
                <div className="h-full flex flex-col items-center justify-center text-ocean/40 italic">
                  <BookIcon className="h-12 w-12 mb-4 opacity-20" />
                  <p>No notes found. Create one to get started.</p>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto space-y-1">
                  {lines.length === 0 && <div className="text-ocean/40 italic text-sm">Start typing...</div>}
                  {lines.map((line, i) => (
                    <div key={i} className="relative group min-h-[1.5rem] py-0.5">
                      {focusedLine === i ? (
                        <textarea
                          autoFocus
                          value={line}
                          onChange={(e) => handleLineChange(i, e.target.value)}
                          onBlur={() => setFocusedLine(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const newLines = [...lines]
                              newLines.splice(i + 1, 0, '')
                              debouncedSave(newLines.join('\n'))
                              setFocusedLine(i + 1)
                            }
                            if (e.key === 'Backspace' && line === '' && lines.length > 1) {
                              e.preventDefault()
                              const newLines = [...lines]
                              newLines.splice(i, 1)
                              debouncedSave(newLines.join('\n'))
                              setFocusedLine(i > 0 ? i - 1 : 0)
                            }
                            if (e.key === 'ArrowDown' && i < lines.length - 1) {
                              setFocusedLine(i + 1)
                            }
                            if (e.key === 'ArrowUp' && i > 0) {
                              setFocusedLine(i - 1)
                            }
                          }}

                          className="w-full bg-transparent outline-none resize-none font-mono text-[15px] border-l-2 border-cornflower pl-4 py-1 leading-relaxed"
                          rows={1}
                          style={{ height: 'auto' }}
                        />
                      ) : (
                        <div
                          onClick={() => setFocusedLine(i)}
                          className="prose prose-sm max-w-none cursor-text hover:bg-cornflower/5 rounded px-4 py-1 transition-colors min-h-[1.5rem] leading-relaxed text-[15px] border-l-2 border-transparent"
                          dangerouslySetInnerHTML={{ __html: toPreview(line) || '&nbsp;' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ATTACHMENTS */}
              {(activeNote?.videos?.length ?? 0) > 0 && (
                <div className="max-w-3xl mx-auto mt-24 border-t border-cornflower/40 pt-12">
                  <div className="flex items-center gap-3 mb-8">
                    <VideoIcon className="h-4 w-4 text-cornflower" />
                    <h3 className="text-xs uppercase tracking-widest text-ocean font-bold">Lecture Transcripts & Video</h3>
                  </div>
                  <div className="space-y-12">
                    {activeNote?.videos?.map((v, vi) => (
                      <div key={vi} className="bg-cornflower/5 rounded-2xl p-8 border border-cornflower/10 shadow-sm transition-all hover:shadow-md">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-sm tracking-tight">{v.title}</h4>
                            <div className="px-3 py-1 bg-cornflower/20 rounded-full text-[10px] text-cornflower font-bold uppercase tracking-wider">YouTube</div>
                          </div>
                          <div className="aspect-video mb-8 rounded-xl overflow-hidden bg-black shadow-2xl">
                            <iframe
                              src={getYoutubeEmbedUrl(v.url) ?? ''}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                          <div className="flex flex-wrap gap-2.5">
                            {v.timestamps.map(t => (
                              <button
                                key={t.id}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-cornflower/20 rounded-full text-[11px] font-bold text-cornflower hover:bg-cornflower hover:text-white transition-all shadow-sm group"
                              >
                                <ClockIcon className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                {t.label} ({Math.floor(t.seconds / 60)}:{String(t.seconds % 60).padStart(2, '0')})
                              </button>
                            ))}
                            <button onClick={() => handleAddTimestamp(v.url)} className="px-4 py-2 border border-dashed border-cornflower/40 rounded-full text-[11px] text-ocean hover:bg-cornflower/5 transition-colors font-medium">
                              + Add Timestamp Reference
                            </button>
                          </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LINKED UPLOADS */}
              {(activeNote?.linkedUploads?.length ?? 0) > 0 && (
                <div className="max-w-3xl mx-auto mt-16 border-t border-cornflower/40 pt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <UploadIcon className="h-4 w-4 text-cornflower" />
                    <h3 className="text-xs uppercase tracking-widest text-ocean font-bold">Linked Workspace Files</h3>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {activeNote?.linkedUploads?.map(id => {
                      const u = uploads.find(x => x._id === id)
                      return u ? (
                        <div key={id} className="flex items-center gap-3 px-5 py-3 bg-white border border-cornflower/20 rounded-xl shadow-sm hover:border-cornflower transition-colors cursor-pointer group">
                          <div className="p-2 bg-cornflower/10 rounded-lg group-hover:bg-cornflower group-hover:text-white transition-colors">
                            <UploadIcon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold">{u.name}</span>
                            <span className="text-[10px] uppercase text-ocean tracking-wider">{u.kind}</span>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto px-12 py-12">
             <header className="mb-12">
                <span className="text-[10px] uppercase tracking-[0.2em] text-ocean font-bold">{uploadCategory ?? 'ALL UPLOADS'}</span>
                <h2 className="text-3xl font-bold tracking-tight">Your Resource Library</h2>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUploads.map(u => (
                  <div key={u._id} className="bg-white border border-cornflower/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-cornflower/10 rounded-xl text-cornflower group-hover:bg-cornflower group-hover:text-white transition-colors">
                           <UploadIcon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-ocean font-bold">{u.kind}</span>
                     </div>
                     <h3 className="font-bold text-sm mb-1">{u.name}</h3>
                     <p className="text-[10px] text-ocean uppercase tracking-wider">Uploaded {formatNow()}</p>
                     {u.category && <div className="mt-4 inline-block px-2 py-1 bg-cornflower/5 rounded text-[9px] uppercase font-bold text-cornflower">{u.category}</div>}
                  </div>
                ))}
                {filteredUploads.length === 0 && <div className="col-span-full py-20 text-center text-ocean/60 italic">No files found in this category.</div>}
             </div>
          </div>
        )}
      </main>

      {/* HOVER MENU */}
      {hoverMenu && (
        <div
          className="fixed z-50 flex items-center bg-charcoal text-white rounded-xl shadow-2xl p-1.5 gap-1 animate-in fade-in zoom-in duration-200 backdrop-blur-md"
          style={{
            left: `${hoverMenu.x}px`,
            top: `${hoverMenu.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <button onClick={() => applyFormat('**', '**')} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Bold"><b>B</b></button>
          <button onClick={() => applyFormat('_', '_')} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Italic"><i>I</i></button>
          <button onClick={() => applyFormat('<u>', '</u>')} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Underline"><u>U</u></button>
          <button onClick={() => applyFormat('==', '==')} className="p-2 hover:bg-white/10 rounded-lg text-yellow-300 transition-colors" title="Highlight">M</button>
          <div className="w-px h-5 bg-white/20 mx-1.5" />
          <button onClick={() => searchExternal('google')} className="px-3 py-1.5 text-[11px] hover:bg-white/10 rounded-lg font-bold tracking-tight transition-colors uppercase">Google</button>
          <button onClick={() => searchExternal('wiki')} className="px-3 py-1.5 text-[11px] hover:bg-white/10 rounded-lg font-bold tracking-tight transition-colors uppercase">Wiki</button>
          <button onClick={() => searchExternal('youtube')} className="px-3 py-1.5 text-[11px] hover:bg-white/10 rounded-lg font-bold tracking-tight transition-colors uppercase">YouTube</button>
          <button onClick={() => setHoverMenu(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><CloseIcon className="h-3.5 w-3.5" /></button>
        </div>
      )}
    </div>
  )
}
