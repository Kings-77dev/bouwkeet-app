/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Camera, CheckCircle, XCircle, Loader2, Zap, ArrowLeft, Send, Search, Settings } from 'lucide-react';

// --- CUSTOM LOGO COMPONENT ---
// Replaces the generic icon with the provided SVG path data
const LogoIcon = ({ className = "h-6 w-6 mr-2 text-black" }) => (
    // Color is controlled by className (e.g., text-black)
    <svg className={className} viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 7.322L42.677 0H2.441L0 2.441v45.119L2.441 50h40.237L50 42.677V28.661L46.339 25 50 21.339V7.322zm-29.777 21.4h1.388v2.99c0 .722.215 1.003.787 1.003.656 0 1.003-.347 1.003-1.303v-2.69h1.388v4.996h-1.331l.009-.703c-.328.469-.75.815-1.528.815-1.153 0-1.715-.647-1.715-1.903v-3.206zm-4.002-.135v1.167c-.411.13-.77.514-.77 1.47 0 .821.282 1.309.77 1.472v1.173c-1.377-.167-2.186-1.197-2.186-2.645 0-1.412.768-2.473 2.186-2.637h0zm-8.027 5.131h1.33v-6.74h-1.33v6.74zm3.047 7.883l-1.153-2.1-.534.562v1.537H8.222V34.88h1.331v3.599l1.584-1.856h1.669l-1.734 1.922 1.8 3.056H11.24zm-.234-7.752c-.292 0-.528-.039-.736-.124v-1.054a1.11 1.11 0 0 0 .361.063c.571 0 1.031-.45 1.031-1.425 0-1.059-.375-1.509-1.078-1.509-.115 0-.218.019-.314.047v-1.095c.206-.091.442-.142.717-.142 1.219 0 2.1.947 2.1 2.55 0 1.809-.928 2.691-2.081 2.691h0zm4.609 3.723a.88.88 0 0 0-.849.537c-.134.236-.224.559-.224 1.006 0 .565.086.969.354 1.237.184.2.451.319.804.319.347 0 .723-.122.883-.517h1.399c-.085.874-.892 1.615-2.292 1.615-1.164 0-2.451-.686-2.451-2.629 0-1.681.995-2.677 2.366-2.677 1.512 0 2.442.911 2.385 3.005h-2.629v-.883h1.23c-.028-.619-.366-1.014-.977-1.014h0zm1.353-3.694v-1.175c.502-.159.808-.668.808-1.46 0-.849-.316-1.337-.808-1.489v-1.163c1.422.142 2.223 1.127 2.223 2.652 0 1.42-.754 2.491-2.223 2.635h0zm4.469 3.694a.88.88 0 0 0-.85.537c-.134.236-.224.559-.224 1.006 0 .565.086.969.353 1.237.184.2.451.319.805.319.347 0 .723-.122.883-.517h1.399c-.085.874-.892 1.615-2.291 1.615-1.165 0-2.451-.686-2.451-2.629 0-1.681.995-2.677 2.366-2.677 1.512 0 2.442.911 2.386 3.005h-2.629v-.883h1.23c-.029-.619-.367-1.014-.977-1.014h0zm5.987.036h-.815v2.578c0 .412.093.469.562.469l.253-.009v1.012l-.619.009c-1.106 0-1.538-.235-1.538-1.012v-3.047h-.693v-.947h.693v-1.406h1.341v1.406h.815v.947zm4.2-3.89h-1.529l-.628-3.265-.627 3.265h-1.547l-1.397-4.996h1.443l.759 3.552.703-3.552h1.359l.741 3.562.759-3.562h1.406l-1.443 4.996z" fill="currentColor"></path>
    </svg>
);


// --- CONSTANTS & DATA ---
const PRIMARY_COLOR = 'rgb(191, 217, 219)'; // R 191 G 217 B 219 (General accent/light border)

