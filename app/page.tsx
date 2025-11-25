/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Camera,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  ArrowLeft,
  Search,
  Settings,
  Users,
  Star, 
  BookOpen, // New icon for booklet/stickers
} from "lucide-react";

// --- CUSTOM LOGO COMPONENT ---
const LogoIcon = ({ className = "h-6 w-6 mr-2 text-black" }) => (
  <svg
    className={className}
    viewBox="0 0 50 50"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 7.322L42.677 0H2.441L0 2.441v45.119L2.441 50h40.237L50 42.677V28.661L46.339 25 50 21.339V7.322zm-29.777 21.4h1.388v2.99c0 .722.215 1.003.787 1.003.656 0 1.003-.347 1.003-1.303v-2.69h1.388v4.996h-1.331l.009-.703c-.328.469-.75.815-1.528.815-1.153 0-1.715-.647-1.715-1.903v-3.206zm-4.002-.135v1.167c-.411.13-.77.514-.77 1.47 0 .821.282 1.309.77 1.472v1.173c-1.377-.167-2.186-1.197-2.186-2.645 0-1.412.768-2.473 2.186-2.637h0zm-8.027 5.131h1.33v-6.74h-1.33v6.74zm3.047 7.883l-1.153-2.1-.534.562v1.537H8.222V34.88h1.331v3.599l1.584-1.856h1.669l-1.734 1.922 1.8 3.056H11.24zm-.234-7.752c-.292 0-.528-.039-.736-.124v-1.054a1.11 1.11 0 0 0 .361.063c.571 0 1.031-.45 1.031-1.425 0-1.059-.375-1.509-1.078-1.509-.115 0-.218.019-.314.047v-1.095c.206-.091.442-.142.717-.142 1.219 0 2.1.947 2.1 2.55 0 1.809-.928 2.691-2.081 2.691h0zm4.609 3.723a.88.88 0 0 0-.849.537c-.134.236-.224.559-.224 1.006 0 .565.086.969.354 1.237.184.2.451.319.804.319.347 0 .723-.122.883-.517h1.399c-.085.874-.892 1.615-2.292 1.615-1.164 0-2.451-.686-2.451-2.629 0-1.681.995-2.677 2.366-2.677 1.512 0 2.442.911 2.385 3.005h-2.629v-.883h1.23c-.028-.619-.366-1.014-.977-1.014h0zm1.353-3.694v-1.175c.502-.159.808-.668.808-1.46 0-.849-.316-1.337-.808-1.489v-1.163c1.422.142 2.223 1.127 2.223 2.652 0 1.42-.754 2.491-2.223 2.635h0zm4.469 3.694a.88.88 0 0 0-.85.537c-.134.236-.224.559-.224 1.006 0 .565.086.969.353 1.237.184.2.451.319.805.319.347 0 .723-.122.883-.517h1.399c-.085.874-.892 1.615-2.291 1.615-1.165 0-2.451-.686-2.451-2.629 0-1.681.995-2.677 2.366-2.677 1.512 0 2.442.911 2.386 3.005h-2.629v-.883h1.23c-.029-.619-.367-1.014-.977-1.014h0zm5.987.036h-.815v2.578c0 .412.093.469.562.469l.253-.009v1.012l-.619.009c-1.106 0-1.538-.235-1.538-1.012v-3.047h-.693v-.947h.693v-1.406h1.341v1.406h.815v.947zm4.2-3.89h-1.529l-.628-3.265-.627 3.265h-1.547l-1.397-4.996h1.443l.759 3.552.703-3.552h1.359l.741 3.562.759-3.562h1.406l-1.443 4.996z"
      fill="currentColor"
    ></path>
  </svg>
);

// --- CONSTANTS & DATA ---
const PRIMARY_COLOR = "rgb(191, 217, 219)"; 

