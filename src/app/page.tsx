"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Trophy, Flame, Star, ChevronRight, CheckCircle2, ArrowRight, Heart, Target, Clock, AlertCircle, Sparkles, Info, Lock, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

type Pose = {
  id: number;
  name: string;
  duration: number;
  description: string;
  benefits: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  precautions?: string;
  stepByStep: string[];
  tips: string[];
  isPremium?: boolean;
};

type Session = {
  id: number;
  name: string;
  duration: number;
  poses: Pose[];
  level: "beginner" | "intermediate" | "advanced";
  calories: number;
  focus: string[];
  isPremium?: boolean;
};

type UserProfile = {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  goals: string[];
  limitations: string[];
  timeAvailable: string;
  completed: boolean;
  isPremium: boolean;
};

const freeExercises: Pose[] = [
  {
    id: 101,
    name: "Box Breathing",
    duration: 120,
    description: "4-4-4-4 breathing technique to calm the mind",
    benefits: "Reduces anxiety, improves focus, balances nervous system",
    difficulty: "beginner",
    stepByStep: [
      "Sit comfortably with spine straight",
      "Inhale through nose counting to 4",
      "Hold breath counting to 4",
      "Exhale through mouth counting to 4",
      "Hold empty lungs counting to 4",
      "Repeat cycle for 2 minutes"
    ],
    tips: [
      "Keep count consistent",
      "Don't force - adjust timing if needed",
      "Practice anytime during the day"
    ]
  },
  {
    id: 102,
    name: "Cat-Cow (Marjaryasana-Bitilasana)",
    duration: 60,
    description: "Fluid movement that warms and mobilizes the spine",
    benefits: "Spine flexibility, relieves back tension, massages organs",
    difficulty: "beginner",
    stepByStep: [
      "Start on hands and knees",
      "Hands under shoulders, knees under hips",
      "Inhale: arch back, look up (Cow)",
      "Exhale: round back, chin to chest (Cat)",
      "Flow between positions with breath",
      "Continue for 1 minute"
    ],
    tips: [
      "Synchronize movement with breath",
      "Move slowly with control",
      "Great warm-up for any practice"
    ]
  },
  {
    id: 103,
    name: "Neck Stretches",
    duration: 90,
    description: "Series of gentle stretches to release neck tension",
    benefits: "Relieves neck tension, reduces headaches, improves posture",
    difficulty: "beginner",
    stepByStep: [
      "Sit or stand with upright posture",
      "Tilt head to right side (ear toward shoulder)",
      "Hold for 15 seconds",
      "Return to center and repeat on left",
      "Look down, chin to chest, hold 15 seconds",
      "Look up gently, hold 15 seconds",
      "Make slow, controlled rotations"
    ],
    tips: [
      "Never force the movement",
      "Keep shoulders relaxed",
      "Breathe deeply during stretches",
      "Perfect for work breaks"
    ]
  },
  {
    id: 104,
    name: "Supine Twist (Supta Matsyendrasana)",
    duration: 90,
    description: "Gentle, relaxing spinal twist",
    benefits: "Relieves back tension, massages organs, improves digestion",
    difficulty: "beginner",
    stepByStep: [
      "Lie on your back",
      "Bend right knee and bring toward chest",
      "Let knee fall to left side",
      "Extend right arm to the side",
      "Look to the right",
      "Hold for 45 seconds",
      "Repeat on other side"
    ],
    tips: [
      "Keep shoulders on floor",
      "Don't force the twist",
      "Breathe deeply",
      "Great pose before sleep"
    ]
  },
  {
    id: 105,
    name: "Butterfly (Baddha Konasana)",
    duration: 90,
    description: "Gentle seated hip opener",
    benefits: "Opens hips, stretches groin, improves flexibility",
    difficulty: "beginner",
    stepByStep: [
      "Sit with spine straight",
      "Bring soles of feet together",
      "Hold feet with hands",
      "Let knees fall to sides",
      "Keep spine elongated",
      "Optionally, fold forward",
      "Breathe deeply for 90 seconds"
    ],
    tips: [
      "Don't force knees down",
      "Use cushions under knees if needed",
      "Keep spine upright",
      "Relax shoulders"
    ]
  },
  {
    id: 106,
    name: "Side Plank (Vasisthasana)",
    duration: 40,
    description: "Lateral core strengthening and balance",
    benefits: "Strengthens core, arms, improves balance and stability",
    difficulty: "intermediate",
    stepByStep: [
      "Start in regular plank",
      "Rotate to right side",
      "Stack feet (or place one in front)",
      "Raise left arm up",
      "Body forms diagonal line",
      "Hold for 20 seconds",
      "Repeat on other side"
    ],
    tips: [
      "Keep core activated",
      "Don't let hips drop",
      "Look at top hand",
      "Modify by supporting knee if needed"
    ]
  },
  {
    id: 107,
    name: "Chair (Utkatasana)",
    duration: 45,
    description: "Strength pose working legs and core",
    benefits: "Strengthens legs, glutes, core and improves posture",
    difficulty: "intermediate",
    stepByStep: [
      "Stand with feet together",
      "Inhale and raise arms overhead",
      "Exhale and bend knees as if sitting",
      "Keep weight in heels",
      "Knees don't pass toes",
      "Chest lifted, look forward",
      "Hold for 45 seconds"
    ],
    tips: [
      "Imagine sitting in invisible chair",
      "Keep core activated",
      "Breathe deeply",
      "Feel the work in thighs"
    ]
  },
  {
    id: 108,
    name: "Half Pigeon (Eka Pada Rajakapotasana - simple version)",
    duration: 90,
    description: "Deep hip opening",
    benefits: "Opens hips, stretches glutes, releases emotional tension",
    difficulty: "intermediate",
    stepByStep: [
      "Start on hands and knees",
      "Bring right knee forward between hands",
      "Extend left leg back",
      "Level hips facing forward",
      "Keep torso upright or fold forward",
      "Breathe deeply for 45 seconds",
      "Repeat on other side"
    ],
    tips: [
      "Use cushion under hip if needed",
      "Don't force the opening",
      "Keep hips level",
      "Breathe into stretch sensation"
    ]
  }
];