const SCAN_STATE = {
  IDLE: 'IDLE',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const ERROR_MESSAGES = [
  "Data Integrity Error: Two stickers detected in 'Curiosity' row. Please check page.",
  "Alignment Failure: QR code edges are obscured. Realign booklet and try again.",
  "Data Mismatch: Booklet ID 42 does not match existing session data. Check student name.",
];

// PROGRAMS data updated to have 6 workshops. Workshop 3 and 6 include (Reflection Day).
const PROGRAMS = [
    { 
        id: 'textile', 
        name: 'Textile', 
        color: 'rgb(251, 202, 48)', // R 251 G 202 B 48 (Bright Yellow)
        imagePath: '/Textile.png', 
        workshops: [
            'W1: Intro to Fabric', 
            'W2: Simple Stitching', 
            'W3: Pattern Making (Reflection Day)', 
            'W4: Dyes & Prints', 
            'W5: Advanced Techniques',
            'W6: Final Project (Reflection Day)'
        ] 
    },
    { 
        id: 'metal', 
        name: 'Metal Work', 
        color: 'rgb(0, 124, 177)', // R 0 G 124 B 177
        imagePath: '/Metal.png', 
        workshops: [
            'W1: Sheet Metal', 
            'W2: Bending', 
            'W3: Soldering & Brazing (Reflection Day)', 
            'W4: Safety & Cleanup', 
            'W5: Finishing & Polishing',
            'W6: Final Project (Reflection Day)'
        ] 
    },
    { 
        id: 'ceramics', 
        name: 'Ceramics', 
        color: 'rgb(2, 131, 81)', // R 2 G 131 B 81
        imagePath: '/ceramics.png', 
        workshops: [
            'W1: Hand Building', 
            'W2: Wheel Throwing', 
            'W3: Glazing Basics (Reflection Day)', 
            'W4: Firing & Kiln Prep', 
            'W5: Advanced Forms',
            'W6: Final Project (Reflection Day)'
        ] 
    },
    { 
        id: 'wood', 
        name: 'Wood work', 
        color: 'rgb(168, 83, 119)', // R 168 G 83 B 119
        imagePath: '/wood.png', 
        workshops: [
            'W1: Intro to Wood', 
            'W2: Simple Joinery', 
            'W3: Advanced Cuts (Reflection Day)', 
            'W4: Finishes & Stains', 
            'W5: Tool Maintenance',
            'W6: Final Project (Reflection Day)'
        ] 
    },
    { 
        id: 'fablab', 
        name: 'FABLAB', 
        color: 'rgb(237, 107, 34)', // R 237 G 107 B 34
        imagePath: '/fablab.png', 
        workshops: [
            'W1: 3D Printing', 
            'W2: Laser Cutting', 
            'W3: CAD Basics (Reflection Day)', 
            'W4: Electronics & Sensors', 
            'W5: CNC Routing',
            'W6: Final Project (Reflection Day)'
        ] 
    },
];

const StudentData = {
    programId: 'metal',
    programName: 'Metal Work',
    selectedWorkshop: 'W2: Bending', // Still a valid workshop title
    reflection: 'Learning to bend a really thick piece of sheet metal was hard, but I succeeded after three tries!',
    stickers: 5,
};

// --- UTILITY COMPONENTS ---

const CameraView = () => (
  <div className="absolute inset-0 bg-gray-900 bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/800x600/1f2937/ffffff?text=Align+Booklet+Here')" }}>
    <div className="absolute inset-0 bg-black opacity-40"></div>
  </div>
);

// --- 1. WIZARD CONTROL PANEL (Hidden from User) ---

interface ControlPanelProps {
  setScanState: React.Dispatch<React.SetStateAction<(typeof SCAN_STATE)[keyof typeof SCAN_STATE]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  navigate: (path: string) => void;
  selectedProgram?: string;
}
const ControlPanel: React.FC<ControlPanelProps> = ({ setScanState, setErrorMessage, navigate, selectedProgram }) => {
  const [errorIndex, setErrorIndex] = useState(0);

  const startProcessing = () => {
    navigate('/scan');
    setScanState(SCAN_STATE.PROCESSING);
  };

  const triggerSuccess = () => {
    navigate('/scan');
    setScanState(SCAN_STATE.SUCCESS);
    setTimeout(() => setScanState(SCAN_STATE.IDLE), 3000);
  };

  const triggerError = () => {
    setErrorMessage(ERROR_MESSAGES[errorIndex]);
    navigate('/scan');
    setScanState(SCAN_STATE.ERROR);
  };
  
  const cycleError = () => {
    setErrorIndex((prev) => (prev + 1) % ERROR_MESSAGES.length);
  };
  
  const resetApp = () => {
    setScanState(SCAN_STATE.IDLE);
    setErrorMessage(ERROR_MESSAGES[0]);
    navigate('/');
  };

  return (
    <div className="p-4" style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, borderWidth: '2px', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
      <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
        <Zap className="mr-2 h-5 w-5 text-indigo-700" /> WIZARD CONTROL PANEL (WOZ)
      </h2>
      <p className="text-sm text-gray-700 mb-3">
          Simulating Scan for **{StudentData.programName}** | **{StudentData.selectedWorkshop}**
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={startProcessing}
          className="p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          1. Start Scan/Process
        </button>
        <button
          onClick={triggerSuccess}
          className="p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          2. Trigger SUCCESS
        </button>
        <button
          onClick={triggerError}
          className="p-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          3. Trigger ERROR
        </button>
        <button
          onClick={cycleError}
          className="p-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
        >
          Change Error ({errorIndex + 1}/{ERROR_MESSAGES.length})
        </button>
        <button
          onClick={resetApp}
          className="col-span-2 p-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
        >
          Reset to Program Selector
        </button>
      </div>
      <p className="mt-3 text-sm text-gray-700">
        Current Error Message: **{ERROR_MESSAGES[errorIndex]}**
      </p>
    </div>
  );
};

