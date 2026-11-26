import {
  AchievementBadge,
  EvaluationQuestion,
  ExploreRegion,
  LearningMaterial,
  MissionItem,
  SquadRole,
} from '../types';
import { assetUrl } from '../utils/assetUrl';

export const HERO_ARTWORK_URL = assetUrl('src/assets/images/aqua_hero_artwork_1795181990401.jpg');

export const CHARACTER_PROFILES = [
  {
    id: 'aqua',
    name: 'Aqua',
    role: 'Penjelajah Tetesan Air',
    color: '#1677B8',
    description:
      'Tetesan air biru yang ceria dan rasa ingin tahunya tinggi. Aqua mengajakmu berpetualang mengitari bumi dari laut hingga ke gunung.',
  },
  {
    id: 'sunny',
    name: 'Sunny',
    role: 'Sumber Energi Matahari',
    color: '#F4C85A',
    description:
      'Matahari hangat yang memberikan energi panas agar air cair di laut, sungai, dan danau dapat menguap menjadi uap air.',
  },
  {
    id: 'cloudy',
    name: 'Cloudy',
    role: 'Pembentuk Awan Dingin',
    color: '#70C8E8',
    description:
      'Kumpulan jutaan tetesan air kecil dan kristal es di langit tinggi yang terbentuk saat uap air mengalami pendinginan.',
  },
  {
    id: 'rainy',
    name: 'Rainy',
    role: 'Pembawa Hujan Segar',
    color: '#1677B8',
    description:
      'Tetesan air hujan yang jatuh ke bumi karena gaya gravitasi saat titik-titik air di dalam awan sudah terlalu berat.',
  },
  {
    id: 'flora',
    name: 'Flora',
    role: 'Penjaga Hutan Tropis',
    color: '#83BC7A',
    description:
      'Tumbuhan hijau yang menyerap air tanah melalui akar dan melepaskan uap air kembali ke udara melalui daun (transpirasi).',
  },
];

export const SQUAD_ROLES: { role: SquadRole; label: string; duty: string }[] = [
  {
    role: 'Explorer',
    label: 'Explorer (Penjelajah)',
    duty: 'Memilih wilayah dan jalur petualangan tim.',
  },
  {
    role: 'Scientist',
    label: 'Scientist (Ilmuwan)',
    duty: 'Menjawab pertanyaan konsep ilmiah siklus air.',
  },
  {
    role: 'Builder',
    label: 'Builder (Perancang)',
    duty: 'Menyusun kepingan puzzle dan model siklus air.',
  },
  {
    role: 'Navigator',
    label: 'Navigator (Pengarah)',
    duty: 'Menentukan urutan tahapan proses yang tepat.',
  },
  {
    role: 'Reporter',
    label: 'Reporter (Penyaji)',
    duty: 'Menyimpulkan dan menjelaskan hasil diskusi kelompok.',
  },
];

