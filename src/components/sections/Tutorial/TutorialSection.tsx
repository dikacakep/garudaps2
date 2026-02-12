"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Monitor, Smartphone, Apple, Command, Download, Copy, Check, LucideIcon, Video, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TutorialStep {
  text: string;
  code?: string;       
  isMultiLine?: boolean;
  link?: string;
  isDownload?: boolean;
}

interface TutorialItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  imageSrc: string;
  videoSrc?: string;
  steps: TutorialStep[];
}

const TUTORIAL_DATA: TutorialItem[] = [
  {
    id: "apk",
    label: "Application",
    icon: Smartphone,
    color: "text-orange-400",
    imageSrc: "/images/logo/garudaps.jpg",
    steps: [
      { text: "Uninstall Real Growtopia if you have it. " },
      { text: "Restart your device (optional but recommended)." },
      { text: "Install the GarudaPs APK.", link: "https://apk.garudaps.com"},
      { text: "Open the app, and have fun!!" }
    ]
  },
    {
    id: "windows",
    label: "Windows",
    icon: Monitor,
    color: "text-blue-400",
    imageSrc: "/images/icons/win.png",
    steps: [
      { 
        text: "Download 'GarudaPS Auto-Patcher'", 
        link: "/files/garuda_patcher.bat",
        isDownload: true 
      },
      { 
        text: "Right click the file → Run as Administrator." 
      },
      { 
        text: "Type 'Y' and press Enter when asked to install.", 
        code: "Do you want to install GarudaPS hosts entries? (Y/N): Y" 
      },
      { 
        text: "Wait for 'Install complete' message → Launch Growtopia." 
      },
    ]
  },

  
  {
    id: "android-pt",
    label: "PowerTunnel",
    icon: Smartphone,
    color: "text-green-400",
    imageSrc: "/images/icons/ptun.png",
    steps: [
      { text: "Download PowerTunnel APK", link: "https://android.izzysoft.de/repo/apk/io.github.krlvm.powertunnel.android" },
      { text: "Open App → Menu (Plugin) → Hosts → Settings (Gear Icon)." },
      { text: "Enter this URL in the box:", code: "https://play.garudaps.com/android" },
      { text: "Go Back → Click 'CONNECT' button → Open Growtopia." }
    ]
  },
  {
    id: "android-hostsgo",
    label: "Hosts Go",
    icon: Smartphone,
    color: "text-teal-400",
    imageSrc: "/images/icons/hostsgo.png",
    steps: [
      { text: "Download Hosts Go (No Root)", link: "https://www.mediafire.com/file/ctly08te3i8rlwq" },
      { text: "Open App → Hosts Editor → Enable Switch → Download Hosts File." },
      { text: "Enter this URL:", code: "https://play.garudaps.com/android" },
      { text: "Apply → Start Protection (VPN) → Open Growtopia." }
    ]
  },
  {
    id: "android-virtual",
    label: "Virtual Host",
    icon: Smartphone,
    color: "text-purple-400",
    imageSrc: "/images/icons/virtual.png",
    steps: [
      { text: "Download Virtual Host APK", link: "https://www.apkshub.com/app/com.github.xfalcon.vhosts", isDownload: false },
      { text: "Download our Hosts File", link: "https://play.garudaps.com/garudaps", isDownload: true },
      { text: "Open App → Click 'SELECT HOSTS FILE'." }, 
      { text: "Select the file you just downloaded → Turn ON (Green)." }
    ]
  },
  {
    id: "ios-surge",
    label: "Surge 5 (iOS)",
    icon: Apple,
    color: "text-gray-200",
    imageSrc: "/images/icons/surge.png",
    videoSrc: "/videos/ios.mp4", 
    steps: [
      { text: "Install Surge 5 from App Store", link: "https://apps.apple.com/us/app/surge-5/id1442620678" },
      { text: "Open App → Import Profile via URL.", code: "https://play.garudaps.com/ios" },
      { text: "Allow VPN Configuration → Tap 'Start' → Open Growtopia." }
    ]
  },
  {
    id: "mac",
    label: "MacOS",
    icon: Command,
    color: "text-white",
    imageSrc: "/images/icons/mac.png",
    steps: [
      { text: "Finder → Go → Go to Folder → Type:", code: "/private/etc/hosts" },
      { text: "Copy 'hosts' to Desktop → Add lines:", code: "157.66.54.50 www.growtopia1.com\n157.66.54.50 www.growtopia2.com", isMultiLine: true },
      { text: "Save → Drag back to folder → Authenticate." }
    ]
  }
]