const SCAN_STATE = {
  IDLE: "IDLE",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

// Constant to define the two camera modes
const SCAN_MODE = {
  STICKERS: 'STICKERS',
  HARD_SKILL: 'HARD_SKILL',
} as const;

const ERROR_MESSAGES = [
  "Data Integrity Error: Two stickers detected in 'Curiosity' row. Please check page.",
  "Alignment Failure: QR code edges are obscured. Realign booklet and try again.",
  "Data Mismatch: Booklet ID 42 does not match existing session data. Check student name.",
];

// PROGRAMS data (Unchanged)
const PROGRAMS = [
  {
    id: "textile",
    name: "Textile",
    color: "rgb(251, 202, 48)",
    imagePath: "/Textile.png",
    workshops: [
      "W1: Intro to Fabric",
      "W2: Simple Stitching",
      "W3: Pattern Making (Reflection Day)",
      "W4: Dyes & Prints",
      "W5: Advanced Techniques",
      "W6: Final Project (Reflection Day)",
    ],
  },
  {
    id: "metal",
    name: "Metal Work",
    color: "rgb(0, 124, 177)",
    imagePath: "/Metal.png",
    workshops: [
      "W1: Sheet Metal",
      "W2: Bending",
      "W3: Soldering & Brazing (Reflection Day)",
      "W4: Safety & Cleanup",
      "W5: Finishing & Polishing",
      "W6: Final Project (Reflection Day)",
    ],
  },
  {
    id: "ceramics",
    name: "Ceramics",
    color: "rgb(2, 131, 81)",
    imagePath: "/ceramics.png",
    workshops: [
      "W1: Hand Building",
      "W2: Wheel Throwing",
      "W3: Glazing Basics (Reflection Day)",
      "W4: Firing & Kiln Prep",
      "W5: Advanced Forms",
      "W6: Final Project (Reflection Day)",
    ],
  },
  {
    id: "wood",
    name: "Wood work",
    color: "rgb(168, 83, 119)",
    imagePath: "/wood.png",
    workshops: [
      "W1: Intro to Wood",
      "W2: Simple Joinery",
      "W3: Advanced Cuts (Reflection Day)",
      "W4: Finishes & Stains",
      "W5: Tool Maintenance",
      "W6: Final Project (Reflection Day)",
    ],
  },
  {
    id: "fablab",
    name: "FABLAB",
    color: "rgb(237, 107, 34)",
    imagePath: "/fablab.png",
    workshops: [
      "W1: 3D Printing",
      "W2: Laser Cutting",
      "W3: CAD Basics (Reflection Day)",
      "W4: Electronics & Sensors",
      "W5: CNC Routing",
      "W6: Final Project (Reflection Day)",
    ],
  },
];

// --- STUDENT DATA (Mocked with new status fields) ---
interface Student {
  id: number;
  name: string;
  studentNumber: string;
  bookletRecorded: boolean;
  hardSkillsRecorded: boolean;
}

const STUDENTS_DATA: Student[] = [
  { id: 1, name: "Liam O'Connell", studentNumber: "2024001", bookletRecorded: true, hardSkillsRecorded: false },
  { id: 2, name: "Emma Wang", studentNumber: "2024002", bookletRecorded: false, hardSkillsRecorded: true },
  { id: 3, name: "Noah Schmidt", studentNumber: "2024003", bookletRecorded: true, hardSkillsRecorded: true },
  { id: 4, name: "Olivia Dubois", studentNumber: "2024004", bookletRecorded: false, hardSkillsRecorded: false },
  { id: 5, name: "William Kim", studentNumber: "2024005", bookletRecorded: true, hardSkillsRecorded: false },
  { id: 6, name: "Ava Torres", studentNumber: "2024006", bookletRecorded: false, hardSkillsRecorded: true },
  { id: 7, name: "James Patel", studentNumber: "2024007", bookletRecorded: false, hardSkillsRecorded: false },
  { id: 8, name: "Isabella Rossi", studentNumber: "2024008", bookletRecorded: false, hardSkillsRecorded: false },
  { id: 9, name: "Benjamin Chen", studentNumber: "2024009", bookletRecorded: false, hardSkillsRecorded: false },
  { id: 10, name: "Sophia Miller", studentNumber: "2024010", bookletRecorded: false, hardSkillsRecorded: false },
];

// Default value for a non-selected student
const UNSELECTED_STUDENT: Student = {
    id: 0,
    name: "N/A",
    studentNumber: "N/A",
    bookletRecorded: false,
    hardSkillsRecorded: false,
};
// --- END DATA ---

// --- UTILITY COMPONENTS ---

const CameraStream = ({
  videoRef,
  onError,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onError: (message: string) => void;
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const videoElement = videoRef.current;

    const startCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera access not supported by this browser.");
        onError("Camera access not supported by this browser.");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoElement) {
          videoElement.srcObject = stream;
          try {
            await videoElement.play();
            setIsCameraActive(true);
            setCameraError(null);
          } catch (e: any) {
            if (e.name === "AbortError") {
              console.warn("Video playback was interrupted by a new load request (AbortError). This is often safe to ignore.");
              setIsCameraActive(true); 
              setCameraError(null);
            } else {
              throw e;
            }
          }
        }
      } catch (err: any) {
        const errorMsg =
          err.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access in your browser settings."
            : "Failed to access camera. Is it already in use?";
        setCameraError(errorMsg);
        onError(errorMsg);
        console.error("Camera access error:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoRef, onError]);

  if (cameraError) {
    return (
      <div className="absolute inset-0 bg-red-900 flex items-center justify-center p-4">
        <div className="text-center text-white p-4 bg-black/70 rounded-lg">
          <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="font-bold mb-1">Camera Error</p>
          <p className="text-sm">{cameraError}</p>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
        isCameraActive ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: isCameraActive ? "transparent" : "#1f2937" }}
    />
  );
};

// --- WIZARD CONTROL PANEL (Unchanged) ---

interface ControlPanelProps {
  setScanState: React.Dispatch<
    React.SetStateAction<(typeof SCAN_STATE)[keyof typeof SCAN_STATE]>
  >;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  navigate: (path: string) => void;
}
const ControlPanel: React.FC<ControlPanelProps> = ({
  setScanState,
  setErrorMessage,
  navigate,
}) => {
  const [errorIndex, setErrorIndex] = useState(0);
  
  const MOCK_PROGRAM_DATA = {
    programName: "Metal Work",
    selectedWorkshop: "W2: Bending",
  };

  const startProcessing = () => {
    navigate("/scan");
    setScanState(SCAN_STATE.PROCESSING);
  };

  const triggerSuccess = () => {
    navigate("/scan");
    setScanState(SCAN_STATE.SUCCESS);
  };

  const triggerError = () => {
    setErrorMessage(ERROR_MESSAGES[errorIndex]);
    navigate("/scan");
    setScanState(SCAN_STATE.ERROR);
  };

  const cycleError = () => {
    setErrorIndex((prev) => (prev + 1) % ERROR_MESSAGES.length);
  };

  const resetApp = () => {
    setScanState(SCAN_STATE.IDLE);
    setErrorMessage(ERROR_MESSAGES[0]);
    navigate("/");
  };

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
        borderWidth: "2px",
        borderRadius: "0.75rem",
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
        <Zap className="mr-2 h-5 w-5 text-indigo-700" /> WIZARD CONTROL PANEL
        (WOZ)
      </h2>
      <p className="text-sm text-gray-700 mb-3">
        Simulating Scan for **{MOCK_PROGRAM_DATA.programName}** | **
        {MOCK_PROGRAM_DATA.selectedWorkshop}**
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

// Screen 1: Program Selector
interface ProgramSelectorProps {
  navigate: (path: string) => void;
}
const ProgramSelector: React.FC<ProgramSelectorProps> = ({ navigate }) => {
  return (
    <div className="p-6">
      <h2
        className="text-3xl font-extrabold mb-8 text-gray-900 border-b-2 pb-2"
        style={{ borderColor: PRIMARY_COLOR }}
      >
        Select Workshop Program
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {PROGRAMS.map((program) => (
          <div
            key={program.id}
            onClick={() => navigate(`/workshop/${program.id}`)}
            className="group cursor-pointer transform hover:scale-[1.03] transition-all duration-300"
          >
            <div
              style={{
                backgroundImage: `url(${program.imagePath})`,
                borderColor: program.color,
                borderWidth: "3px",
              }}
              className={`
                                    relative h-32 sm:h-36 rounded-xl shadow-xl 
                                    bg-cover bg-center overflow-hidden border-2 border-transparent 
                                    group-hover:shadow-2xl group-hover:shadow-gray-300 transition
                                `}
            >
              <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition duration-300 rounded-xl"></div>
            </div>
            <p className="mt-2 text-center text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {program.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Screen 2: Workshop Detail & Description View
interface WorkshopDetailProps {
  navigate: (path: string) => void;
  programId?: string;
  setWorkshopData: (workshopName: string) => void;
  selectedWorkshop: string;
}
const WorkshopDetail: React.FC<WorkshopDetailProps> = ({
  navigate,
  programId,
  setWorkshopData,
  selectedWorkshop,
}) => {
  const program = PROGRAMS.find((p) => p.id === programId) || PROGRAMS[0];
  
  const [localSelectedWorkshop, setLocalSelectedWorkshop] = useState(selectedWorkshop);
  const [reflectionText, setReflectionText] = useState("Learning to bend a really thick piece of sheet metal was hard, but I succeeded after three tries.");
  const [isInputOpen, setIsInputOpen] = useState(false);

  const workshopColor = program.color;

  const isTextile = program.id === "textile";
  const selectedTextColorClass = isTextile ? "text-gray-900" : "text-white";
  const selectedSubtextColorClass = isTextile
    ? "text-gray-800"
    : "text-white/90";
  const reflectionBoxOverlayClass = isTextile
    ? "bg-black/10 border-black/30"
    : "bg-white/30 border-white/50 backdrop-blur-sm";
  const reflectionTextColorClass = isTextile ? "text-gray-900" : "text-white";

  useEffect(() => {
    setWorkshopData(localSelectedWorkshop);
  }, [localSelectedWorkshop, setWorkshopData]);
  
  const handleNext = () => {
    navigate(`/student-select`);
  };

  return (
    // FIX: Outer container for flex column layout to manage scroll and sticky footer
    <div className="h-full flex flex-col"> 
      
      {/* Scrollable Content Area (Header + List) */}
      <div className="p-6 overflow-y-auto flex-grow"> 
          
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-700 mb-6 hover:text-indigo-600 transition text-md font-bold"
          >
            <ArrowLeft className="h-5 w-5 mr-1" /> Back to Programs
          </button>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {program.name}
          </h1>
          <p className="text-gray-600 mb-8 font-medium">
            Select the workshop to proceed to student selection.
          </p>

          {/* List of Workshops - Removed internal overflow/max-height, now uses parent's scroll */}
          <div className="space-y-4 pr-2 pb-4">
            {program.workshops.map((workshop, index) => (
              <div
                key={workshop}
                className={`p-4 rounded-xl border-4 transition-all duration-150 cursor-pointer 
                                ${
                                  workshop === localSelectedWorkshop
                                    ? selectedTextColorClass +
                                      " shadow-xl scale-[1.01]"
                                    : "bg-white border-gray-100 shadow-md hover:shadow-lg hover:border-gray-300"
                                }`}
                style={
                  workshop === localSelectedWorkshop
                    ? { backgroundColor: workshopColor, borderColor: workshopColor }
                    : {}
                }
                onClick={() => setLocalSelectedWorkshop(workshop)}
              >
                <h3
                  className={`text-xl font-bold ${
                    workshop === localSelectedWorkshop
                      ? selectedTextColorClass
                      : "text-gray-800"
                  }`}
                >
                  {workshop}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    workshop === localSelectedWorkshop
                      ? selectedSubtextColorClass
                      : "text-gray-600"
                  }`}
                >
                  {index === 1 && workshop === localSelectedWorkshop
                    ? "Detailed instructions for this workshop are included here."
                    : "Tap to select this workshop."}
                </p>
                {/* Workshop Description */}
                {workshop === localSelectedWorkshop && (
                  <div
                    className={`mt-3 p-3 ${reflectionBoxOverlayClass} rounded-lg border shadow-inner`}
                  >
                    <p className={`font-semibold ${reflectionTextColorClass} mb-2`}>
                      Workshop Description:
                    </p>
                    <div className="bg-white text-gray-900 p-3 rounded-lg shadow-inner min-h-[50px]">
                      <span className="text-gray-700 italic">
                        This workshop focuses on the fundamental {program.name.toLowerCase()} skill of {workshop.split(':')[1]?.trim() || "basic assembly"}.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
      </div>
      
      {/* FIX: Floating/Sticky Footer Button Block - Always visible */}
      <div 
          className="p-6 pt-3 bg-gray-50 border-t border-gray-200 flex-shrink-0"
          style={{boxShadow: "0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.05)"}}
      >
        <button
          onClick={handleNext}
          disabled={!localSelectedWorkshop}
          className={`w-full p-4 text-white font-black text-xl rounded-xl transition-all ${
            localSelectedWorkshop
              ? "bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/70 transform hover:scale-[1.01] uppercase"
              : "bg-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          <ArrowLeft className="inline-block h-6 w-6 mr-3 transform rotate-180" /> NEXT: Select Student
        </button>
      </div>

      {/* Reflection Input Modal/Popup (Omitted for brevity, but should be outside the flex flow) */}
      {isInputOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div
            className="bg-white p-6 rounded-2xl w-full max-w-lg mx-4 shadow-2xl border-t-8"
            style={{ borderColor: PRIMARY_COLOR }}
          >
            <h4 className="text-2xl font-bold mb-3 text-gray-800">
              Add Reflection for &quot;{localSelectedWorkshop}&quot;
            </h4>
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
              Save Reflection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SCREEN 3: Student Selector (Unchanged) ---

interface StudentSelectorProps {
  navigate: (path: string) => void;
  selectedWorkshop: string;
  setStudentData: (student: Student) => void;
  programId: string;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({
  navigate,
  selectedWorkshop,
  setStudentData,
  programId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    if (searchTerm.length < 2) return STUDENTS_DATA; 

    const lowerCaseTerm = searchTerm.toLowerCase();

    return STUDENTS_DATA.filter(
      (student) =>
        student.name.toLowerCase().includes(lowerCaseTerm) ||
        student.studentNumber.includes(lowerCaseTerm)
    );
  }, [searchTerm]);
  
  const handleStudentSelect = (student: Student) => {
    setStudentData(student);
    navigate("/scan");
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(`/workshop/${programId}`)}
        className="flex items-center text-gray-700 mb-6 hover:text-indigo-600 transition text-md font-bold"
      >
        <ArrowLeft className="h-5 w-5 mr-1" /> Back to Workshop
      </button>

      <h2
        className="text-3xl font-extrabold mb-2 text-gray-900 flex items-center"
      >
        <Users className="h-7 w-7 mr-2 text-indigo-600" /> Select Student
      </h2>
      <p className="text-gray-600 mb-6 font-medium">
        Scan Sticker for: **{selectedWorkshop}**
      </p>

      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by Name or Student Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition shadow-md text-gray-900"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Results Display */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          {filteredStudents.map((student) => (
            <li
              key={student.id}
              className="flex items-center p-4 bg-white hover:bg-indigo-50 transition duration-150 flex-wrap sm:flex-nowrap justify-between" 
            >
              {/* 1. Student Info Block - Takes up available space */}
              <div className="flex-grow min-w-[150px] mr-4 mb-3 sm:mb-0"> 
                <p className="text-lg font-bold text-gray-800">
                  {student.name}
                </p>
                <p className="text-sm text-gray-500">
                  # {student.studentNumber}
                </p>
              </div>
              
              {/* 2. Recording Status Indicators - Grouped, fixed size block */}
              <div className="flex items-center space-x-4 mr-4 flex-shrink-0 mb-3 sm:mb-0">
                {/* Booklet Status (Stickers) */}
                <div title={student.bookletRecorded ? "Stickers Recorded" : "Stickers Pending"} className="flex flex-col items-center cursor-pointer">
                  <BookOpen className={`h-5 w-5 ${student.bookletRecorded ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`text-xs mt-1 font-semibold ${student.bookletRecorded ? 'text-green-700' : 'text-gray-500'}`}>
                      Stickers
                  </span>
                </div>
                
                {/* Hard Skills Status */}
                <div title={student.hardSkillsRecorded ? "Hard Skill Recorded" : "Hard Skill Pending"} className="flex flex-col items-center cursor-pointer">
                  <Star className={`h-5 w-5 fill-current ${student.hardSkillsRecorded ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <span className={`text-xs mt-1 font-semibold ${student.hardSkillsRecorded ? 'text-yellow-600' : 'text-gray-500'}`}>
                      Skill
                  </span>
                </div>
              </div>
              
              {/* 3. Action Button - W-full on mobile, auto-width on desktop for responsiveness */}
              <button
                onClick={() => handleStudentSelect(student)}
                className="flex items-center p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start" 
              >
                <Camera className="h-5 w-5 mr-2" />
                Go to Camera
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


// Screen 4: Scanning Page (Unchanged)
interface ScanningPageProps {
  scanState: (typeof SCAN_STATE)[keyof typeof SCAN_STATE];
  errorMessage: string;
  handleAction: (
    newState: (typeof SCAN_STATE)[keyof typeof SCAN_STATE]
  ) => void;
  navigate: (path: string) => void;
  selectedStudent: Student;
  selectedWorkshop: string; 
}

const ScanningPage: React.FC<ScanningPageProps> = ({
  scanState,
  errorMessage,
  handleAction,
  navigate,
  selectedStudent,
  selectedWorkshop, 
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState("");
  const [scanMode, setScanMode] = useState<(typeof SCAN_MODE)[keyof typeof SCAN_MODE]>(SCAN_MODE.STICKERS); 
  const timerRef = useRef<number | undefined>(undefined); 

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleCameraError = useCallback((message: string) => {
    setCameraPermissionError(message);
  }, []);
  
  // Function to start a scan based on mode
  const startScan = useCallback((mode: keyof typeof SCAN_MODE) => {
    if (scanState === SCAN_STATE.PROCESSING) return;

    setScanMode(mode);
    setCameraPermissionError(""); 
    handleAction(SCAN_STATE.PROCESSING); 

    const duration = 5000; 
    
    if (timerRef.current) {
        window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
        handleAction(SCAN_STATE.SUCCESS);
        timerRef.current = undefined;
    }, duration);
  }, [handleAction, scanState]);


  // Effect for handling popups and navigation (runs on state change)
  useEffect(() => {
    let showTimer: number | undefined;

    if (scanState === SCAN_STATE.SUCCESS || scanState === SCAN_STATE.ERROR) {
      showTimer = window.setTimeout(() => setShowPopup(true), 0);
    } else {
      showTimer = window.setTimeout(() => setShowPopup(false), 0);
    }
    
    return () => {
      if (showTimer) window.clearTimeout(showTimer);
    };
  }, [scanState, navigate, scanMode]); 
  
  // Effect to only clear the processing timer when the component unmounts.
  useEffect(() => {
      return () => {
          if (timerRef.current) {
              window.clearTimeout(timerRef.current);
              timerRef.current = undefined;
          }
      };
  }, []);


  let overlayContent = null;
  let boundingBoxColor = "border-white";
  let boundingBoxText = "Align Booklet Here";

  if (scanState === SCAN_STATE.PROCESSING) {
    boundingBoxColor = scanMode === SCAN_MODE.STICKERS ? "border-indigo-400 animate-pulse" : "border-transparent";
    boundingBoxText = scanMode === SCAN_MODE.STICKERS ? "Processing Data... Hold Still" : "Recording Skill...";
    
    overlayContent = (
      <div className="flex flex-col items-center p-6 bg-black bg-opacity-70 rounded-xl shadow-2xl">
        <Loader2 className="animate-spin text-indigo-400 h-10 w-10 mb-4" />
        <p className="text-white font-semibold text-lg">
          {scanMode === SCAN_MODE.STICKERS ? "Analyzing Booklet Data (5 sec)" : "Capturing Photo and Sending to Dashboard (5 sec)"}
        </p>
        <p className="text-sm text-gray-300 mt-1">
          Please wait for processing to complete.
        </p>
      </div>
    );
  } else if (scanState === SCAN_STATE.IDLE) {
    boundingBoxColor = "border-white";
  }

  // Refactored Bounding Box Component
  const BoundingBox = () => {
    const showBoundingBox = scanMode === SCAN_MODE.STICKERS;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Student Info Bar on top of the camera view (always visible) */}
            <div className="absolute top-[-4.5rem] p-3 bg-black/60 backdrop-blur-sm rounded-xl text-white text-center shadow-lg">
                <p className="text-xl font-bold">{selectedStudent.name}</p>
                <p className="text-sm text-gray-300">ID: {selectedStudent.studentNumber}</p>
            </div>
            
            {(showBoundingBox || scanState === SCAN_STATE.PROCESSING) && (
                <div className={`relative w-4/5 ${showBoundingBox ? 'h-4/5 max-w-lg max-h-lg' : 'max-w-md'} flex flex-col items-center justify-center pointer-events-auto`}>
                    {/* The square boundary */}
                    {showBoundingBox && (
                        <div
                            className={`w-full h-full border-4 ${boundingBoxColor} rounded-xl transition-all duration-500 flex items-center justify-center`}
                        >
                            {/* Content inside the bounding box (only processing overlay for STICKERS mode) */}
                            {scanState === SCAN_STATE.PROCESSING && overlayContent}
                        </div>
                    )}

                    {/* Content without bounding box (for HARD_SKILL processing) */}
                    {!showBoundingBox && scanState === SCAN_STATE.PROCESSING && overlayContent}
                    
                    {/* Alignment text (only for STICKERS mode) */}
                    {showBoundingBox && (
                        <p className="mt-4 text-white text-xl font-black drop-shadow-lg p-2 bg-black bg-opacity-50 rounded-lg">
                            {boundingBoxText}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
  };
  

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
      <CameraStream videoRef={videoRef} onError={handleCameraError} />

      {/* Back Button (Only visible when IDLE) - now goes to select student */}
      {scanState === SCAN_STATE.IDLE && (
        <button
          onClick={() => navigate(`/student-select`)}
          className="absolute top-4 left-4 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all z-10 flex items-center shadow-lg"
          aria-label="Go back to student selector"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
        </button>
      )}
      
      {/* Action Buttons (Centered and Stacked - Scan/Record) */}
      {scanState === SCAN_STATE.IDLE && !cameraPermissionError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-6 z-10">
          {/* Tap to Scan Stickers */}
          <button
            onClick={() => startScan(SCAN_MODE.STICKERS)}
            className="p-5 text-gray-900 font-black text-xl rounded-xl shadow-2xl hover:bg-white/90 transition flex items-center justify-center transform hover:scale-[1.03] pointer-events-auto min-w-[300px]"
            style={{
              backgroundColor: PRIMARY_COLOR,
              boxShadow: `0 10px 15px -3px ${PRIMARY_COLOR}80`,
            }}
            disabled={!!cameraPermissionError}
          >
            <Camera className="mr-2 h-6 w-6" />
            Scan Stickers
          </button>
    
          {/* Record Hard Skills */}
          <button
            onClick={() => startScan(SCAN_MODE.HARD_SKILL)}
            className="p-5 text-white font-black text-xl rounded-xl shadow-2xl transition flex items-center justify-center transform hover:scale-[1.03] pointer-events-auto bg-indigo-600 hover:bg-indigo-700 min-w-[300px]"
            style={{
              boxShadow: `0 10px 15px -3px rgba(99, 102, 241, 0.5)`,
            }}
            disabled={!!cameraPermissionError}
          >
            <Star className="mr-2 h-6 w-6" />
            Record Hard Skills
          </button>
        </div>
      )}
      
      {/* Bounding Box and Scan Button Overlay */}
      {scanState !== SCAN_STATE.SUCCESS && scanState !== SCAN_STATE.ERROR && (
        <BoundingBox />
      )}

      {/* SUCCESS POPUP (Updated to stay on camera page) */}
      {scanState === SCAN_STATE.SUCCESS && showPopup && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-md bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-green-500 text-center animate-fade-in z-20">
          <CheckCircle className="text-green-500 h-16 w-16 mx-auto mb-4 animate-bounce-once" />
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
            {scanMode === SCAN_MODE.STICKERS ? "Scan Complete - SUCCESS!" : "Hard Skill Recorded - SUCCESS!"}
          </h1>
          <p className="text-gray-600">
            {scanMode === SCAN_MODE.STICKERS
              ? `The sticker data for **${selectedStudent.name}** has been saved.`
              : `**${selectedStudent.name}**'s skill from **${selectedWorkshop}** was sent to the dashboard.`}
          </p>
          <button
            onClick={() => handleAction(SCAN_STATE.IDLE)} // Action to return to IDLE state on the camera page
            className="mt-6 p-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition w-full shadow-green-500/40"
          >
            Done
          </button>
        </div>
      )}

      {/* ERROR POPUP (Unchanged) */}
      {scanState === SCAN_STATE.ERROR && showPopup && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-md bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-red-500 text-center animate-fade-in z-20">
          <XCircle className="text-red-500 h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-800 mb-3">
            Scan Failed!
          </h1>
          <p className="text-red-700 font-medium text-lg mb-6 border-b pb-4 border-red-100">
            {errorMessage}
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => startScan(scanMode)} // Rescan using the current mode
              className="p-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition shadow-red-500/40"
            >
              RESCAN (Check & Correct)
            </button>
            <button
              onClick={() => handleAction(SCAN_STATE.SUCCESS)}
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
  const [currentPath, setCurrentPath] = useState("/");
  
  const [sessionData, setSessionData] = useState<{
    programId: string;
    selectedWorkshop: string;
    selectedStudent: Student | null;
  }>({
    programId: PROGRAMS[0].id,
    selectedWorkshop: PROGRAMS[0].workshops[0],
    selectedStudent: null, 
  });

  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    const parts = path.split("/");
    if (parts[1] === "workshop" && parts[2]) {
      setSessionData(prev => ({ ...prev, programId: parts[2] }));
    }
  }, []);
  
  const setWorkshopData = useCallback((workshopName: string) => {
    setSessionData(prev => ({ ...prev, selectedWorkshop: workshopName }));
  }, []);

  const setStudentData = useCallback((student: Student) => {
    setSessionData(prev => ({ ...prev, selectedStudent: student }));
  }, []);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "wizard") {
      setIsWizardMode(true);
    }
    if (window.location.hash) {
      setCurrentPath(window.location.hash.substring(1));
    }
  }, []);

  useEffect(() => {
    window.location.hash = currentPath;
  }, [currentPath]);

  type ScanStateKey = (typeof SCAN_STATE)[keyof typeof SCAN_STATE];

  interface HandleUserAction {
    (newState: ScanStateKey): void;
  }
  
  const handleUserAction = useCallback<HandleUserAction>(
    (newState: ScanStateKey) => { 
      setScanState(newState); 
    },
    []
  );

  let content;

  const pathParts = currentPath.split("/");

  switch (pathParts[1]) {
    case "workshop":
      content = (
        <WorkshopDetail
          navigate={navigate}
          programId={pathParts[2] || sessionData.programId}
          setWorkshopData={setWorkshopData}
          selectedWorkshop={sessionData.selectedWorkshop}
        />
      );
      break;
    case "student-select":
      content = (
        <StudentSelector
          navigate={navigate}
          selectedWorkshop={sessionData.selectedWorkshop}
          setStudentData={setStudentData}
          programId={sessionData.programId}
        />
      );
      break;
    case "scan":
      content = (
        <ScanningPage
          scanState={scanState}
          errorMessage={errorMessage}
          handleAction={handleUserAction}
          navigate={navigate}
          selectedStudent={sessionData.selectedStudent || UNSELECTED_STUDENT} 
          selectedWorkshop={sessionData.selectedWorkshop} 
        />
      );
      break;
    case "":
    default:
      content = <ProgramSelector navigate={navigate} />;
      break;
  }

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen font-sans antialiased">
      {/* Header Bar */}
      <div
        className="flex justify-between items-center bg-gray-100 p-4 rounded-xl shadow-lg border-b-4 mb-6"
        style={{ borderColor: PRIMARY_COLOR }}
      >
        <h1 className="text-2xl font-black text-gray-900 flex items-center">
          <LogoIcon className="h-7 w-7 mr-2 text-black" />
          <span className="hidden sm:inline">BOUWKEET TRACKER</span>
          <span className="sm:hidden">TRACKER</span>
        </h1>
        {/* Conditional Student Name Display */}
        {/* FIX: Added ml-2 for separation on mobile and flex-shrink-0 to prevent text from being squeezed too much */}
        <div className="flex items-center space-x-3 ml-2 flex-shrink-0">
          {sessionData.selectedStudent ? (
            <div className="text-sm font-bold text-gray-700 whitespace-nowrap">
              {/* Desktop View: shows "Current Session: Name" */}
              <span className="hidden sm:inline">
                Current Student:{" "}
                <span className="font-extrabold text-gray-900 ml-0">
                  {sessionData.selectedStudent.name}
                </span>
              </span>

              {/* Mobile View: shows Name and Number, stacked and right-aligned */}
              <div className="sm:hidden flex flex-col text-right -space-y-1">
                <span className="font-extrabold text-gray-900 text-sm">
                  {sessionData.selectedStudent.name}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  #{sessionData.selectedStudent.studentNumber}
                </span>
              </div>
            </div>
          ) : (
            // FIX: Structured the "No Student Selected" message into two lines for mobile view
            <span className="text-sm font-bold text-gray-500 whitespace-nowrap text-right">
              <span className="hidden sm:inline">No Student Selected</span>
              <div className="sm:hidden flex flex-col text-xs font-bold text-red-600">
                <span>No Student</span>
                <span>Selected</span>
              </div>
            </span>
          )}
          <button className="text-gray-700 hover:text-indigo-600 transition p-2 rounded-full hover:bg-gray-200">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isWizardMode && (
        <ControlPanel
          setScanState={setScanState}
          setErrorMessage={setErrorMessage}
          navigate={navigate}
        />
      )}

      {/* FIX: Main Content Card (Simulates Tablet View) - Added h-[80vh] and flex-col for internal scrolling */}
      <div
        className="mt-8 bg-gray-50 max-w-xl mx-auto rounded-3xl shadow-2xl border-4 overflow-hidden h-[80vh] flex flex-col"
        style={{ borderColor: PRIMARY_COLOR }}
      >
        {content}
      </div>

      {/* Select New Student Button (outside the camera display) */}
      {currentPath === "/scan" && scanState === SCAN_STATE.IDLE && (
        <div className="max-w-xl mx-auto mt-4 text-center">
          <button
            onClick={() => navigate(`/student-select`)}
            className="p-4 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition flex items-center justify-center w-full"
            aria-label="Select a different student"
          >
            <Users className="h-6 w-6 mr-2" /> Select New Student
          </button>
        </div>
      )}

      <footer className="mt-10 text-center text-sm text-gray-500">
        <p className="mb-2">
          BKT App State:{" "}
          <span
            className={`font-semibold p-1 rounded-md 
          ${scanState === SCAN_STATE.IDLE && "text-gray-600 bg-gray-200"}
          ${scanState === SCAN_STATE.PROCESSING && "text-blue-600 bg-blue-100"}
          ${scanState === SCAN_STATE.SUCCESS && "text-green-600 bg-green-100"}
          ${scanState === SCAN_STATE.ERROR && "text-red-600 bg-red-100"}
        `}
          >
            {scanState}
          </span>
        </p>
        {isWizardMode && (
          <p className="mt-2 text-xs text-indigo-700">
            Accessing Wizard Control Panel. Remove `?mode=wizard` from URL for
            user view.
          </p>
        )}
      </footer>
    </div>
  );
};

export default App;