export const LEARNING_MATERIALS: LearningMaterial[] = [
  {
    id: 'pengertian-siklus-air',
    order: 1,
    title: 'Apa Itu Siklus Air?',
    subtitle: 'Perjalanan air yang terus berputar di Bumi',
    stageTag: 'Konsep Dasar',
    imageUrl: assetUrl('src/assets/images/aqua_hero_artwork_1795181990401.jpg'),
    explanation:
      'Siklus air adalah perputaran air secara terus-menerus dari permukaan Bumi ke atmosfer (udara) lalu kembali lagi ke Bumi. Jumlah air di Bumi selalu tetap, hanya wujud dan tempatnya yang berubah-ubah.',
    keyPoints: [
      'Air dapat berubah wujud menjadi cair, gas (uap air), dan padat (es).',
      'Proses ini berlangsung berulang-ulang tanpa berhenti setiap hari.',
      'Energi matahari dan gaya gravitasi menjadi penggerak utama siklus air.',
    ],
    realLifeExample:
      'Air laut yang kita lihat di pantai hari ini bisa menguap, membentuk awan, turun menjadi hujan di pegunungan Jawa atau Sumatra, lalu mengalir lewat sungai kembali ke laut.',
    narrationScript:
      'Halo teman-teman! Aku Aqua. Siklus air adalah perjalanan air yang terus berputar dari Bumi ke langit dan kembali lagi ke Bumi. Karena siklus ini, air bersih di Bumi terus diperbarui.',
    quickCheck: {
      question: 'Mengapa air di Bumi tidak pernah habis meskipun terus digunakan setiap hari?',
      options: [
        'Karena air selalu mengalami siklus berulang dari Bumi ke atmosfer dan kembali lagi',
        'Karena air baru selalu datang dari luar angkasa setiap malam',
        'Karena sungai selalu menciptakan air baru dari bebatuan',
      ],
      correctIndex: 0,
      feedbackCorrect: 'Tepat sekali! Air terus berputar dalam siklus air sehingga jumlahnya terjaga.',
      feedbackWrong: 'Belum tepat. Air terjaga jumlahnya karena terus berputar dalam siklus air.',
    },
  },
  {
    id: 'evaporasi',
    order: 2,
    title: 'Evaporasi (Penguapan)',
    subtitle: 'Air cair berubah menjadi uap air karena panas',
    stageTag: 'Tahap 1 · Penguapan',
    imageUrl: assetUrl('src/assets/images/learning_evaporasi_1795181990510.jpg'),
    explanation:
      'Evaporasi adalah proses berubahnya air cair di laut, danau, sungai, dan sawah menjadi gas uap air yang tidak terlihat karena menerima energi panas dari Matahari.',
    keyPoints: [
      'Panas matahari membuat molekul air bergerak lebih cepat dan lepas ke udara.',
      'Uap air bersifat ringan dan merupakan gas tak kasatmata.',
      'Sekitar 86% penguapan global berasal dari permukaan laut yang luas.',
    ],
    realLifeExample:
      'Saat kamu menjemur baju basah di halaman sekolah pada siang hari yang terik, air pada baju menguap ke udara sehingga baju menjadi kering.',
    narrationScript:
      'Tahap pertama adalah evaporasi. Sinar matahari memanaskan air di laut dan sungai. Air cair menerima energi panas lalu berubah menjadi uap air tak terlihat yang naik ke langit.',
    quickCheck: {
      question: 'Apa yang terjadi pada air laut ketika menerima panas dari Matahari?',
      options: [
        'Air membeku menjadi bongkahan es',
        'Air berubah menjadi gas uap air dan naik ke udara',
        'Air langsung berubah menjadi awan gelap di permukaan laut',
      ],
      correctIndex: 1,
      feedbackCorrect: 'Benar! Panas matahari membuat air cair menguap menjadi gas uap air.',
      feedbackWrong: 'Ingat, panas matahari mengubah air cair menjadi gas uap air tak kasatmata.',
    },
  },
  {
    id: 'kondensasi',
    order: 3,
    title: 'Kondensasi (Pengembunan)',
    subtitle: 'Uap air mendingin menjadi tetesan air pembentuk awan',
    stageTag: 'Tahap 2 · Pembentukan Awan',
    imageUrl: assetUrl('src/assets/images/learning_kondensasi_1795181992873.jpg'),
    explanation:
      'Ketika uap air naik semakin tinggi ke atmosfer, suhu udara menjadi sangat dingin. Uap air melepaskan panas dan berubah kembali menjadi tetesan air cair yang sangat kecil atau kristal es yang berkumpul membentuk awan.',
    keyPoints: [
      'Penting: Awan bukanlah gas uap air, melainkan kumpulan tetesan air cair sangat kecil atau kristal es.',
      'Kondensasi terjadi karena suhu udara di ketinggian jauh lebih dingin.',
      'Tetesan kecil ini menempel pada partikel debu halus di udara.',
    ],
    realLifeExample:
      'Titik-titik air yang muncul di bagian luar gelas berisi es teh pada siang hari adalah contoh nyata kondensasi dari uap air di udara sekitar gelas.',
    narrationScript:
      'Tahap kedua adalah kondensasi. Di langit tinggi udaranya dingin. Uap air mendingin lalu berubah menjadi tetesan air sangat kecil yang berkumpul membentuk awan putih seperti Cloudy.',
    quickCheck: {
      question: 'Secara ilmiah, awan yang kita lihat di langit tersusun atas apa?',
      options: [
        'Kumpulan tetesan air cair yang sangat kecil atau kristal es',
        'Asap putih yang keluar dari gunung',
        'Gas uap air murni yang berwarna putih',
      ],
      correctIndex: 0,
      feedbackCorrect: 'Hebat! Awan adalah kumpulan tetesan air cair kecil atau kristal es hasil kondensasi.',
      feedbackWrong: 'Hati-hati! Uap air itu tidak terlihat. Awan terbentuk dari tetesan air cair kecil atau kristal es.',
    },
  },
  {
    id: 'presipitasi',
    order: 4,
    title: 'Presipitasi (Hujan)',
    subtitle: 'Air jatuh dari awan ke permukaan Bumi',
    stageTag: 'Tahap 3 · Hujan',
    imageUrl: assetUrl('src/assets/images/learning_presipitasi_1795181993117.jpg'),
    explanation:
      'Di dalam awan, jutaan tetesan air kecil saling bertumbukan dan bergabung menjadi tetesan yang lebih besar. Ketika sudah terlalu berat untuk ditahan oleh arus udara, tetesan air jatuh ke Bumi sebagai hujan (presipitasi).',
    keyPoints: [
      'Presipitasi di Indonesia umumnya turun dalam bentuk hujan air cair.',
      'Di daerah bersuhu sangat dingin, presipitasi bisa berbentuk salju atau hujan es.',
      'Gaya gravitasi menarik tetesan air berat jatuh menuju permukaan Bumi.',
    ],
    realLifeExample:
      'Awan mendung berwarna abu-abu gelap di musim hujan menandakan kandungan air yang sangat padat dan tebal hingga akhirnya turun membasahi sawah dan kebun.',
    narrationScript:
      'Tahap ketiga adalah presipitasi. Ketika tetesan air di awan makin banyak dan berat, udara tidak sanggup lagi menahannya. Rainy pun turun ke Bumi sebagai hujan!',
    quickCheck: {
      question: 'Kapan tetesan air di dalam awan mulai jatuh ke Bumi sebagai hujan?',
      options: [
        'Ketika tetesan air bergabung menjadi berat dan ditarik gravitasi',
        'Ketika matahari bersinar paling terik di tengah laut',
        'Ketika angin bertiup dari daratan menuju hutan',
      ],
      correctIndex: 0,
      feedbackCorrect: 'Betul! Tetesan air yang terlalu berat jatuh ke Bumi akibat gaya gravitasi.',
      feedbackWrong: 'Coba ingat lagi: tetesan air bergabung sampai terlalu berat lalu jatuh sebagai hujan.',
    },
  },
  {
    id: 'pengumpulan-air',
    order: 5,
    title: 'Pengumpulan Air (Collection)',
    subtitle: 'Air mengalir kembali ke sungai, danau, tanah, dan laut',
    stageTag: 'Tahap 4 · Aliran & Penyerapan',
    imageUrl: assetUrl('src/assets/images/learning_pengumpulan_1795181992159.jpg'),
    explanation:
      'Air hujan yang jatuh ke daratan mengalir melalui parit, sungai, danau, dan sawah menuju laut (aliran permukaan). Sebagian air juga meresap ke dalam tanah (infiltrasi) menjadi cadangan air tanah.',
    keyPoints: [
      'Air selalu mengalir dari tempat tinggi (gunung) ke tempat rendah (laut).',
      'Akar pohon di hutan membantu menyerap air hujan ke dalam tanah.',
      'Air yang terkumpul di laut siap mengalami evaporasi lagi.',
    ],
    realLifeExample:
      'Air hujan di pegunungan mengalir melalui sungai-sungai besar seperti Sungai Bengawan Solo atau Sungai Kapuas, mengairi sawah petani, lalu bermuara ke laut.',
    narrationScript:
      'Tahap keempat adalah pengumpulan air. Air hujan mengalir lewat sungai dan danau, serta meresap ke dalam tanah. Akhirnya air kembali ke laut untuk memulai siklus baru.',
    quickCheck: {
      question: 'Apa manfaat air hujan yang meresap ke dalam tanah melalui akar pepohonan?',
      options: [
        'Menjadi cadangan air tanah dan mencegah banjir',
        'Membuat awan langsung turun ke tanah',
        'Menghilangkan semua air di laut',
      ],
      correctIndex: 0,
      feedbackCorrect: 'Tepat! Penyerapan air oleh tanah dan hutan menyimpan cadangan air bersih dan mencegah banjir.',
      feedbackWrong: 'Kurang tepat. Air yang meresap ke tanah sangat bermanfaat sebagai cadangan air tanah.',
    },
  },
  {
    id: 'peran-matahari',
    order: 6,
    title: 'Peran Matahari dalam Siklus Air',
    subtitle: 'Mesin pemanas utama yang memulai penguapan',
    stageTag: 'Penggerak Energi',
    imageUrl: assetUrl('src/assets/images/learning_evaporasi_1795181990510.jpg'),
    explanation:
      'Tanpa energi panas Matahari, air di laut dan sungai tidak dapat menguap dengan cepat. Panas Matahari juga menghangatkan udara sehingga uap air naik ke atmosfer dan menggerakkan angin pembawa awan.',
    keyPoints: [
      'Matahari memberikan energi kalor (panas) untuk evaporasi dan transpirasi.',
      'Perbedaan suhu karena sinar matahari menciptakan angin yang menggeser awan ke daratan.',
      'Di Indonesia yang beriklim tropis, penyinaran matahari sepanjang tahun membuat siklus air aktif.',
    ],
    realLifeExample:
      'Pada musim kemarau yang sangat panas, air di waduk dan permukaan tanah cepat menguap. Sebaliknya, penguapan laut yang tinggi juga memicu terbentuknya awan hujan.',
    narrationScript:
      'Matahari seperti Sunny adalah sumber energi utama siklus air. Panas matahari memicu penguapan dan menggerakkan angin yang membawa awan menuju daratan.',
    quickCheck: {
      question: 'Apa yang akan terjadi jika Matahari tidak memancarkan panas ke Bumi?',
      options: [
        'Proses penguapan terhenti dan siklus air tidak berjalan lancar',
        'Air laut akan menguap dua kali lebih cepat',
        'Sungai akan mengalir ke atas gunung',
      ],
      correctIndex: 0,
      feedbackCorrect: 'Benar! Tanpa panas matahari, penguapan tidak terjadi dan siklus air terhenti.',
      feedbackWrong: 'Tanpa energi panas matahari, air tidak dapat menguap ke atmosfer.',
    },
  },
  {
    id: 'peran-gravitasi',
    order: 7,
    title: 'Peran Gravitasi dalam Siklus Air',
    subtitle: 'Gaya tarik Bumi yang membawa air kembali ke bawah',
    stageTag: 'Gaya Penggerak',
    imageUrl: assetUrl('src/assets/images/learning_pengumpulan_1795181992159.jpg'),
    explanation:
      'Jika Matahari mengangkat uap air ke atas, gaya gravitasi Bumi menarik air kembali ke bawah! Gravitasi membuat hujan jatuh ke permukaan Bumi, air sungai mengalir ke laut, dan air meresap ke dalam tanah.',
    keyPoints: [
      'Gravitasi menarik tetesan air berat dari awan jatuh sebagai hujan.',
      'Gravitasi membuat air mengalir dari puncak gunung ke lembah dan laut.',
      'Gravitasi membantu air meresap masuk melalui pori-pori tanah.',
    ],
    realLifeExample:
      'Air terjun di pegunungan Indonesia jatuh deras ke bawah menuju kolam sungai karena tarikan gaya gravitasi Bumi.',
    narrationScript:
      'Selain matahari, gaya gravitasi juga penting. Gravitasi menarik air hujan jatuh dari awan dan menggerakkan air sungai mengalir dari gunung menuju laut.',
    quickCheck: {
      question: 'Proses manakah yang digerakkan langsung oleh gaya gravitasi Bumi?',
      options: [
        'Jatuhnya air hujan dan mengalirnya air sungai ke dataran rendah',
        'Berubahnya air laut menjadi uap air yang ringan',
        'Mendinginnya udara di puncak atmosfer',
      ],
      correctIndex: 0,
      feedbackCorrect: 'Tepat! Gravitasi menarik hujan jatuh ke Bumi dan mengalirkan air sungai ke laut.',
      feedbackWrong: 'Ingat, gravitasi menarik benda ke bawah: hujan jatuh dan sungai mengalir ke laut.',
    },
  },
  {
    id: 'kehidupan-sehari-hari',
    order: 8,
    title: 'Siklus Air dalam Kehidupan & Transpirasi',
    subtitle: 'Menjaga hutan dan air bersih di sekitar kita',
    stageTag: 'Penerapan Nyata',
    imageUrl: assetUrl('src/assets/images/learning_presipitasi_1795181993117.jpg'),
    explanation:
      'Tumbuhan ikut membantu siklus air melalui transpirasi, yaitu pelepasan uap air dari permukaan daun. Menjaga hutan, tidak membuang sampah ke sungai, dan membuat biopori membantu siklus air tetap sehat bagi manusia.',
    keyPoints: [
      'Transpirasi: pelepasan uap air dari tumbuhan melalui stomata daun.',
      'Penebangan hutan liar mengurangi resapan air dan dapat memicu banjir serta kekeringan.',
      'Menghemat air bersih menjaga ketersediaan air bagi seluruh makhluk hidup.',
    ],
    realLifeExample:
      'Petani di Indonesia mengandalkan hujan dan irigasi sungai dari hutan pegunungan untuk mengairi sawah padi sepanjang tahun.',
    narrationScript:
      'Teman-teman, tumbuhan seperti Flora juga melepaskan uap air lewat daunnya, disebut transpirasi. Yuk kita jaga hutan dan sungai agar siklus air tetap bersih dan sehat!',
    quickCheck: {
      question: 'Mengapa menanam pohon di sekitar sekolah dan pegunungan membantu siklus air?',
      options: [
        'Akar pohon membantu meresapkan air hujan ke tanah dan daunnya melakukan transpirasi',
        'Pohon menghentikan turunnya hujan selama satu tahun penuh',
        'Daun pohon mengubah air tawar menjadi air laut',
      ],
      correctIndex: 0,
      feedbackCorrect: 'Luar biasa! Pohon membantu resapan air tanah dan melepaskan uap air alami.',
      feedbackWrong: 'Pohon sangat bermanfaat karena akarnya menyerap air hujan ke tanah dan daunnya membantu transpirasi.',
    },
  },
];