// --- 2. SCREENS ---

// Screen 1: Program Selector
interface ProgramSelectorProps {
    navigate: (path: string) => void;
}
const ProgramSelector: React.FC<ProgramSelectorProps> = ({ navigate }) => (
    <div className="p-6">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-900 border-b-2 pb-2" style={{borderColor: PRIMARY_COLOR}}>Select Workshop</h2>
        {/* Adjusted grid for better mobile experience and larger targets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {PROGRAMS.map(program => (
                <div 
                    key={program.id}
                    onClick={() => navigate(`/workshop/${program.id}`)}
                    className="group cursor-pointer transform hover:scale-[1.03] transition-all duration-300"
                >
                    {/* Image Tile (Border color is specific to the program) */}
                    <div
                        style={{ 
                            backgroundImage: `url(${program.imagePath})`, 
                            borderColor: program.color, 
                            borderWidth: '3px' 
                        }}
                        className={`
                            relative h-32 sm:h-36 rounded-xl shadow-xl 
                            bg-cover bg-center overflow-hidden border-2 border-transparent 
                            group-hover:shadow-2xl group-hover:shadow-gray-300 transition
                        `}
                    >
                        {/* Subtle overlay for image consistency */}
                         <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition duration-300 rounded-xl"></div>
                    </div>
                    {/* Program Name UNDER the tile */}
                    <p className="mt-2 text-center text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {program.name}
                    </p>
                </div>
            ))}
        </div>
        <div className="mt-10 text-center text-gray-700 text-sm p-4 rounded-xl border shadow-inner" style={{backgroundColor: PRIMARY_COLOR, borderColor: 'rgb(161, 187, 189)'}}>
            <Search className="inline-block h-4 w-4 mr-1"/> Search Function: Use the dashboard search bar to find a student.
        </div>
    </div>
);

