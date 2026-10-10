/* =====================================================================
   Education Galaxy Point — site content.
   Everything a visitor reads comes from this one file: the notebook
   spreads, the index, results, courses, fees, faculty and contact.
   DEMO DATA: every name, score, fee and number below is a placeholder.
   Replace with real details before the site goes live.
   ===================================================================== */
window.EGP = {
  name: 'Education Galaxy Point',
  short: 'EGP',
  since: 2014,
  city: 'Chas, Bokaro',
  address: {
    line1: 'Saraswati Complex, Jodhadih More',
    line2: 'Chas, Bokaro Steel City',
    state: 'Jharkhand',
    pin: '827013'
  },
  phone: '+91 90000 00000',          // shown on the page
  phoneLink: '+919000000000',        // used for tel: links
  whatsapp: '919000000000',          // country code + number, digits only
  email: 'admissions@egpchas.in',
  hours: 'Mon – Sat · 6:30 AM – 8:00 PM',
  social: { instagram: '#', youtube: '#', facebook: '#' },

  session: '2026–27',
  resultYear: 2025,

  about:
    'Education Galaxy Point is a classroom coaching institute in Chas for Class 11 and 12 students — ' +
    'Science and Commerce. We started with one idea: a student from an ordinary family should get the same ' +
    'quality of teaching that big-city coaching sells for lakhs. Small batches, teachers who know every ' +
    'student by name, a test every week, and fees a family can actually pay. The results are in the notebook above.',

  /* the founder — his section on the page and his note in the notebook.
     The name, subject and photo are real; the story, numbers, quote and
     letter are DEMO text to be confirmed with him. */
  founder: {
    name: 'Amritesh Sir',
    role: 'Founder · Physics',
    since: 2014,
    photo: 'assets/img/amritesh-sir.jpg',
    story: [
      'Amritesh Sir started Education Galaxy Point in 2014 with one classroom in Chas and a simple belief: ' +
      'a student\'s result should depend on how hard they work, not on how much their family can pay.',
      'He still teaches every Physics batch himself — from Class 11 mechanics to Class 12 optics and modern ' +
      'physics, for the boards and for JEE / NEET. His classes slow down exactly where textbooks rush: every ' +
      'formula is derived on the board, every diagram is drawn live, and nobody leaves with a doubt they were afraid to ask.'
    ],
    quote: 'Physics is never difficult. It has only been explained too fast.',
    forces: ['Patience', 'Clarity', 'Discipline', 'Belief'],
    net: 'Net force: always towards the student',
    equation: 'Result = (Concept × Practice) ÷ Fear',
    equationNote: 'on the board, on the first day of every batch',
    stats: [
      ['12+', 'years teaching Physics'],
      ['2,400+', 'students taught since 2014'],
      ['Every day', 'he stays back for the doubt hour']
    ],
    letter:
      'The most important thing I teach is not a formula. It is that a hard chapter is only a chapter ' +
      'that hasn\'t been explained slowly enough yet. So bring your doubts — all of them. That is exactly what we are here for.'
  },

  why: [
    ['Fees a family can afford', 'A full year of Class 12 Science costs less than two months at a big-city institute.'],
    ['Small batches', 'Never more than 40 students, so every doubt gets asked — and answered.'],
    ['A test every Sunday', 'Board-pattern and JEE/NEET-pattern tests, checked and returned within the week.'],
    ['Parents stay informed', 'Monthly progress report and a parent–teacher meeting every term.'],
    ['Notes included', 'Printed chapter notes and daily practice sheets at no extra cost.'],
    ['Daily doubt hour', 'Teachers stay back every evening for one-on-one doubt clearing.']
  ],

  /* headline numbers — the cover of the notebook and the results section */
  stats: [
    { value: '68',   label: 'students scored 90% or more in the 2025 boards' },
    { value: '100%', label: 'board pass rate, five years running' },
    { value: '14',   label: 'students qualified JEE Main 2025' },
    { value: '11',   label: 'students qualified NEET 2025' }
  ],

  /* one notebook page per featured topper, two to a spread */
  featured: [
    {
      name: 'Aditi Kumari', stream: 'Class 12 · Science (PCM)', board: 'CBSE', year: 2025,
      school: 'DAV Public School, Chas', highlight: 'Bokaro District Topper',
      marks: [['Physics', 99], ['Chemistry', 98], ['Mathematics', 100], ['English', 97], ['Computer Sc.', 99]],
      quote: 'The Sunday tests made the board exam feel like just another Sunday.',
      photo: null, tint: [196, 128, 92]
    },
    {
      name: 'Rohit Mahato', stream: 'Class 12 · Science (PCB)', board: 'JAC', year: 2025,
      school: '+2 High School, Chas', highlight: 'State Rank 4 · JAC Science',
      marks: [['Physics', 97], ['Chemistry', 98], ['Biology', 99], ['English', 95], ['Hindi', 98]],
      quote: 'Sir explained every Biology diagram until I could draw it with my eyes closed.',
      photo: null, tint: [104, 140, 120]
    },
    {
      name: 'Sneha Singh', stream: 'Class 12 · Commerce', board: 'CBSE', year: 2025,
      school: 'Delhi Public School, Bokaro', highlight: 'School Topper · Commerce',
      marks: [['Accountancy', 100], ['Business St.', 98], ['Economics', 97], ['English', 96], ['Mathematics', 98]],
      quote: 'Accounts finally made sense when we practised one balance sheet every single day.',
      photo: null, tint: [170, 110, 140]
    },
    {
      name: 'Aman Raj', stream: 'Class 12 · Science (PCM)', board: 'CBSE', year: 2025,
      school: 'Chinmaya Vidyalaya, Bokaro', highlight: 'JEE Main 99.62 percentile',
      marks: [['Physics', 96], ['Chemistry', 95], ['Mathematics', 99], ['English', 94], ['Physical Ed.', 97]],
      quote: 'I prepared for boards and JEE together, without paying for two coachings.',
      photo: null, tint: [96, 120, 168]
    },
    {
      name: 'Priya Mahto', stream: 'Class 12 · Science (PCB)', board: 'JAC', year: 2025,
      school: 'Jawahar Vidya Mandir, Chas', highlight: 'NEET 2025 · 662 / 720',
      marks: [['Physics', 95], ['Chemistry', 96], ['Biology', 99], ['English', 93], ['Hindi', 96]],
      quote: 'Small batches meant I was never too shy to ask the same doubt twice.',
      photo: null, tint: [186, 150, 80]
    },
    {
      name: 'Saurav Kumar', stream: 'Class 12 · Science (PCM)', board: 'JAC', year: 2025,
      school: 'Govt. +2 School, Chas', highlight: 'JEE Main 98.9 percentile',
      marks: [['Physics', 96], ['Chemistry', 95], ['Mathematics', 99], ['English', 92], ['Hindi', 96]],
      quote: 'Daily practice sheets did more for me than any guide book.',
      photo: null, tint: [150, 110, 170]
    }
  ],

  /* five-year chart spread */
  history: [
    { year: 2021, above90: 21, best: '96.2%', by: 'Rakesh K.' },
    { year: 2022, above90: 29, best: '96.8%', by: 'Nisha P.' },
    { year: 2023, above90: 41, best: '97.6%', by: 'Ankit S.' },
    { year: 2024, above90: 53, best: '98.0%', by: 'Shreya M.' },
    { year: 2025, above90: 68, best: '98.6%', by: 'Aditi K.' }
  ],

  /* fees spread */
  feeCompare: [
    ['Big-city coaching', '₹1,20,000+ a year'],
    ['Online test-prep course', '₹40,000+ a year']
  ],
  feeOurs: '₹14,000 a year',
  feeOursNote: 'Class 12 Science, the full year. Pay monthly if you prefer.',
  included: [
    'Daily classes, 6 days a week',
    'Sunday test series',
    'Printed notes & practice sheets',
    'Daily doubt-clearing hour',
    'Monthly report to parents',
    'JEE / NEET foundation option'
  ],

  /* more results, listed under the notebook */
  results: [
    ['Aditi Kumari', 'Science (PCM)', 'CBSE', '98.6%'],
    ['Sneha Singh', 'Commerce', 'CBSE', '97.8%'],
    ['Rohit Mahato', 'Science (PCB)', 'JAC', '97.4%'],
    ['Aman Raj', 'Science (PCM)', 'CBSE', '96.2%'],
    ['Priya Mahto', 'Science (PCB)', 'JAC', '95.8%'],
    ['Saurav Kumar', 'Science (PCM)', 'JAC', '95.6%'],
    ['Khushi Agarwal', 'Commerce', 'CBSE', '95.4%'],
    ['Md. Faizan', 'Science (PCM)', 'CBSE', '95.0%'],
    ['Riya Gupta', 'Science (PCB)', 'CBSE', '94.8%'],
    ['Abhishek Mandal', 'Commerce', 'JAC', '94.6%'],
    ['Pooja Kumari', 'Science (PCB)', 'JAC', '94.2%'],
    ['Vikash Rajak', 'Science (PCM)', 'JAC', '93.8%']
  ],

  courses: [
    {
      name: 'Class 11 Science', detail: 'PCM or PCB · NCERT + board pattern · JEE/NEET basics',
      monthly: '₹1,200', yearly: '₹12,000'
    },
    {
      name: 'Class 12 Science', detail: 'PCM or PCB · board preparation · JEE/NEET-pattern tests',
      monthly: '₹1,400', yearly: '₹14,000'
    },
    {
      name: 'Class 11 & 12 Commerce', detail: 'Accountancy · Business Studies · Economics · Maths',
      monthly: '₹900', yearly: '₹9,000'
    },
    {
      name: 'JEE / NEET Foundation', detail: 'Add-on for Class 11 & 12 Science students · weekend classes',
      monthly: '₹600', yearly: '₹6,000'
    }
  ],
  batches: [
    ['Morning batch', '6:30 – 8:30 AM'],
    ['Evening batch', '4:00 – 6:00 PM'],
    ['Sunday test series', '9:00 – 12:00 noon']
  ],
  feeNotes: [
    'No admission or registration fee.',
    '10% off for a second child from the same family.',
    'Free scholarship test — up to 50% off for 90%+ in Class 10.'
  ],

  faculty: [
    { name: 'Amritesh Sir', subject: 'Physics · Founder', note: 'Teaches every Physics batch himself', photo: 'assets/img/amritesh-sir.jpg' },
    { name: 'Anjali Mishra', subject: 'Chemistry', note: 'M.Sc. Chemistry · 12 years teaching' },
    { name: 'Sunil Kumar', subject: 'Mathematics', note: 'M.Sc. Mathematics · 15 years teaching' },
    { name: 'Neha Prasad', subject: 'Biology', note: 'M.Sc. Zoology · 10 years teaching' },
    { name: 'P. K. Agarwal', subject: 'Commerce', note: 'M.Com, CA Inter · 14 years teaching' }
  ]
};