const CodeSnippet = ({ code, isMultiLine }: { code: string, isMultiLine?: boolean }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group mt-2">
      <div className={`
        bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-sm text-orange-400/90 shadow-inner backdrop-blur-sm
        ${isMultiLine ? "whitespace-pre-line leading-relaxed" : "whitespace-nowrap overflow-x-auto"}
      `}>
        {code}
      </div>
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        title="Copy"
      >
        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  )
}

const LazyVideoPlayer = ({ 
  src, 
  onPlaySignal, 
  onPauseSignal 
}: { 
  src: string, 
  onPlaySignal: () => void, 
  onPauseSignal: () => void 
}) => {
  const [isLoaded, setIsLoaded] = useState(false) 
  const [isBuffering, setIsBuffering] = useState(true) 
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleLoadClick = () => {
    setIsLoaded(true)
    // onPlaySignal will be triggered by onPlay event from video element
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black group/video transform-gpu">
      
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm z-20">
          <div className="absolute inset-0 bg-[url('/images/logo/garudaps.jpg')] bg-cover opacity-20 grayscale" />
          
          <button 
            onClick={handleLoadClick}
            className="relative group/btn flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:scale-110 hover:bg-orange-600 hover:border-orange-500 transition-all duration-300 cursor-pointer z-30"
          >
            <Play className="w-8 h-8 text-white fill-white translate-x-1" />
            
            <span className="absolute -inset-2 rounded-full border border-white/10 animate-ping opacity-50 pointer-events-none" />
          </button>
          
          <span className="mt-4 text-xs font-mono text-white/50 uppercase tracking-widest relative z-30">
            Click to Load Tutorial
          </span>
        </div>
      )}

      {isLoaded && (
      <>
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-[2px]">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
          </div>
        )}

        <video
          ref={videoRef}
          src={src}
          controls={!isBuffering} 
          autoPlay 
          className="w-full h-full object-contain bg-black"
          onPlay={onPlaySignal}
          onPause={onPauseSignal}
          onEnded={onPauseSignal}
          
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onCanPlay={() => setIsBuffering(false)}
        />
      </>
    )}
    </div>
  )
}