export const EXPLORE_REGIONS: ExploreRegion[] = [
  {
    id: 'sunlight-island',
    name: 'Sunlight Island',
    indonesianName: 'Pulau Sinar Matahari',
    topic: 'Evaporasi',
    stage: 'evaporasi',
    description:
      'Perairan pantai tropis yang hangat disinari langsung oleh Matahari. Tempat dimulainya penguapan air laut ke atmosfer.',
    interactionHint: 'Klik atau sentuh permukaan air laut yang berkilau untuk memicu animasi penguapan!',
    scientificFact:
      'Energi panas Matahari mengubah air laut cair menjadi gas uap air tak kasatmata yang naik ke udara.',
    cameraPosition: [-8.5, 4.2, 8.5],
    cameraTarget: [-5.2, 0.5, 2.2],
    markerPosition: [-5.5, 1.3, 2.5],
    accentColor: '#F4C85A',
    miniTask: {
      prompt: 'Apa penyebab utama air di Sunlight Island menguap ke udara?',
      options: [
        'Energi panas dari sinar Matahari',
        'Pendinginan dari batu karang pantai',
        'Tiupan angin dari bawah laut',
      ],
      correctIndex: 0,
      rewardPoints: 100,
    },
  },
  {
    id: 'cloud-kingdom',
    name: 'Cloud Kingdom',
    indonesianName: 'Kerajaan Awan',
    topic: 'Kondensasi',
    stage: 'kondensasi',
    description:
      'Wilayah langit tinggi yang sejuk tempat uap air berkumpul dan mendingin membentuk awan putih lembut.',
    interactionHint: 'Sentuh gugusan awan di langit untuk mengamati uap air mendingin menjadi titik-titik air!',
    scientificFact:
      'Awan terbentuk dari tetesan air cair yang sangat kecil atau kristal es hasil pendinginan uap air, bukan dari uap air gas.',
    cameraPosition: [-1.8, 7.6, 9.5],
    cameraTarget: [-0.8, 5.4, -0.5],
    markerPosition: [-1.0, 6.2, -0.2],
    accentColor: '#70C8E8',
    miniTask: {
      prompt: 'Apa wujud partikel penyusun awan saat proses kondensasi selesai?',
      options: [
        'Tetesan air cair yang sangat kecil atau kristal es',
        'Gas uap air yang masih panas',
        'Butiran pasir halus dari pegunungan',
      ],
      correctIndex: 0,
      rewardPoints: 100,
    },
  },
  {
    id: 'rainy-mountain',
    name: 'Rainy Mountain',
    indonesianName: 'Pegunungan Hujan',
    topic: 'Presipitasi',
    stage: 'presipitasi',
    description:
      'Puncak gunung hijau berkabut tempat awan yang berat melepaskan air hujan menyegarkan lereng dan pepohonan.',
    interactionHint: 'Sentuh awan hujan di atas puncak gunung untuk menjalankan animasi turunnya hujan!',
    scientificFact:
      'Ketika tetesan air di dalam awan bergabung menjadi semakin berat, gaya gravitasi menariknya turun ke Bumi sebagai presipitasi.',
    cameraPosition: [7.8, 6.2, 8.2],
    cameraTarget: [4.2, 3.2, -2.5],
    markerPosition: [4.3, 4.8, -2.5],
    accentColor: '#1677B8',
    miniTask: {
      prompt: 'Gaya alam apakah yang menarik tetesan air dari awan agar jatuh menjadi hujan?',
      options: ['Gaya gravitasi Bumi', 'Gaya magnet kutub', 'Gaya dorong akar pohon'],
      correctIndex: 0,
      rewardPoints: 100,
    },
  },
  {
    id: 'river-valley',
    name: 'River Valley',
    indonesianName: 'Lembah Sungai',
    topic: 'Pengumpulan Air',
    stage: 'pengumpulan',
    description:
      'Lembah subur tempat air hujan dari gunung berkumpul menjadi aliran sungai dan danau sebelum kembali ke laut.',
    interactionHint: 'Sentuh aliran sungai biru yang berkelok untuk mengikuti jalur air kembali ke laut!',
    scientificFact:
      'Air hujan mengalir melalui permukaan tanah, sungai, dan danau menuju laut, serta sebagian meresap ke dalam tanah.',
    cameraPosition: [2.2, 4.5, 9.2],
    cameraTarget: [0.5, 0.7, 1.5],
    markerPosition: [0.5, 1.2, 1.5],
    accentColor: '#1677B8',
    miniTask: {
      prompt: 'Ke mana aliran air sungai pada Lembah Sungai akhirnya bermuara?',
      options: [
        'Berkumpul kembali ke danau dan lautan luas',
        'Terbang langsung ke puncak gunung lagi',
        'Menghilang seluruhnya menjadi batu',
      ],
      correctIndex: 0,
      rewardPoints: 100,
    },
  },
  {
    id: 'forest-of-life',
    name: 'Forest of Life',
    indonesianName: 'Hutan Kehidupan',
    topic: 'Transpirasi (Pengayaan)',
    stage: 'transpirasi',
    description:
      'Hutan hujan tropis yang rindang tempat tumbuhan membantu siklus air dengan melepaskan uap air lewat daun.',
    interactionHint: 'Sentuh kanopi pepohonan hijau untuk melihat uap air dilepaskan dari daun tumbuhan!',
    scientificFact:
      'Transpirasi adalah proses pelepasan uap air dari tumbuhan melalui stomata daun menuju atmosfer, dibantu panas Matahari.',
    cameraPosition: [7.5, 3.8, 7.6],
    cameraTarget: [4.8, 1.2, 2.2],
    markerPosition: [4.8, 2.1, 2.2],
    accentColor: '#83BC7A',
    miniTask: {
      prompt: 'Apa nama proses pelepasan uap air dari daun tumbuhan ke udara?',
      options: ['Transpirasi', 'Infiltrasi', 'Kondensasi'],
      correctIndex: 0,
      rewardPoints: 120,
    },
  },
];

