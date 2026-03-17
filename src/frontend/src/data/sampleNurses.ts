export interface SampleNurse {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  pincode: string;
  phone: string;
  bio: string;
  isAvailable: boolean;
  photoUrl: string;
  initials: string;
  registrationNumber: string;
}

export const SAMPLE_NURSES: SampleNurse[] = [
  {
    id: "sample-1",
    name: "Priya Sharma",
    specialization: "General & Elderly Care",
    experience: 9,
    pincode: "462001",
    phone: "+91 98765 43210",
    bio: "Experienced nurse specializing in geriatric care and chronic disease management. Provides compassionate home visits for elderly patients in rural Bhopal region.",
    isAvailable: true,
    photoUrl: "/assets/generated/nurse-priya.dim_400x400.jpg",
    initials: "PS",
    registrationNumber: "NC-SAMPLE-001",
  },
  {
    id: "sample-2",
    name: "Rajesh Kumar",
    specialization: "Post-Surgical Care",
    experience: 12,
    pincode: "462001",
    phone: "+91 87654 32109",
    bio: "Skilled in post-operative wound care, IV therapy, and rehabilitation support. Trusted by hundreds of families across rural districts.",
    isAvailable: true,
    photoUrl: "/assets/generated/nurse-rajesh.dim_400x400.jpg",
    initials: "RK",
    registrationNumber: "NC-SAMPLE-002",
  },
  {
    id: "sample-3",
    name: "Anita Verma",
    specialization: "Maternal & Child Health",
    experience: 7,
    pincode: "462011",
    phone: "+91 76543 21098",
    bio: "Dedicated to maternal and neonatal health, antenatal care, and immunization. Committed to reducing infant mortality in underserved communities.",
    isAvailable: true,
    photoUrl: "/assets/generated/nurse-anita.dim_400x400.jpg",
    initials: "AV",
    registrationNumber: "NC-SAMPLE-003",
  },
  {
    id: "sample-4",
    name: "Sunita Patel",
    specialization: "Diabetes & Cardiac Care",
    experience: 15,
    pincode: "462021",
    phone: "+91 65432 10987",
    bio: "Specialized in diabetic foot care, insulin management, and blood pressure monitoring. Brings clinical expertise directly to patients' homes.",
    isAvailable: false,
    photoUrl: "",
    initials: "SP",
    registrationNumber: "NC-SAMPLE-004",
  },
  {
    id: "sample-5",
    name: "Mohan Singh",
    specialization: "Palliative & Pain Management",
    experience: 10,
    pincode: "462031",
    phone: "+91 54321 09876",
    bio: "Compassionate care for patients with serious illness, focusing on comfort, dignity, and quality of life during difficult times.",
    isAvailable: true,
    photoUrl: "",
    initials: "MS",
    registrationNumber: "NC-SAMPLE-005",
  },
  {
    id: "sample-6",
    name: "Kavita Rao",
    specialization: "Physiotherapy Support",
    experience: 6,
    pincode: "462041",
    phone: "+91 43210 98765",
    bio: "Provides physiotherapy-assisted care and mobility support for stroke recovery, orthopaedic patients, and accident victims in rural areas.",
    isAvailable: true,
    photoUrl: "",
    initials: "KR",
    registrationNumber: "NC-SAMPLE-006",
  },
];

export const SAMPLE_FEEDBACK = [
  {
    id: "fb-1",
    patientName: "Ramesh Gupta",
    rating: 5,
    reviewText:
      "Nurse Priya was incredibly kind and professional. She visited my mother daily and made her recovery so much smoother. Highly recommend!",
    initials: "RG",
  },
  {
    id: "fb-2",
    patientName: "Lata Mishra",
    rating: 5,
    reviewText:
      "Rajesh sir took care of my husband post-surgery for three weeks. His expertise and gentle approach helped our family through a very difficult time.",
    initials: "LM",
  },
  {
    id: "fb-3",
    patientName: "Dinesh Tiwari",
    rating: 4,
    reviewText:
      "Very professional service. The nurse arrived on time and handled the wound dressing with great care. Easy to contact through the app.",
    initials: "DT",
  },
  {
    id: "fb-4",
    patientName: "Sarla Devi",
    rating: 5,
    reviewText:
      "As a senior citizen living alone, having a trusted nurse visit me was a blessing. She is prompt, caring, and very knowledgeable.",
    initials: "SD",
  },
];