// Screen 2: Workshop Detail & Reflection Input
interface WorkshopDetailProps {
    navigate: (path: string) => void;
    programId?: string;
}
const WorkshopDetail: React.FC<WorkshopDetailProps> = ({ navigate, programId }) => {
    const program = PROGRAMS.find(p => p.id === programId) || PROGRAMS[0];
    const [reflectionText, setReflectionText] = useState(StudentData.reflection);
    const [isInputOpen, setIsInputOpen] = useState(false);
    
    const defaultWorkshop = program.id === StudentData.programId ? StudentData.selectedWorkshop : program.workshops[0];
    const [selectedWorkshop, setSelectedWorkshop] = useState(defaultWorkshop);

    const workshopColor = program.color; // e.g., rgb(0, 124, 177)
    
    // --- ACCESSIBILITY FIX START ---
    // Check if the current program is 'textile' (bright yellow background)
    const isTextile = program.id === 'textile';
    
    // Set text colors dynamically for contrast
    const selectedTextColorClass = isTextile ? 'text-gray-900' : 'text-white';
    const selectedSubtextColorClass = isTextile ? 'text-gray-800' : 'text-white/90';
    
    // Set reflection box overlay dynamically for contrast
    const reflectionBoxOverlayClass = isTextile ? 'bg-black/10 border-black/30' : 'bg-white/30 border-white/50 backdrop-blur-sm';
    const reflectionTextColorClass = isTextile ? 'text-gray-900' : 'text-white';
    // --- ACCESSIBILITY FIX END ---

    return (
        <div className="p-6 h-full relative">
            <button 
                onClick={() => navigate('/')} 
                className="flex items-center text-gray-700 mb-6 hover:text-indigo-600 transition text-md font-bold"
            >
                <ArrowLeft className="h-5 w-5 mr-1" /> Back to Programs
            </button>
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{program.name}</h1>
            <p className="text-gray-600 mb-8 font-medium">Select the workshop to scan the sticker page.</p>

            {/* List of Workshops */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {program.workshops.map((workshop, index) => (
                    <div 
                        key={workshop} 
                        className={`p-4 rounded-xl border-4 transition-all duration-150 cursor-pointer 
                            ${workshop === selectedWorkshop 
                                // Apply the dynamic text color class when selected
                                ? selectedTextColorClass + ' shadow-xl scale-[1.01]' 
                                : 'bg-white border-gray-100 shadow-md hover:shadow-lg hover:border-gray-300'
                            }`}
                        // Apply specific program color to background and border for selected state
                        style={workshop === selectedWorkshop ? {backgroundColor: workshopColor, borderColor: workshopColor} : {}}
                        onClick={() => setSelectedWorkshop(workshop)}
                    >
                        {/* Use dynamic classes for text color */}
                        <h3 className={`text-xl font-bold ${workshop === selectedWorkshop ? selectedTextColorClass : 'text-gray-800'}`}>{workshop}</h3>
                        <p className={`text-sm mt-1 ${workshop === selectedWorkshop ? selectedSubtextColorClass : 'text-gray-600'}`}>
                            {index === 1 && workshop === selectedWorkshop ? 'Description: Detailed instructions for this workshop are included here.' : 'Tap to select this workshop.'}
                        </p>
                        {workshop === selectedWorkshop && (
                            // Use dynamic class for reflection box overlay and text
                             <div className={`mt-3 p-3 ${reflectionBoxOverlayClass} rounded-lg border shadow-inner`}>
                                <p className={`font-semibold ${reflectionTextColorClass} mb-2`}>Student Reflection:</p>
                                <div 
                                    className="bg-white text-gray-900 p-3 rounded-lg cursor-pointer shadow-md min-h-[50px] transition hover:bg-gray-50"
                                    onClick={() => setIsInputOpen(true)}
                                >
                                    {reflectionText || <span className="text-gray-400 italic">Tap to add reflection...</span>}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Primary Action Button (Scan) */}
            <button
                onClick={() => navigate('/scan')}
                disabled={!selectedWorkshop}
                // Retaining Indigo for the main action button for high contrast
                className={`w-full mt-8 p-4 text-white font-black text-xl rounded-xl transition-all ${selectedWorkshop 
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/70 transform hover:scale-[1.01] uppercase' 
                    : 'bg-gray-400 cursor-not-allowed shadow-none'}`}
            >
                <Camera className="inline-block h-6 w-6 mr-3" /> Start Sticker Scan
            </button>

            {/* Reflection Input Modal/Popup */}
            {isInputOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-lg mx-4 shadow-2xl border-t-8" style={{borderColor: PRIMARY_COLOR}}>
                        <h4 className="text-2xl font-bold mb-3 text-gray-800">Add Reflection for &quot;{selectedWorkshop}&quot;</h4>
                        <textarea
                            value={reflectionText}
                            onChange={(e) => setReflectionText(e.target.value)}
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none h-32 text-gray-700"
                            placeholder="e.g., Bending thick metal was challenging, but I succeeded after three attempts!"
                        />
                        <button
                            onClick={() => setIsInputOpen(false)}
                            className="w-full mt-4 p-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition flex items-center justify-center shadow-lg shadow-indigo-500/50"
                        >
                            <Send className="h-5 w-5 mr-2" /> Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Screen 3: Scanning Page (WOZ Core)
interface ScanningPageProps {
  scanState: (typeof SCAN_STATE)[keyof typeof SCAN_STATE];
  errorMessage: string;
  handleAction: (newState: (typeof SCAN_STATE)[keyof typeof SCAN_STATE]) => void;
  navigate: (path: string) => void;
  programId: string; // ADDED: programId is required to navigate back correctly
}

const ScanningPage: React.FC<ScanningPageProps> = ({ scanState, errorMessage, handleAction, navigate, programId }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let showTimer: number | undefined;
    let navTimer: number | undefined;

    if (scanState === SCAN_STATE.SUCCESS || scanState === SCAN_STATE.ERROR) {
      // schedule showPopup asynchronously to avoid synchronous setState in effect body
      showTimer = window.setTimeout(() => setShowPopup(true), 0);

      if (scanState === SCAN_STATE.SUCCESS) {
        navTimer = window.setTimeout(() => navigate(`/workshop/${StudentData.programId}`), 2500);
      }
    } else {
      // hide popup asynchronously as well
      showTimer = window.setTimeout(() => setShowPopup(false), 0);
    }

    return () => {
      if (showTimer) window.clearTimeout(showTimer);
      if (navTimer) window.clearTimeout(navTimer);
    };
  }, [scanState, navigate]);

  let overlayContent = null;
  let boundingBoxColor = 'border-white';
  let boundingBoxText = 'Align Booklet Here';

  if (scanState === SCAN_STATE.PROCESSING) {
    boundingBoxColor = 'border-indigo-400 animate-pulse';
    boundingBoxText = 'Processing Data... Hold Still';
    overlayContent = (
      <div className="flex flex-col items-center p-6 bg-black bg-opacity-70 rounded-xl shadow-2xl">
        <Loader2 className="animate-spin text-indigo-400 h-10 w-10 mb-4" />
        <p className="text-white font-semibold text-lg">Analyzing Sticker Positions (4/5)</p>
        <p className="text-sm text-gray-300 mt-1">Simulating complex image processing...</p>
      </div>
    );
  } else if (scanState === SCAN_STATE.IDLE) {
    boundingBoxColor = 'border-white';
  }
  
  // Handler for going back to the Workshop Detail page
  const handleBack = () => {
      // Navigate back to the workshop detail page using the current programId
      navigate(`/workshop/${programId}`);
  };


  // Bounding Box (Visible in IDLE/PROCESSING)
  const BoundingBox = () => (
    <div className="relative w-4/5 h-4/5 max-w-lg max-h-lg flex flex-col items-center justify-center">
      <div className={`w-full h-full border-4 ${boundingBoxColor} rounded-xl transition-all duration-500 flex items-center justify-center`}>
        {scanState === SCAN_STATE.IDLE && (
            <button 
                onClick={() => handleAction(SCAN_STATE.PROCESSING)}
                className="p-4 text-gray-900 font-black text-xl rounded-full shadow-2xl hover:bg-white/90 transition flex items-center transform hover:scale-105"
                style={{backgroundColor: PRIMARY_COLOR, boxShadow: `0 10px 15px -3px ${PRIMARY_COLOR}80`}}
            >
                <Camera className="mr-2 h-6 w-6" /> Tap to Scan
            </button>
        )}
        {scanState === SCAN_STATE.PROCESSING && overlayContent}
      </div>
      <p className="mt-4 text-white text-xl font-black drop-shadow-lg p-2 bg-black bg-opacity-50 rounded-lg">{boundingBoxText}</p>
    </div>
  );

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Back Button (Only visible when IDLE) */}
      {scanState === SCAN_STATE.IDLE && (
          <button 
              onClick={handleBack}
              className="absolute top-4 left-4 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all z-10 flex items-center shadow-lg"
              aria-label="Go back to workshop details"
          >
              <ArrowLeft className="h-5 w-5 mr-1" /> 
          </button>
      )}

      {/* Background (Simulated Camera Feed) */}
      <CameraView />
      
      {/* Bounding Box Overlay for IDLE and PROCESSING */}
      {scanState !== SCAN_STATE.SUCCESS && scanState !== SCAN_STATE.ERROR && <BoundingBox />}

      {/* SUCCESS POPUP (High-Fi version) */}
      {scanState === SCAN_STATE.SUCCESS && showPopup && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-md bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-green-500 text-center animate-fade-in">
          <CheckCircle className="text-green-500 h-16 w-16 mx-auto mb-4 animate-bounce-once" />
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Scan Complete!</h1>
          <p className="text-gray-600">The reflection and stickers have been saved and synchronized.</p>
          <button
              onClick={() => navigate(`/workshop/${StudentData.programId}`)}
              className="mt-6 p-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition w-full shadow-green-500/40"
          >
              Done / Back to Workshop
          </button>
        </div>
      )}

      {/* ERROR POPUP (High-Fi version) */}
      {scanState === SCAN_STATE.ERROR && showPopup && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-md bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-red-500 text-center animate-fade-in">
          <XCircle className="text-red-500 h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-800 mb-3">Scan Failed!</h1>
          <p className="text-red-700 font-medium text-lg mb-6 border-b pb-4 border-red-100">
            {errorMessage}
          </p>
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => handleAction(SCAN_STATE.PROCESSING)} // User tries again
              className="p-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition shadow-red-500/40"
            >
              RESCAN (Check & Correct)
            </button>
            <button 
              onClick={() => handleAction(SCAN_STATE.SUCCESS)} // User chooses manual override
              className="p-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition text-sm mt-2"
            >
              Manual Override / Proceed Anyway
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


// --- MAIN APPLICATION COMPONENT ---

const App = () => {
  const [scanState, setScanState] = useState(SCAN_STATE.IDLE);
  const [errorMessage, setErrorMessage] = useState(ERROR_MESSAGES[0]);
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [programId, setProgramId] = useState(StudentData.programId);

  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    const parts = path.split('/');
    if (parts[1] === 'workshop' && parts[2]) {
        setProgramId(parts[2]);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'wizard') {
      setIsWizardMode(true);
    }
    // Set initial path based on URL, if deep linked
    if (window.location.hash) {
        setCurrentPath(window.location.hash.substring(1));
    }
  }, []);
  
  // Update browser hash to support simple back/forward navigation within the single-page app structure
  useEffect(() => {
    window.location.hash = currentPath;
  }, [currentPath]);


  type ScanStateKey = (typeof SCAN_STATE)[keyof typeof SCAN_STATE];

  interface HandleUserAction {
    (newState: ScanStateKey): void | (() => void);
  }

  const handleUserAction = useCallback<HandleUserAction>((newState: ScanStateKey) => {
    if (newState === SCAN_STATE.PROCESSING) {
      setScanState(SCAN_STATE.PROCESSING);

      const timer: number = window.setTimeout(() => {
        setScanState(currentState =>
          currentState === SCAN_STATE.PROCESSING ? SCAN_STATE.SUCCESS : currentState
        );
      }, 4000);
      return () => clearTimeout(timer);

    } else if (newState === SCAN_STATE.SUCCESS) {
      setScanState(SCAN_STATE.SUCCESS);
    }
  }, []);

  let content;

  const pathParts = currentPath.split('/');

  switch (pathParts[1]) {
    case 'workshop':
        content = <WorkshopDetail navigate={navigate} programId={pathParts[2] || programId} />;
        break;
    case 'scan':
        // Pass the current programId to the ScanningPage component
        content = <ScanningPage scanState={scanState} errorMessage={errorMessage} handleAction={handleUserAction} navigate={navigate} programId={programId} />;
        break;
    case '': 
    default:
        content = <ProgramSelector navigate={navigate} />;
        break;
  }

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen font-sans antialiased">
      
      {/* Header Bar: Changed back to a light background (bg-gray-100) to show the black logo. */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-xl shadow-lg border-b-4 mb-6" style={{borderColor: PRIMARY_COLOR}}>
        <h1 className="text-2xl font-black text-gray-900 flex items-center">
            {/* Custom Logo Component is now black */}
            <LogoIcon className="h-7 w-7 mr-2 text-black" /> 
            <span className="hidden sm:inline">BOUWKEET TRACKER</span>
            <span className="sm:hidden">TRACKER</span>
        </h1>
        <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-gray-700 hidden sm:inline">Student ID: 42</span>
            <button className="text-gray-700 hover:text-indigo-600 transition p-2 rounded-full hover:bg-gray-200"><Settings className="h-5 w-5" /></button>
        </div>
      </div>

      {isWizardMode && (
        <ControlPanel 
          setScanState={setScanState} 
          setErrorMessage={setErrorMessage}
          navigate={navigate}
          selectedProgram={StudentData.programName}
        />
      )}

      {/* Main Content Card (Simulates Tablet View) - Uses custom primary color for border */}
      <div className="mt-8 bg-gray-50 max-w-xl mx-auto rounded-3xl shadow-2xl border-4 overflow-hidden" style={{borderColor: PRIMARY_COLOR}}>
        {content}
      </div>


      <footer className="mt-10 text-center text-sm text-gray-500">
        <p className="mb-2">BKT App State: <span className={`font-semibold p-1 rounded-md 
          ${scanState === SCAN_STATE.IDLE && 'text-gray-600 bg-gray-200'}
          ${scanState === SCAN_STATE.PROCESSING && 'text-blue-600 bg-blue-100'}
          ${scanState === SCAN_STATE.SUCCESS && 'text-green-600 bg-green-100'}
          ${scanState === SCAN_STATE.ERROR && 'text-red-600 bg-red-100'}
        `}>{scanState}</span></p>
        {isWizardMode && <p className="mt-2 text-xs text-indigo-700">Accessing Wizard Control Panel. Remove `?mode=wizard` from URL for user view.</p>}
      </footer>
    </div>
  );
};

export default App;