export const MISSIONS_LIST: MissionItem[] = [
  {
    id: 'the-rising-water',
    order: 1,
    title: 'The Rising Water',
    indonesianTitle: 'Misi 1: Air yang Menguap',
    regionId: 'sunlight-island',
    character: 'Sunny',
    story:
      'Aqua sedang bersantai di permukaan laut yang tenang di Sunlight Island. Sunny mulai bersinar cerah untuk memulai petualangan besar Aqua menuju langit!',
    objective: 'Bantu Aqua memahami proses evaporasi dan aktifkan penguapan air laut.',
    instructions: 'Aktifkan sinar matahari di panel misi, lalu jawab tantangan ilmiah Sunny.',
    activityType: 'heat-water',
    question: {
      prompt: 'Saat dipanaskan Matahari, Aqua berubah wujud dari air cair menjadi...',
      options: [
        'Gas uap air yang tidak terlihat dan naik ke udara',
        'Es batu yang mengapung di laut',
        'Titik hujan yang langsung jatuh ke pantai',
      ],
      correctIndex: 0,
      explanation: 'Energi panas matahari mengubah air cair menjadi gas uap air melalui evaporasi.',
    },
    rewardScore: 150,
    rewardStars: 3,
  },
  {
    id: 'the-cloud-maker',
    order: 2,
    title: 'The Cloud Maker',
    indonesianTitle: 'Misi 2: Pembentuk Awan',
    regionId: 'cloud-kingdom',
    character: 'Cloudy',
    story:
      'Uap air kini terbang tinggi memasuki Cloud Kingdom yang dingin. Di ketinggian ini, Cloudy menunggu untuk berkumpul membentuk awan putih!',
    objective: 'Dinginkan uap air di atmosfer untuk membentuk tetesan air penyusun awan.',
    instructions: 'Jalankan pendinginan uap air pada panel misi, lalu selesaikan pertanyaan Cloudy.',
    activityType: 'cool-vapor',
    question: {
      prompt: 'Mengapa uap air bisa membentuk awan saat berada di langit yang tinggi?',
      options: [
        'Karena suhu udara di atas dingin sehingga uap air mengembun menjadi tetesan air kecil',
        'Karena matahari membakar uap air menjadi asap putih',
        'Karena burung-burung mengumpulkan kabut di langit',
      ],
      correctIndex: 0,
      explanation:
        'Pendinginan di atmosfer menyebabkan kondensasi: uap air berubah menjadi tetesan air kecil atau kristal es pembentuk awan.',
    },
    rewardScore: 150,
    rewardStars: 3,
  },
  {
    id: 'the-falling-rain',
    order: 3,
    title: 'The Falling Rain',
    indonesianTitle: 'Misi 3: Hujan yang Turun',
    regionId: 'rainy-mountain',
    character: 'Rainy',
    story:
      'Awan di atas Rainy Mountain semakin tebal dan padat! Tetesan-tetesan air saling bergabung menjadi berat dan bersiap turun menyirami bumi.',
    objective: 'Picu presipitasi agar hujan turun membasahi pegunungan dan sawah.',
    instructions: 'Jalankan aksi penurunan hujan, lalu jawab pertanyaan dari Rainy.',
    activityType: 'trigger-rain',
    question: {
      prompt: 'Proses jatuhnya tetesan air dari awan menuju permukaan Bumi disebut...',
      options: ['Presipitasi', 'Evaporasi', 'Transpirasi'],
      correctIndex: 0,
      explanation: 'Presipitasi adalah turunnya air dari atmosfer ke Bumi dalam bentuk hujan, salju, atau hujan es.',
    },
    rewardScore: 150,
    rewardStars: 3,
  },
  {
    id: 'back-to-earth',
    order: 4,
    title: 'Back to Earth',
    indonesianTitle: 'Misi 4: Kembali ke Bumi',
    regionId: 'river-valley',
    character: 'Aqua',
    story:
      'Hujan telah membasahi lereng gunung! Sekarang Aqua harus menyusuri anak sungai di River Valley menuju danau dan kembali ke lautan.',
    objective: 'Arahkan aliran air sungai dan resapan tanah hingga kembali berkumpul di laut.',
    instructions: 'Aktifkan aliran pengumpulan air dan jawab tantangan Aqua.',
    activityType: 'guide-river',
    question: {
      prompt: 'Apa yang terjadi pada air hujan setelah jatuh di daratan pegunungan?',
      options: [
        'Mengalir melalui sungai ke laut dan sebagian meresap menjadi air tanah',
        'Diam selamanya di atas puncak batu gunung',
        'Berubah langsung menjadi awan di permukaan tanah',
      ],
      correctIndex: 0,
      explanation:
        'Pada tahap pengumpulan, air mengalir menuju sungai, danau, dan laut serta meresap ke dalam tanah (infiltrasi).',
    },
    rewardScore: 150,
    rewardStars: 3,
  },
  {
    id: 'nature-explorer',
    order: 5,
    title: 'Nature Explorer',
    indonesianTitle: 'Misi 5: Penjelajah Hutan',
    regionId: 'forest-of-life',
    character: 'Flora',
    story:
      'Di Forest of Life, Flora menunjukkan keajaiban hutan tropis Indonesia! Pepohonan tidak hanya menyimpan air di akar, tetapi juga melepaskan uap air dari daunnya.',
    objective: 'Amati proses transpirasi tumbuhan dan kuasai seluruh siklus air alami.',
    instructions: 'Aktifkan pelepasan uap air daun Flora, lalu selesaikan pertanyaan terakhir.',
    activityType: 'leaf-vapor',
    question: {
      prompt: 'Bagaimana hutan menjaga keseimbangan siklus air di Indonesia?',
      options: [
        'Akar menyerap air hujan ke tanah dan daun melepaskan uap air lewat transpirasi',
        'Daun menghalangi semua uap air naik ke langit',
        'Batang pohon mengubah air sungai menjadi minyak bumi',
      ],
      correctIndex: 0,
      explanation:
        'Hutan sangat penting karena menjaga resapan air tanah dan berkontribusi dalam pelepasan uap air melalui transpirasi.',
    },
    rewardScore: 200,
    rewardStars: 3,
  },
];