const sessions: Session[] = [
  {
    id: 1,
    name: "Morning Awakening",
    duration: 10,
    level: "beginner",
    calories: 45,
    focus: ["flexibility", "energy"],
    poses: [
      {
        id: 1,
        name: "Mountain Pose (Tadasana)",
        duration: 30,
        description: "Fundamental alignment and body awareness pose",
        benefits: "Improves posture and balance, strengthens legs, increases body awareness",
        difficulty: "beginner",
        stepByStep: [
          "Stand with feet together or slightly apart",
          "Distribute weight equally between both feet",
          "Lightly contract thighs and lift kneecaps",
          "Lengthen spine upward, keeping shoulders relaxed",
          "Let arms hang by sides with palms facing forward",
          "Look forward, chin parallel to floor",
          "Breathe deeply and hold the pose"
        ],
        tips: [
          "Imagine a straight line from head to feet",
          "Keep weight distributed on four corners of feet",
          "Relax shoulders away from ears",
          "This is the foundation for all standing poses"
        ]
      },
      {
        id: 2,
        name: "Sun Salutation (Surya Namaskar)",
        duration: 60,
        description: "Flowing sequence that warms entire body",
        benefits: "Warms body, energizes, improves circulation and flexibility",
        difficulty: "beginner",
        stepByStep: [
          "Start standing in Mountain Pose",
          "Inhale and raise arms overhead",
          "Exhale and fold forward, hands to floor",
          "Inhale and look forward, lengthening spine",
          "Exhale and step back to plank",
          "Lower body to floor (or knees first)",
          "Inhale and lift chest (Cobra or Upward Dog)",
          "Exhale and push to Downward Dog",
          "Hold for 5 breaths",
          "Inhale and jump or walk feet forward",
          "Exhale and fold forward",
          "Inhale and rise with arms raised",
          "Exhale and return to Mountain Pose"
        ],
        tips: [
          "Synchronize each movement with breath",
          "Go at your pace, don't force",
          "Modify by bending knees if needed",
          "Do 3-5 repetitions to warm up completely"
        ]
      },
      {
        id: 3,
        name: "Downward Dog (Adho Mukha Svanasana)",
        duration: 45,
        description: "Gentle inversion stretching entire body",
        benefits: "Lengthens spine, strengthens arms and legs, energizes body",
        difficulty: "beginner",
        precautions: "Avoid if you have uncontrolled high blood pressure or shoulder injury",
        stepByStep: [
          "Start on hands and knees",
          "Position hands shoulder-width apart",
          "Place knees hip-width apart",
          "Tuck toes and lift hips up",
          "Form inverted 'V' with body",
          "Press hands firmly into floor",
          "Lengthen spine and bring chest toward thighs",
          "Try to bring heels toward floor (don't need to touch)",
          "Relax head between arms",
          "Breathe deeply for 5-8 breaths"
        ],
        tips: [
          "Keep fingers spread wide for better support",
          "Bend knees slightly if feeling back tension",
          "Focus on lengthening spine, not touching heels to floor",
          "Distribute weight equally between hands and feet"
        ]
      },
      {
        id: 4,
        name: "Child's Pose (Balasana)",
        duration: 45,
        description: "Resting pose for deep relaxation",
        benefits: "Deep relaxation, relieves back tension, calms mind",
        difficulty: "beginner",
        stepByStep: [
          "Kneel on floor with knees apart",
          "Bring big toes together behind you",
          "Sit on heels",
          "Exhale and fold torso forward",
          "Extend arms forward or alongside body",
          "Rest forehead on floor or block",
          "Completely relax shoulders",
          "Breathe deeply and stay for 1-3 minutes"
        ],
        tips: [
          "Use pillow under forehead if can't reach floor",
          "Place blanket over heels if feeling discomfort",
          "This is your resting pose - return to it whenever needed",
          "Focus on breathing deeply and relaxing"
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Strength & Balance",
    duration: 15,
    level: "intermediate",
    calories: 80,
    focus: ["strength", "balance"],
    poses: [
      {
        id: 5,
        name: "Warrior I (Virabhadrasana I)",
        duration: 40,
        description: "Powerful pose developing strength and stability",
        benefits: "Strengthens legs, core, shoulders and improves mental focus",
        difficulty: "intermediate",
        stepByStep: [
          "Start standing, step back with left foot",
          "Turn back foot 45 degrees outward",
          "Keep front foot pointing forward",
          "Bend front knee to 90 degrees (knee over ankle)",
          "Keep back leg extended and strong",
          "Raise arms overhead, palms touching",
          "Hips facing forward",
          "Look up toward hands",
          "Hold for 5-8 breaths",
          "Repeat on other side"
        ],
        tips: [
          "Press back heel firmly into floor",
          "Keep front knee aligned with ankle",
          "Lengthen spine upward, don't lean forward",
          "Breathe deeply to maintain pose"
        ]
      },
      {
        id: 6,
        name: "Warrior II (Virabhadrasana II)",
        duration: 40,
        description: "Lateral strength pose with hip opening",
        benefits: "Increases endurance, leg strength and concentration",
        difficulty: "intermediate",
        stepByStep: [
          "Open legs wide apart (about 1 meter)",
          "Turn right foot 90 degrees outward",
          "Turn left foot slightly inward",
          "Align right heel with left foot arch",
          "Bend right knee to 90 degrees",
          "Extend arms at shoulder height, parallel to floor",
          "Look over front hand",
          "Keep shoulders over hips",
          "Press back foot firmly into floor",
          "Hold for 5-8 breaths and repeat on other side"
        ],
        tips: [
          "Keep torso vertical, don't lean forward",
          "Front knee aligned with second toe",
          "Shoulders relaxed, away from ears",
          "Feel strength and stability in legs"
        ]
      },
      {
        id: 7,
        name: "Tree (Vrksasana)",
        duration: 35,
        description: "Balance pose developing concentration",
        benefits: "Improves balance, concentration, strengthens legs and ankles",
        difficulty: "intermediate",
        precautions: "Use support if you have balance issues",
        stepByStep: [
          "Start in Mountain Pose",
          "Transfer weight to left foot",
          "Bend right knee and place sole on left thigh",
          "Avoid placing foot directly on knee",
          "Press foot and thigh against each other",
          "Find fixed point to look at (drishti)",
          "When stable, bring hands to chest",
          "Or raise arms overhead",
          "Hold for 5-10 breaths",
          "Repeat on other side"
        ],
        tips: [
          "If can't reach thigh, place foot on calf or ankle",
          "Never place foot directly on knee",
          "Keep gaze fixed on one point to help balance",
          "It's normal to wobble - part of the process",
          "Use wall for support if needed"
        ]
      },
      {
        id: 8,
        name: "Plank (Phalakasana)",
        duration: 45,
        description: "Fundamental core strength pose",
        benefits: "Strengthens core, arms, shoulders and improves posture",
        difficulty: "intermediate",
        stepByStep: [
          "Start on hands and knees",
          "Position hands directly under shoulders",
          "Extend legs back, one at a time",
          "Support on toes",
          "Body forms straight line from head to heels",
          "Activate core, pulling navel inward",
          "Keep neck neutral, looking down",
          "Don't let hips drop or rise too much",
          "Breathe normally",
          "Hold for 20-60 seconds"
        ],
        tips: [
          "Imagine pushing floor away from you",
          "Keep shoulders away from ears",
          "If too difficult, support knees on floor",
          "Focus on maintaining straight body line",
          "Gradually increase hold time"
        ]
      },
      {
        id: 9,
        name: "Bridge (Setu Bandhasana)",
        duration: 40,
        description: "Gentle backbend that strengthens and opens",
        benefits: "Strengthens glutes, spine, opens chest and improves posture",
        difficulty: "intermediate",
        stepByStep: [
          "Lie on back with knees bent",
          "Feet on floor, hip-width apart",
          "Heels close to glutes",
          "Arms by sides, palms down",
          "Press feet and arms into floor",
          "Inhale and lift hips up",
          "Keep thighs parallel",
          "Interlace hands under back (optional)",
          "Push chest toward chin",
          "Hold for 5-10 breaths",
          "Exhale and lower vertebra by vertebra"
        ],
        tips: [
          "Keep knees aligned, don't let them open",
          "Press feet firmly into floor",
          "Don't turn head while in pose",
          "Focus on opening chest and strengthening legs",
          "Breathe deeply into chest"
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Advanced Flexibility",
    duration: 20,
    level: "advanced",
    calories: 120,
    focus: ["flexibility", "strength"],
    isPremium: true,
    poses: [
      {
        id: 10,
        name: "Crow (Bakasana)",
        duration: 30,
        description: "Arm balance requiring strength and concentration",
        benefits: "Arm, wrist, core strength and improves balance and concentration",
        difficulty: "advanced",
        precautions: "Use cushion to protect head initially, avoid if you have wrist injuries",
        isPremium: true,
        stepByStep: [
          "Start squatting with feet together",
          "Place hands on floor shoulder-width apart",
          "Bend elbows slightly",
          "Place knees on outer arms (near armpits)",
          "Lean forward, transferring weight to hands",
          "Look forward, not down",
          "Lift one foot off floor, then the other",
          "Bring feet together and point toes",
          "Keep core activated",
          "Breathe and hold for 5-15 seconds"
        ],
        tips: [
          "Place cushion in front for safety",
          "Practice lifting one foot at a time first",
          "Looking forward helps balance",
          "Keep elbows over wrists",
          "Be patient - this pose takes time to master"
        ]
      },
      {
        id: 11,
        name: "Headstand (Sirsasana)",
        duration: 45,
        description: "Complete inversion, queen of poses",
        benefits: "Improves circulation, mental focus, strengthens core and shoulders",
        difficulty: "advanced",
        precautions: "DO NOT do if you have neck problems, high blood pressure, glaucoma or during menstruation",
        isPremium: true,
        stepByStep: [
          "Kneel and interlace fingers firmly",
          "Place forearms on floor, elbows shoulder-width apart",
          "Place crown of head on floor, interlaced hands behind",
          "Lift hips, extending legs",
          "Walk feet toward head",
          "When hips are over shoulders, bend knees",
          "Lift knees toward chest",
          "When stable, extend legs upward",
          "Keep body in straight line",
          "Breathe normally, hold for 30-60 seconds",
          "Lower with control, rest in Child's Pose"
        ],
        tips: [
          "ALWAYS practice near wall initially",
          "Most weight should be on forearms, not head",
          "Keep core super activated",
          "Don't rush entering or exiting pose",
          "Rest in Child's Pose afterward",
          "Consider learning with qualified teacher"
        ]
      },
      {
        id: 12,
        name: "Wheel (Urdhva Dhanurasana)",
        duration: 35,
        description: "Deep backbend opening entire body",
        benefits: "Total spine flexibility, chest opening, strengthens arms and legs",
        difficulty: "advanced",
        precautions: "Warm up thoroughly before, avoid if you have back or wrist injuries",
        isPremium: true,
        stepByStep: [
          "Lie on back with knees bent",
          "Feet on floor, hip-width apart, close to glutes",
          "Place hands by head, fingers pointing toward shoulders",
          "Press hands and feet firmly into floor",
          "Lift hips and place crown of head on floor",
          "Pause and breathe",
          "Press hands and fully extend arms",
          "Lift head off floor",
          "Push chest toward wall behind you",
          "Hold for 5-10 breaths",
          "Lower with control, rest"
        ],
        tips: [
          "Warm up with Bridge and Cobra first",
          "Keep feet parallel, don't let them open",
          "Press hands firmly into floor",
          "Don't force - develop gradually",
          "Practice Bridge first until mastered",
          "Stretch back afterward (forward fold)"
        ]
      },
      {
        id: 13,
        name: "King Pigeon (Eka Pada Rajakapotasana)",
        duration: 40,
        description: "Deep hip opening with backbend",
        benefits: "Deep hip opening, spine flexibility, intense stretch",
        difficulty: "advanced",
        isPremium: true,
        stepByStep: [
          "Start in Downward Dog",
          "Bring right knee forward between hands",
          "Place right shin on floor (parallel to front of mat)",
          "Extend left leg back",
          "Level hips facing forward",
          "Bend back knee, bringing foot toward glute",
          "Reach for foot with same-side hand",
          "Pull foot toward head",
          "Optionally, reach with both hands",
          "Hold for 5-10 breaths",
          "Repeat on other side"
        ],
        tips: [
          "Start with simple Pigeon before adding backbend",
          "Use blocks under hip if needed",
          "Don't force hip opening",
          "Keep hips level",
          "Breathe deeply to relax into pose",
          "This is advanced pose - be patient"
        ]
      },
      {
        id: 14,
        name: "Scorpion (Vrschikasana)",
        duration: 30,
        description: "Advanced inversion with extreme backbend",
        benefits: "Extreme balance, total flexibility, core and shoulder strength",
        difficulty: "advanced",
        precautions: "ONLY for very experienced practitioners, avoid if you have any injuries",
        isPremium: true,
        stepByStep: [
          "Start in Downward Dog on forearms",
          "Walk feet toward elbows",
          "Lift one leg up",
          "Push off and bring other leg up",
          "Find balance in forearm inversion",
          "When stable, start bending knees",
          "Arch back, bringing feet toward head",
          "Look forward",
          "Hold for 5-15 seconds",
          "Lower with control"
        ],
        tips: [
          "ALWAYS practice with wall or supervisor",
          "Master Headstand and Wheel first",
          "Warm up extensively beforehand",
          "Don't attempt without prior inversion experience",
          "Consider working with specialized teacher",
          "Respect your limits - this is extremely advanced"
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Relaxation & Breathing",
    duration: 12,
    level: "beginner",
    calories: 30,
    focus: ["relaxation", "breathing"],
    poses: [
      {
        id: 15,
        name: "Deep Breathing (Pranayama)",
        duration: 60,
        description: "Conscious breathing technique to calm mind",
        benefits: "Reduces stress, calms mind, oxygenates body, improves focus",
        difficulty: "beginner",
        stepByStep: [
          "Sit comfortably with spine straight",
          "Can be in lotus, half lotus or on chair",
          "Close eyes gently",
          "Place one hand on chest, other on abdomen",
          "Inhale slowly through nose for 4 seconds",
          "Feel abdomen expand first, then chest",
          "Hold breath for 2 seconds",
          "Exhale slowly through mouth for 6 seconds",
          "Feel chest empty first, then abdomen",
          "Repeat for 10-15 cycles"
        ],
        tips: [
          "Exhalation should be longer than inhalation",
          "Breathe with diaphragm, not just chest",
          "Keep shoulders relaxed",
          "If feeling dizzy, return to normal breathing",
          "Practice daily for best results"
        ]
      },
      {
        id: 16,
        name: "Seated Twist (Ardha Matsyendrasana)",
        duration: 45,
        description: "Gentle twist massaging internal organs",
        benefits: "Massages internal organs, relieves back tension, improves digestion",
        difficulty: "beginner",
        stepByStep: [
          "Sit with legs extended forward",
          "Bend right knee and cross over left leg",
          "Right foot on floor beside left knee",
          "Bend left knee, bringing foot near right hip",
          "Inhale and lengthen spine",
          "Exhale and twist to right",
          "Left elbow outside right knee",
          "Right hand behind you for support",
          "Look over right shoulder",
          "Hold for 5-8 breaths",
          "Repeat on other side"
        ],
        tips: [
          "Lengthen spine before twisting",
          "Twist from abdomen, not just shoulders",
          "Keep both glutes on floor",
          "Don't force the twist",
          "Use each inhale to lengthen, each exhale to twist more"
        ]
      },
      {
        id: 17,
        name: "Legs Up the Wall (Viparita Karani)",
        duration: 90,
        description: "Gentle, restorative inversion",
        benefits: "Improves circulation, relaxes legs, reduces swelling, calms nervous system",
        difficulty: "beginner",
        stepByStep: [
          "Sit sideways next to wall",
          "Lie on back while rotating legs up wall",
          "Glutes close to or touching wall",
          "Legs extended vertically, supported by wall",
          "Arms by sides, palms up",
          "Or arms open in 'T'",
          "Close eyes",
          "Relax completely",
          "Breathe deeply",
          "Stay for 5-15 minutes"
        ],
        tips: [
          "Use cushion under hips for more comfort",
          "Don't need to keep legs perfectly straight",
          "Great pose before sleep",
          "Helps relieve tired legs",
          "Can practice while listening to relaxing music"
        ]
      },
      {
        id: 18,
        name: "Savasana (Corpse Pose)",
        duration: 120,
        description: "Final relaxation and integration pose",
        benefits: "Deep relaxation, practice integration, reduces stress and anxiety",
        difficulty: "beginner",
        stepByStep: [
          "Lie on back on mat",
          "Legs extended, feet falling naturally to sides",
          "Arms by sides, palms up",
          "Move arms slightly away from body",
          "Close eyes",
          "Consciously relax each body part",
          "Start from feet, moving up to head",
          "Release all tension",
          "Breathe naturally",
          "Stay completely still for 5-10 minutes",
          "To exit, gently move fingers",
          "Roll to right side",
          "Use hands to sit up slowly"
        ],
        tips: [
          "Use blanket to cover yourself if feeling cold",
          "Place cushion under knees if back discomfort",
          "This is most important pose - don't skip!",
          "Allows body to absorb practice benefits",
          "Practice complete surrender",
          "If mind wanders, gently bring back to breath"
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Yoga for Absolute Beginners",
    duration: 8,
    level: "beginner",
    calories: 35,
    focus: ["flexibility", "relaxation"],
    poses: [
      freeExercises[0], // Box Breathing
      freeExercises[1], // Cat-Cow
      freeExercises[4], // Butterfly
    ]
  },
  {
    id: 6,
    name: "Quick Tension Relief",
    duration: 7,
    level: "beginner",
    calories: 25,
    focus: ["relaxation", "flexibility"],
    poses: [
      freeExercises[2], // Neck Stretches
      freeExercises[3], // Supine Twist
    ]
  },
  {
    id: 7,
    name: "Intermediate Strengthening",
    duration: 12,
    level: "intermediate",
    calories: 70,
    focus: ["strength", "balance"],
    poses: [
      freeExercises[5], // Side Plank
      freeExercises[6], // Chair
      freeExercises[7], // Half Pigeon
    ]
  }
];

const healthTips = {
  beginner: [
    "🌅 Practice in the morning to energize your day",
    "💧 Stay hydrated before and after practice",
    "🧘‍♀️ Listen to your body - don't push beyond your limits",
    "📅 Consistency is more important than intensity",
    "🎯 Start with 10-15 minutes per day"
  ],
  intermediate: [
    "🔥 Gradually increase pose duration",
    "🌬️ Focus on breathing throughout practice",
    "💪 Challenge yourself with more difficult variations",
    "🧘 Practice meditation after poses",
    "📈 Vary between different session types"
  ],
  advanced: [
    "🎯 Explore inversions and advanced balances",
    "🧠 Integrate pranayama (breathing techniques)",
    "⚡ Practice on empty stomach for best performance",
    "🌟 Teach others - share your knowledge",
    "🔄 Maintain consistent daily practice"
  ]
};

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "8 complete free exercises",
      "3 basic guided sessions",
      "Detailed step-by-step instructions",
      "Safety tips",
      "Basic progress tracking"
    ],
    cta: "Current Plan",
    highlighted: false
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/month",
    features: [
      "✨ All free exercises",
      "🔥 Exclusive advanced sessions",
      "🎯 AI-personalized plans",
      "📊 Detailed progress analysis",
      "🎥 HD demonstration videos",
      "💬 Priority support",
      "🏆 Special challenges and achievements",
      "📱 Offline access"
    ],
    cta: "Subscribe Premium",
    highlighted: true,
    badge: "Most Popular"
  }
];

export default function YogaApp() {
  const [screen, setScreen] = useState<"welcome" | "questionnaire" | "dashboard" | "session" | "pricing" | "free-exercises">("welcome");
  const [questionStep, setQuestionStep] = useState(1);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    level: "beginner",
    goals: [],
    limitations: [],
    timeAvailable: "10-15",
    completed: false,
    isPremium: false
  });

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedPoses, setCompletedPoses] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive && selectedSession) {
      const points = selectedSession.poses[currentPoseIndex].difficulty === "advanced" ? 30 : 
                     selectedSession.poses[currentPoseIndex].difficulty === "intermediate" ? 20 : 10;
      setTotalPoints(prev => prev + points);
      setCompletedPoses(prev => prev + 1);
      
      if (currentPoseIndex < selectedSession.poses.length - 1) {
        setCurrentPoseIndex(prev => prev + 1);
        setTimeRemaining(selectedSession.poses[currentPoseIndex + 1].duration);
        setShowInstructions(true);
        setIsActive(false);
      } else {
        setIsActive(false);
        setStreak(prev => prev + 1);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, currentPoseIndex, selectedSession]);

  const startQuestionnaire = () => {
    setScreen("questionnaire");
    setQuestionStep(1);
  };

  const handleGoalToggle = (goal: string) => {
    setUserProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleLimitationToggle = (limitation: string) => {
    setUserProfile(prev => ({
      ...prev,
      limitations: prev.limitations.includes(limitation)
        ? prev.limitations.filter(l => l !== limitation)
        : [...prev.limitations, limitation]
    }));
  };

  const completeQuestionnaire = () => {
    setUserProfile(prev => ({ ...prev, completed: true }));
    setScreen("dashboard");
  };

  const getRecommendedSessions = () => {
    return sessions.filter(session => {
      // Filter premium sessions if user is not premium
      if (session.isPremium && !userProfile.isPremium) return false;
      
      if (userProfile.level === "beginner" && session.level === "advanced") return false;
      if (userProfile.level === "intermediate" && session.level === "advanced") return false;
      
      const maxTime = parseInt(userProfile.timeAvailable.split("-")[1]);
      if (session.duration > maxTime) return false;

      const hasMatchingGoal = session.focus.some(f => userProfile.goals.includes(f));
      return hasMatchingGoal || userProfile.goals.length === 0;
    });
  };

  const startSession = (session: Session) => {
    // Check if premium and user doesn't have access
    if (session.isPremium && !userProfile.isPremium) {
      setScreen("pricing");
      return;
    }
    
    setSelectedSession(session);
    setCurrentPoseIndex(0);
    setTimeRemaining(session.poses[0].duration);
    setIsActive(false);
    setShowInstructions(true);
    setScreen("session");
  };

  const togglePause = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setShowInstructions(false);
    }
  };

  const resetSession = () => {
    if (selectedSession) {
      setCurrentPoseIndex(0);
      setTimeRemaining(selectedSession.poses[0].duration);
      setIsActive(false);
      setShowInstructions(true);
    }
  };

  const backToDashboard = () => {
    setSelectedSession(null);
    setIsActive(false);
    setScreen("dashboard");
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner": return "from-emerald-400 to-teal-500";
      case "intermediate": return "from-orange-400 to-pink-500";
      case "advanced": return "from-purple-500 to-pink-600";
      default: return "from-blue-400 to-cyan-500";
    }
  };

  // WELCOME SCREEN
  if (screen === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 sm:p-12 text-center border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <div className="mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Welcome to Yoga Flow
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Your wellness journey starts here
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Let's get to know you better to create a personalized experience
            </p>
          </div>

          <div className="grid gap-4 mb-8 text-left">
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Personalized for you</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sessions adapted to your level and goals</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Safe and healthy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">We respect your limitations and physical conditions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">At your pace</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Practice when and where you want, in the time you have</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={startQuestionnaire}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg text-lg py-6"
          >
            Start Questionnaire
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  // QUESTIONNAIRE
  if (screen === "questionnaire") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-6 sm:p-8 border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Question {questionStep} of 5
              </span>
              <span className="text-sm font-bold text-purple-600">
                {Math.round((questionStep / 5) * 100)}%
              </span>
            </div>
            <Progress value={(questionStep / 5) * 100} className="h-2" />
          </div>

          {/* Question 1: Name */}
          {questionStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  What can we call you?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Let's personalize your experience
                </p>
              </div>
              <div>
                <Label htmlFor="name" className="text-base mb-2 block">Your name</Label>
                <input
                  id="name"
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 focus:outline-none text-lg"
                />
              </div>
              <Button 
                onClick={() => setQuestionStep(2)}
                disabled={!userProfile.name.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Question 2: Level */}
          {questionStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  What's your yoga experience level?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Be honest for the best recommendations
                </p>
              </div>
              <RadioGroup value={userProfile.level} onValueChange={(value: any) => setUserProfile(prev => ({ ...prev, level: value }))}>
                <div className="space-y-3">
                  <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20">
                    <RadioGroupItem value="beginner" id="beginner" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Beginner</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Never practiced or practiced a few times</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20">
                    <RadioGroupItem value="intermediate" id="intermediate" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Intermediate</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Practice regularly for a few months</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20">
                    <RadioGroupItem value="advanced" id="advanced" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Advanced</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Practice for years and master complex poses</div>
                    </div>
                  </label>
                </div>
              </RadioGroup>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setQuestionStep(1)}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setQuestionStep(3)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Question 3: Goals */}
          {questionStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  What are your goals?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Select all that apply
                </p>
              </div>
              <div className="space-y-3">
                {["flexibility", "strength", "balance", "relaxation", "energy", "breathing"].map((goal) => (
                  <label 
                    key={goal}
                    className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20"
                  >
                    <Checkbox 
                      checked={userProfile.goals.includes(goal)}
                      onCheckedChange={() => handleGoalToggle(goal)}
                    />
                    <span className="font-medium text-gray-800 dark:text-gray-100 capitalize">{goal}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setQuestionStep(2)}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setQuestionStep(4)}
                  disabled={userProfile.goals.length === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Question 4: Limitations */}
          {questionStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  Do you have any physical limitations?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This helps us recommend safe poses for you
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "No limitations",
                  "Back problems",
                  "Knee problems",
                  "Shoulder problems",
                  "High blood pressure",
                  "Pregnancy",
                  "Recent injury"
                ].map((limitation) => (
                  <label 
                    key={limitation}
                    className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20"
                  >
                    <Checkbox 
                      checked={userProfile.limitations.includes(limitation)}
                      onCheckedChange={() => handleLimitationToggle(limitation)}
                    />
                    <span className="font-medium text-gray-800 dark:text-gray-100">{limitation}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setQuestionStep(3)}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setQuestionStep(5)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Question 5: Available time */}
          {questionStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  How much time do you have per day?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We'll suggest sessions that fit your routine
                </p>
              </div>
              <RadioGroup value={userProfile.timeAvailable} onValueChange={(value) => setUserProfile(prev => ({ ...prev, timeAvailable: value }))}>
                <div className="space-y-3">
                  {[
                    { value: "5-10", label: "5-10 minutes", desc: "Quick and efficient" },
                    { value: "10-15", label: "10-15 minutes", desc: "Ideal for beginners" },
                    { value: "15-20", label: "15-20 minutes", desc: "Complete practice" },
                    { value: "20-30", label: "20-30 minutes", desc: "In-depth session" }
                  ].map((option) => (
                    <label 
                      key={option.value}
                      className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20"
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{option.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setQuestionStep(4)}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  Back
                </Button>
                <Button 
                  onClick={completeQuestionnaire}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6"
                >
                  Finish
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // PRICING SCREEN
  if (screen === "pricing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setScreen("dashboard")}
            className="mb-6 hover:bg-white/50"
          >
            ← Back to Dashboard
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Start free or unlock full potential with Premium
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden border-0 shadow-2xl transition-all duration-300 ${
                  plan.highlighted 
                    ? "scale-105 ring-4 ring-purple-500/50" 
                    : "hover:scale-102"
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {plan.badge}
                  </div>
                )}
                
                <div className={`h-2 bg-gradient-to-r ${plan.highlighted ? "from-purple-500 to-pink-600" : "from-gray-300 to-gray-400"}`} />
                
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? "text-purple-600" : "text-gray-400"
                        }`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-6 text-lg ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                    disabled={!plan.highlighted}
                  >
                    {plan.highlighted && <Crown className="w-5 h-5 mr-2" />}
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-600" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>7-day guarantee:</strong> Try Premium risk-free. Cancel anytime.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // FREE EXERCISES SCREEN
  if (screen === "free-exercises") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setScreen("dashboard")}
            className="mb-6 hover:bg-white/50"
          >
            ← Back to Dashboard
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Free Exercises
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Practice at your own pace with our free library
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {freeExercises.map((exercise) => (
              <Card 
                key={exercise.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className={`h-2 bg-gradient-to-r ${getDifficultyColor(exercise.difficulty)}`} />
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                      {exercise.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {exercise.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>{exercise.duration} seconds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="text-xs">{exercise.benefits}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      // Create temporary session with just this exercise
                      const tempSession: Session = {
                        id: 999,
                        name: exercise.name,
                        duration: Math.ceil(exercise.duration / 60),
                        level: exercise.difficulty,
                        calories: 20,
                        focus: ["flexibility"],
                        poses: [exercise]
                      };
                      startSession(tempSession);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Practice Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  if (screen === "dashboard") {
    const recommendedSessions = getRecommendedSessions();
    const currentTips = healthTips[userProfile.level];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Personalized Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Hello, {userProfile.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Ready for today's practice?
            </p>
            {!userProfile.isPremium && (
              <Button
                onClick={() => setScreen("pricing")}
                className="mt-4 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg"
              >
                <Crown className="w-4 h-4 mr-2" />
                Unlock Premium
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-orange-400 to-pink-500 text-white border-0 shadow-xl hover:scale-105 transition-transform">
              <div className="flex flex-col items-center gap-2">
                <Flame className="w-6 h-6 sm:w-8 sm:h-8" />
                <div className="text-2xl sm:text-3xl font-bold">{streak}</div>
                <div className="text-xs sm:text-sm opacity-90">Streak</div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl hover:scale-105 transition-transform">
              <div className="flex flex-col items-center gap-2">
                <Star className="w-6 h-6 sm:w-8 sm:h-8" />
                <div className="text-2xl sm:text-3xl font-bold">{totalPoints}</div>
                <div className="text-xs sm:text-sm opacity-90">Points</div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-cyan-400 to-blue-500 text-white border-0 shadow-xl hover:scale-105 transition-transform">
              <div className="flex flex-col items-center gap-2">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
                <div className="text-2xl sm:text-3xl font-bold">{completedPoses}</div>
                <div className="text-xs sm:text-sm opacity-90">Poses</div>
              </div>
            </Card>
          </div>

          {/* Free Exercises Button */}
          <Card 
            className="p-6 mb-8 bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-0 shadow-xl cursor-pointer hover:scale-102 transition-all"
            onClick={() => setScreen("free-exercises")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Free Exercises</h3>
                  <p className="text-sm opacity-90">Practice {freeExercises.length} exercises at your own pace</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6" />
            </div>
          </Card>

          {/* Personalized Tips */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-3">Tips for you ({userProfile.level})</h3>
                <div className="space-y-2">
                  {currentTips.slice(0, 3).map((tip, index) => (
                    <p key={index} className="text-sm opacity-90">{tip}</p>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Safety Warnings */}
          {userProfile.limitations.length > 0 && !userProfile.limitations.includes("No limitations") && (
            <Card className="p-4 mb-8 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">
                    Attention to your limitations
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    We selected safe poses for: {userProfile.limitations.join(", ")}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Recommended Sessions */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Recommended for you
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedSessions.map((session) => (
              <Card 
                key={session.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer relative"
                onClick={() => startSession(session)}
              >
                {session.isPremium && (
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white p-2 rounded-full">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${getDifficultyColor(session.level)}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                        {session.name}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getDifficultyColor(session.level)}`}>
                        {session.level}
                      </span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>{session.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                      <span>{session.poses.length} poses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>~{session.calories} calories</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {session.focus.map(f => (
                        <span key={f} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={`w-full mt-6 ${
                      session.isPremium && !userProfile.isPremium
                        ? "bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    } text-white shadow-lg`}
                  >
                    {session.isPremium && !userProfile.isPremium ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock
                      </>
                    ) : (
                      "Start Session"
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {recommendedSessions.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No sessions found for your criteria. Try adjusting your preferences.
              </p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // ACTIVE SESSION
  if (screen === "session" && selectedSession) {
    const currentPose = selectedSession.poses[currentPoseIndex];
    const isSessionComplete = currentPoseIndex === selectedSession.poses.length - 1 && timeRemaining === 0 && !isActive;
    const progress = ((currentPoseIndex + (selectedSession.poses[currentPoseIndex].duration - timeRemaining) / selectedSession.poses[currentPoseIndex].duration) / selectedSession.poses.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={backToDashboard}
              className="hover:bg-white/50"
            >
              ← Back
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">{totalPoints}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Session Progress
              </span>
              <span className="text-sm font-bold text-purple-600">
                {currentPoseIndex + 1} / {selectedSession.poses.length}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {isSessionComplete ? (
            <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-2xl">
              <CheckCircle2 className="w-20 h-20 mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Session Complete! 🎉
              </h2>
              <p className="text-xl mb-6 opacity-90">
                You earned {selectedSession.poses.length * (selectedSession.level === "advanced" ? 30 : selectedSession.level === "intermediate" ? 20 : 10)} points!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={resetSession}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  size="lg"
                >
                  Repeat Session
                </Button>
                <Button 
                  onClick={backToDashboard}
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  size="lg"
                >
                  Choose Another
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* Main Pose Card */}
              <Card className="overflow-hidden border-0 shadow-2xl mb-6">
                <div className={`h-3 bg-gradient-to-r ${getDifficultyColor(currentPose.difficulty)}`} />
                <div className="p-6 sm:p-8">
                  {/* Timer Circle */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <svg className="w-48 h-48 sm:w-64 sm:h-64 transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                          strokeDashoffset={2 * Math.PI * 45 * (1 - timeRemaining / currentPose.duration)}
                          className="transition-all duration-1000 ease-linear"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {timeRemaining}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            seconds
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pose Info */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {currentPose.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                      {currentPose.description}
                    </p>
                    <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-4 py-2 rounded-full mb-4">
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        💡 {currentPose.benefits}
                      </span>
                    </div>
                    {currentPose.precautions && (
                      <div className="inline-block bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full">
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                          ⚠️ {currentPose.precautions}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Detailed Instructions */}
                  {showInstructions && (
                    <div className="mb-8 space-y-6">
                      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3 mb-4">
                          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-3">
                              How to do it (step by step):
                            </h3>
                            <ol className="space-y-2">
                              {currentPose.stepByStep.map((step, index) => (
                                <li key={index} className="flex gap-3 text-sm text-blue-800 dark:text-blue-200">
                                  <span className="font-bold min-w-[24px]">{index + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-bold text-lg text-green-900 dark:text-green-100 mb-3">
                              Important tips:
                            </h3>
                            <ul className="space-y-2">
                              {currentPose.tips.map((tip, index) => (
                                <li key={index} className="flex gap-3 text-sm text-green-800 dark:text-green-200">
                                  <span className="text-green-600">✓</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={togglePause}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg px-8"
                    >
                      {isActive ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          {timeRemaining === currentPose.duration ? "Start" : "Continue"}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={resetSession}
                      size="lg"
                      variant="outline"
                      className="border-2"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Restart
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Poses Timeline */}
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
                  Next Poses
                </h3>
                <div className="space-y-3">
                  {selectedSession.poses.map((pose, index) => (
                    <div
                      key={pose.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        index === currentPoseIndex
                          ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                          : index < currentPoseIndex
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === currentPoseIndex
                          ? "bg-white text-purple-600"
                          : index < currentPoseIndex
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      }`}>
                        {index < currentPoseIndex ? "✓" : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{pose.name}</div>
                        <div className={`text-xs ${index === currentPoseIndex ? "opacity-90" : "opacity-70"}`}>
                          {pose.duration}s
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