export default function TutorialSection() {
  const [activeTab, setActiveTab] = useState("apk")
  const activeContent = TUTORIAL_DATA.find(t => t.id === activeTab) || TUTORIAL_DATA[0]
  
  const hasVideo = !!activeContent.videoSrc;

  const handleVideoPlay = useCallback(() => {
    // Matikan BGM saat video play
    const event = new CustomEvent("garuda-bgm-control", { detail: { action: "pause" } });
    window.dispatchEvent(event);
  }, []);

  const handleVideoPause = useCallback(() => {
    // Nyalakan BGM saat video pause
    const event = new CustomEvent("garuda-bgm-control", { detail: { action: "play" } });
    window.dispatchEvent(event);
  }, []);

  return (
    <section id="tutorial" className="relative py-24 bg-[#0a0a0a] overflow-hidden">
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
          {/* Blur dikurangi di mobile */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-200 md:h-200 bg-orange-600/10 blur-3xl md:blur-[150px] rounded-full transform-gpu" />
      </div>

      <div className="absolute top-0 left-0 w-full h-32 md:h-40 bg-linear-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-40 bg-linear-to-t from-black to-transparent z-10 pointer-events-none" />

      <div className="container relative z-10 px-4 mx-auto">
        
        {/* SECTION TITLE */}
        <div className="text-center mb-16 relative">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
          >
            How To <span className="animate-gradient-text border-b-4 border-orange-500 pb-1">Play</span>
          </motion.h2>
          <p className="text-white/40 mt-8 max-w-xl mx-auto">
            Select your device below to access the secure connection gateway.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          
          {/* TAB BUTTONS */}
          <div className="flex overflow-x-auto pb-4 md:pb-0 md:justify-center gap-2 mb-8 p-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm relative z-20 scrollbar-hide">
            {TUTORIAL_DATA.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-4 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 group will-change-transform shrink-0
                  ${activeTab === tab.id ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20" : "hover:bg-white/5 text-white/50 hover:text-white"}
                `}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : tab.color}`} />
                <span className="text-sm font-bold whitespace-nowrap">{tab.label}</span>
                
                {/* Indikator video */}
                {tab.videoSrc && (
                  <span className={`ml-1 flex h-2 w-2 relative ${activeTab === tab.id ? 'opacity-100' : 'opacity-50'}`}>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* CONTENT CARD */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-[30px] border border-white/5 shadow-2xl backdrop-blur-xl bg-black/20 transform-gpu will-change-transform"
            >
              <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay" />

              {/* Window Controls Header */}
              <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-md relative z-10">
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                 </div>
                 <div className="flex items-center gap-2">
                    {hasVideo && (
                       <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold uppercase tracking-wide">
                          <Video className="w-3 h-3" /> Video Available
                       </span>
                    )}
                    <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest hidden md:block">
                        GarudaPS_Protocol // {activeContent.label}
                    </div>
                 </div>
              </div>

              <div className="p-6 md:p-10 relative z-10">
                
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-10`}>
                  
                  {/* LEFT COLUMN: INFO & ICON */}
                  <div className="flex flex-col items-center lg:items-start lg:border-r border-white/5 pr-0 lg:pr-10">
                     <div className="flex flex-col items-center justify-center w-full sticky top-0">
                        <div className="relative w-32 h-32 mb-6 group">
                            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full animate-pulse" />
                            <Image 
                              src={activeContent.imageSrc} 
                              alt={activeContent.label} 
                              fill 
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-contain relative z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg text-center">
                            {activeContent.label}
                        </h3>
                        <div className="mt-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-green-400 uppercase tracking-widest backdrop-blur-md">
                            Status: Compatible
                        </div>
                        
                        {hasVideo && (
                           <p className="mt-6 text-xs text-white/40 text-center max-w-50">
                              Tutorial video is available. Watch it on the right side.
                           </p>
                        )}
                     </div>
                  </div>

                  {/* RIGHT CONTENT AREA */}
                  <div className="lg:col-span-2 flex flex-col gap-10">
                     
                     <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                           <Command className="w-5 h-5 text-orange-500" />
                           <h4 className="text-lg font-bold text-white tracking-wide">Instruction Manual</h4>
                        </div>

                        {activeContent.steps.map((step, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex gap-4 group"
                            >
                              <div className="shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 font-mono font-bold text-sm group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-lg">
                                  {idx + 1}
                              </div>
                              <div className="flex-1">
                                  <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed drop-shadow-md">
                                    {step.text}
                                  </p>
                                  {step.code && <CodeSnippet code={step.code} isMultiLine={step.isMultiLine} />}
                                  {step.link && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="mt-3 border-orange-500/30 bg-orange-500/5 text-orange-400 hover:bg-orange-500 hover:text-white transition-all backdrop-blur-sm"
                                      onClick={() => window.open(step.link, "_blank")}
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      {step.isDownload ? "Download File" : "Download App"}
                                    </Button>
                                  )}
                              </div>
                            </motion.div>
                        ))}
                     </div>

                     {/* VIDEO PLAYER */}
                     {hasVideo && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="pt-8 border-t border-white/5"
                        >
                           <div className="flex items-center gap-2 mb-4">
                              <Video className="w-5 h-5 text-red-500" />
                              <h4 className="text-lg font-bold text-white tracking-wide">Video Walkthrough</h4>
                           </div>
                           
                           <LazyVideoPlayer 
                              key={activeTab} 
                              src={activeContent.videoSrc!} 
                              onPlaySignal={handleVideoPlay}
                              onPauseSignal={handleVideoPause}
                           />

                        </motion.div>
                     )}
                  </div>

                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-orange-500/30 to-transparent" />
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  )
}