export const EVALUATION_ORDERING_ACTIVITY = {
  id: 'eval-ordering-1',
  prompt: 'Aktivitas Pengurutan: Susun 4 tahapan utama siklus air secara berurutan dari awal hingga kembali ke laut!',
  correctSequence: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Pengumpulan'],
  items: ['Presipitasi', 'Pengumpulan', 'Evaporasi', 'Kondensasi'],
  explanation:
    'Urutan siklus air dimulai dari Evaporasi (penguapan air oleh panas matahari), lalu Kondensasi (uap air mendingin membentuk awan), dilanjutkan Presipitasi (hujan turun ke Bumi), dan Pengumpulan (air kembali ke sungai, tanah, dan laut).',
};

export const EVALUATION_QUESTIONS: EvaluationQuestion[] = [
  {
    id: 'q1',
    order: 1,
    type: 'multiple-choice',
    topic: 'Konsep Dasar',
    prompt: 'Apa yang dimaksud dengan siklus air?',
    options: [
      'Perputaran air secara terus-menerus dari Bumi ke atmosfer dan kembali ke Bumi',
      'Proses pembuatan air minum di dalam pabrik',
      'Aliran air sungai yang hanya berhenti di danau',
      'Perubahan air laut menjadi garam di pantai',
    ],
    correctAnswer: 'Perputaran air secara terus-menerus dari Bumi ke atmosfer dan kembali ke Bumi',
    explanation: 'Siklus air adalah peredaran air secara berkelanjutan di Bumi dan atmosfer.',
  },
  {
    id: 'q2',
    order: 2,
    type: 'multiple-choice',
    topic: 'Evaporasi',
    prompt: 'Sumber energi utama yang memanaskan air laut agar terjadi evaporasi adalah...',
    options: ['Matahari', 'Bulan', 'Angin laut', 'Gelombang pasang'],
    correctAnswer: 'Matahari',
    explanation: 'Sinar matahari memberikan energi panas sehingga air cair berubah menjadi uap air.',
  },
  {
    id: 'q3',
    order: 3,
    type: 'true-false',
    topic: 'Kondensasi',
    prompt: 'Benar atau Salah: Awan putih di langit sebenarnya terbuat dari gas uap air yang masih panas.',
    options: ['Benar', 'Salah'],
    correctAnswer: 'Salah',
    explanation:
      'Salah! Uap air adalah gas tak terlihat. Awan tersusun atas tetesan air cair yang sangat kecil atau kristal es hasil kondensasi.',
  },
  {
    id: 'q4',
    order: 4,
    type: 'multiple-choice',
    topic: 'Kondensasi',
    prompt: 'Perubahan wujud dari gas uap air menjadi tetesan air kecil pembentuk awan disebut...',
    options: ['Kondensasi', 'Evaporasi', 'Presipitasi', 'Infiltrasi'],
    correctAnswer: 'Kondensasi',
    explanation: 'Kondensasi adalah proses pengembunan uap air akibat udara dingin di atmosfer.',
  },
  {
    id: 'q5',
    order: 5,
    type: 'multiple-choice',
    topic: 'Presipitasi',
    prompt: 'Saat titik-titik air di dalam awan bergabung menjadi berat dan jatuh ke Bumi sebagai hujan, proses ini disebut...',
    options: ['Presipitasi', 'Evaporasi', 'Transpirasi', 'Kondensasi'],
    correctAnswer: 'Presipitasi',
    explanation: 'Presipitasi mencakup jatuhnya air hujan, salju, atau hujan es dari awan ke Bumi.',
  },
  {
    id: 'q6',
    order: 6,
    type: 'true-false',
    topic: 'Peran Gravitasi',
    prompt: 'Benar atau Salah: Gaya gravitasi berperan menarik air hujan jatuh ke Bumi dan mengalirkan air sungai ke laut.',
    options: ['Benar', 'Salah'],
    correctAnswer: 'Benar',
    explanation: 'Benar! Gravitasi membuat air hujan jatuh dan mengalir dari dataran tinggi ke dataran rendah.',
  },
  {
    id: 'q7',
    order: 7,
    type: 'multiple-choice',
    topic: 'Transpirasi',
    prompt: 'Pelepasan uap air dari tumbuhan ke atmosfer melalui daun disebut...',
    options: ['Transpirasi', 'Presipitasi', 'Pengumpulan', 'Pembekuan'],
    correctAnswer: 'Transpirasi',
    explanation: 'Transpirasi adalah penguapan air yang berasal dari tubuh tumbuhan melalui stomata daun.',
  },
  {
    id: 'q8',
    order: 8,
    type: 'diagram-fill',
    topic: 'Melengkapi Diagram',
    prompt: 'Lengkapi diagram: Air Laut -> [ ... ] -> Uap Air Naik -> Kondensasi (Awan) -> Hujan.',
    diagramHint: 'Tahap pertama saat air laut menerima panas matahari.',
    options: ['Evaporasi', 'Presipitasi', 'Infiltrasi', 'Koleksi'],
    correctAnswer: 'Evaporasi',
    explanation: 'Air laut mengalami evaporasi terlebih dahulu sebelum uap air naik dan berkondensasi.',
  },
  {
    id: 'q9',
    order: 9,
    type: 'matching',
    topic: 'Mencocokkan Proses',
    prompt: 'Manakah pasangan yang tepat antara peristiwa sehari-hari dan tahapan siklus air?',
    options: [
      'Gelas es berembun di bagian luar = Kondensasi',
      'Air hujan jatuh ke sawah = Evaporasi',
      'Pakaian basah mengering di bawah terik matahari = Presipitasi',
      'Sungai mengalir ke laut = Transpirasi',
    ],
    correctAnswer: 'Gelas es berembun di bagian luar = Kondensasi',
    explanation: 'Uap air di udara mendingin saat menyentuh gelas es dan mengembun menjadi titik air (kondensasi).',
  },
  {
    id: 'q10',
    order: 10,
    type: 'multiple-choice',
    topic: 'Pengumpulan Air',
    prompt: 'Air hujan yang meresap ke dalam pori-pori tanah disebut proses...',
    options: ['Infiltrasi', 'Evaporasi', 'Kondensasi', 'Sublimasi'],
    correctAnswer: 'Infiltrasi',
    explanation: 'Infiltrasi adalah meresapnya air permukaan ke dalam tanah sehingga membentuk cadangan air tanah.',
  },
  {
    id: 'q11',
    order: 11,
    type: 'true-false',
    topic: 'Konsep Dasar',
    prompt: 'Benar atau Salah: Gas uap air hasil evaporasi di atas lautan dapat dilihat dengan mata telanjang seperti asap tebal.',
    options: ['Benar', 'Salah'],
    correctAnswer: 'Salah',
    explanation: 'Salah! Uap air adalah gas yang tidak berwarna dan tidak terlihat oleh mata.',
  },
  {
    id: 'q12',
    order: 12,
    type: 'diagram-fill',
    topic: 'Melengkapi Diagram',
    prompt: 'Lengkapi diagram: Awan mendung berat -> [ ... ] -> Air jatuh membasahi gunung & sawah -> Sungai.',
    diagramHint: 'Proses jatuhnya air dari atmosfer ke daratan.',
    options: ['Presipitasi', 'Evaporasi', 'Kondensasi', 'Transpirasi'],
    correctAnswer: 'Presipitasi',
    explanation: 'Presipitasi adalah tahap jatuhnya air dari awan ke permukaan bumi.',
  },
  {
    id: 'q13',
    order: 13,
    type: 'multiple-choice',
    topic: 'Kehidupan Sehari-hari',
    prompt: 'Apa dampak buruk penebangan hutan secara liar di lereng gunung terhadap siklus air?',
    options: [
      'Air hujan sulit meresap ke tanah sehingga memicu banjir saat hujan dan kekeringan saat kemarau',
      'Awan tidak dapat terbentuk di atas lautan lagi',
      'Air laut menjadi tawar seluruhnya',
      'Panas matahari berhenti menyinari daratan',
    ],
    correctAnswer:
      'Air hujan sulit meresap ke tanah sehingga memicu banjir saat hujan dan kekeringan saat kemarau',
    explanation: 'Akar pepohonan di hutan berperan penting menyerap air hujan ke dalam tanah.',
  },
  {
    id: 'q14',
    order: 14,
    type: 'matching',
    topic: 'Mencocokkan Peran',
    prompt: 'Pilih pasangan karakter dan perannya yang paling tepat dalam siklus air!',
    options: [
      'Sunny (Matahari) = Memberikan panas untuk penguapan',
      'Cloudy (Awan) = Mengalirkan air sungai ke laut',
      'Flora (Tumbuhan) = Menarik air hujan jatuh dengan gravitasi',
      'Rainy (Hujan) = Mengubah air laut menjadi uap air',
    ],
    correctAnswer: 'Sunny (Matahari) = Memberikan panas untuk penguapan',
    explanation: 'Matahari memberikan energi panas yang menggerakkan evaporasi dan transpirasi.',
  },
  {
    id: 'q15',
    order: 15,
    type: 'multiple-choice',
    topic: 'Evaporasi',
    prompt: 'Mengapa genangan air di halaman sekolah lebih cepat hilang pada siang hari yang cerah dibanding malam hari?',
    options: [
      'Karena energi panas Matahari di siang hari mempercepat penguapan',
      'Karena gravitasi hanya bekerja pada malam hari',
      'Karena air genangan membeku di siang hari',
      'Karena awan menyerap air genangan secara langsung',
    ],
    correctAnswer: 'Karena energi panas Matahari di siang hari mempercepat penguapan',
    explanation: 'Suhu hangat dari sinar matahari mempercepat perubahan air cair menjadi uap air.',
  },
  {
    id: 'q16',
    order: 16,
    type: 'true-false',
    topic: 'Pengumpulan Air',
    prompt: 'Benar atau Salah: Permukaan jalan yang seluruhnya tertutup aspal dan beton membantu air hujan lebih cepat meresap ke dalam tanah.',
    options: ['Benar', 'Salah'],
    correctAnswer: 'Salah',
    explanation: 'Salah! Beton dan aspal menghalangi infiltrasi air ke tanah sehingga dapat memperbesar genangan atau banjir.',
  },
  {
    id: 'q17',
    order: 17,
    type: 'diagram-fill',
    topic: 'Melengkapi Diagram',
    prompt: 'Lengkapi diagram: Hujan di pegunungan -> Aliran Sungai & Infiltrasi -> [ ... ] di danau dan laut.',
    diagramHint: 'Tahap keempat dalam siklus air utama.',
    options: ['Pengumpulan', 'Kondensasi', 'Transpirasi', 'Evaporasi'],
    correctAnswer: 'Pengumpulan',
    explanation: 'Tahap pengumpulan (collection) mengumpulkan air yang jatuh kembali ke sungai, danau, tanah, dan laut.',
  },
  {
    id: 'q18',
    order: 18,
    type: 'multiple-choice',
    topic: 'Kondensasi',
    prompt: 'Mengapa uap air mengalami kondensasi ketika bergerak semakin tinggi ke langit?',
    options: [
      'Karena suhu udara semakin ke atas semakin dingin',
      'Karena tekanan sinar matahari di langit lebih panas dari daratan',
      'Karena di langit ada banyak sungai yang membeku',
      'Karena gravitasi mendorong uap air ke luar angkasa',
    ],
    correctAnswer: 'Karena suhu udara semakin ke atas semakin dingin',
    explanation: 'Penurunan suhu di atmosfer membuat uap air melepaskan panas dan mengembun menjadi titik-titik air.',
  },
  {
    id: 'q19',
    order: 19,
    type: 'matching',
    topic: 'Mencocokkan Istilah',
    prompt: 'Cocokkan istilah ilmiah berikut dengan artinya yang tepat!',
    options: [
      'Presipitasi = Turunnya air dari awan ke permukaan Bumi',
      'Evaporasi = Pendinginan uap air membentuk awan',
      'Kondensasi = Aliran air sungai menuju lautan',
      'Pengumpulan = Pelepasan uap air dari daun tumbuhan',
    ],
    correctAnswer: 'Presipitasi = Turunnya air dari awan ke permukaan Bumi',
    explanation: 'Presipitasi berarti turunnya air dari atmosfer ke Bumi (hujan/salju).',
  },
  {
    id: 'q20',
    order: 20,
    type: 'multiple-choice',
    topic: 'Kehidupan Sehari-hari',
    prompt: 'Kegiatan siswa di sekolah berikut yang paling membantu menjaga kelestarian siklus air adalah...',
    options: [
      'Menanam pohon, membuat lubang biopori, dan menutup keran air setelah dipakai',
      'Membuang sampah plastik ke selokan agar terbawa arus',
      'Menutup seluruh halaman tanah sekolah dengan semen tebal',
      'Membiarkan keran air terus mengalir sepanjang jam pelajaran',
    ],
    correctAnswer: 'Menanam pohon, membuat lubang biopori, dan menutup keran air setelah dipakai',
    explanation: 'Menanam pohon dan membuat biopori membantu penyerapan air tanah, serta menghemat air menjaga cadangan air bersih.',
  },
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'evaporation-explorer',
    title: 'Evaporation Explorer',
    description: 'Berhasil mengamati dan memahami bagaimana panas Matahari menguapkan air laut.',
    category: 'pemahaman',
    requirementText: 'Jelajahi Sunlight Island atau selesaikan Misi 1',
    points: 100,
  },
  {
    id: 'cloud-creator',
    title: 'Cloud Creator',
    description: 'Memahami bahwa awan terbentuk dari tetesan air kecil atau kristal es hasil kondensasi.',
    category: 'pemahaman',
    requirementText: 'Jelajahi Cloud Kingdom atau selesaikan Misi 2',
    points: 100,
  },
  {
    id: 'rain-master',
    title: 'Rain Master',
    description: 'Menguasai proses presipitasi dan peran gravitasi dalam menurunkan hujan.',
    category: 'ketepatan',
    requirementText: 'Jelajahi Rainy Mountain atau selesaikan Misi 3',
    points: 120,
  },
  {
    id: 'water-collector',
    title: 'Water Collector',
    description: 'Menelusuri jalur air dari pegunungan, sungai, hingga kembali ke lautan.',
    category: 'pemahaman',
    requirementText: 'Jelajahi River Valley atau selesaikan Misi 4',
    points: 120,
  },
  {
    id: 'teamwork-hero',
    title: 'Teamwork Hero',
    description: 'Berkolaborasi bersama tim dalam Squad Mode dengan pembagian peran yang kompak.',
    category: 'kerjasama',
    requirementText: 'Selesaikan permainan dalam Squad Mode',
    points: 150,
  },
  {
    id: 'water-hero',
    title: 'Water Hero',
    description: 'Berhasil menyelesaikan keempat Mini Games siklus air dengan ketepatan tinggi.',
    category: 'ketepatan',
    requirementText: 'Mainkan mini game atau raih 10 bintang',
    points: 200,
  },
  {
    id: 'master-of-water',
    title: 'Master of Water',
    description: 'Gelar kehormatan tertinggi bagi siswa yang menuntaskan seluruh misi dan evaluasi IPAS.',
    category: 'mastery',
    requirementText: 'Selesaikan seluruh 5 Misi & Evaluasi nilai >= 80',
    points: 300,
  },
];
