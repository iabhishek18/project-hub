import { PrismaClient, UserRole, ProjectCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@projecthub.com' },
    update: {},
    create: {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@projecthub.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const sampleProjects = [
    {
      title: 'Netflix Clone - Full Stack Streaming Platform',
      description: 'A complete Netflix clone with video streaming, user profiles, subscription management, and recommendation engine.',
      longDescription: 'Build your own OTT platform with this production-grade Netflix clone. Features include adaptive bitrate streaming with HLS, multiple user profiles, watch history, recommendation engine using collaborative filtering, Stripe subscription tiers, and a responsive UI that works on all devices.',
      price: 4999,
      category: ProjectCategory.WEB_DEVELOPMENT,
      techStack: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'AWS S3', 'Stripe', 'Tailwind CSS', 'Redis'],
      features: ['Video streaming with HLS', 'Multiple user profiles', 'Recommendation engine', 'Subscription tiers', 'Watch history & continue watching', 'Admin content management', 'Responsive on all devices', 'Search with filters'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/netflix-clone.zip',
      fileKey: 'projects/netflix-clone.zip',
      isFeatured: true,
    },
    {
      title: 'AI Resume Builder with ATS Score Checker',
      description: 'GPT-4 powered resume builder that generates ATS-friendly resumes and provides instant scoring with improvement suggestions.',
      longDescription: 'Stand out in job applications with AI-generated resumes tailored to specific job descriptions. Features ATS score analysis, keyword optimization, multiple templates, PDF export, cover letter generation, and LinkedIn profile optimization tips.',
      price: 2499,
      category: ProjectCategory.MACHINE_LEARNING,
      techStack: ['Python', 'FastAPI', 'OpenAI GPT-4', 'React', 'Tailwind CSS', 'MongoDB', 'Docker'],
      features: ['AI resume generation', 'ATS score checker', 'Job description matching', 'Multiple templates', 'PDF export', 'Cover letter generator', 'Keyword optimization', 'LinkedIn tips'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/ai-resume.zip',
      fileKey: 'projects/ai-resume.zip',
      isFeatured: true,
    },
    {
      title: 'WhatsApp Clone - Real-time Chat Application',
      description: 'Full-featured WhatsApp clone with real-time messaging, voice/video calls, group chats, and end-to-end encryption.',
      longDescription: 'A complete messaging platform built with modern real-time technologies. Includes one-on-one chat, group messaging, media sharing, voice messages, online status, typing indicators, message read receipts, and WebRTC-based voice/video calling.',
      price: 5999,
      category: ProjectCategory.WEB_DEVELOPMENT,
      techStack: ['React', 'Node.js', 'Socket.io', 'WebRTC', 'MongoDB', 'Redis', 'Express', 'Tailwind CSS'],
      features: ['Real-time messaging', 'Voice & video calls', 'Group chats', 'Media sharing', 'Online status', 'Read receipts', 'Typing indicators', 'Push notifications'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/whatsapp-clone.zip',
      fileKey: 'projects/whatsapp-clone.zip',
      isFeatured: true,
    },
    {
      title: 'Uber Clone - Ride Sharing Mobile App',
      description: 'Complete ride-sharing app with real-time tracking, fare estimation, driver matching, and payment integration.',
      price: 7999,
      category: ProjectCategory.MOBILE_APP,
      techStack: ['React Native', 'Node.js', 'Socket.io', 'Google Maps', 'Razorpay', 'PostgreSQL', 'Redis'],
      features: ['Real-time ride tracking', 'Driver matching algorithm', 'Fare estimation', 'Split payments', 'Rating system', 'Ride history', 'Push notifications', 'Admin dashboard'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/uber-clone.zip',
      fileKey: 'projects/uber-clone.zip',
      isFeatured: true,
    },
    {
      title: 'Stock Market Prediction using LSTM',
      description: 'Deep learning model for stock price prediction using LSTM neural networks with real-time data visualization dashboard.',
      longDescription: 'Predict stock market trends with this LSTM-based deep learning project. Includes data collection from Yahoo Finance API, feature engineering, model training with TensorFlow, backtesting framework, and a React dashboard for real-time predictions and portfolio tracking.',
      price: 3999,
      category: ProjectCategory.DATA_SCIENCE,
      techStack: ['Python', 'TensorFlow', 'LSTM', 'Pandas', 'React', 'D3.js', 'Flask', 'Yahoo Finance API'],
      features: ['LSTM prediction model', 'Real-time data fetching', 'Interactive charts', 'Backtesting framework', 'Portfolio tracker', 'Multiple stock support', 'Technical indicators', 'Export predictions'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/stock-prediction.zip',
      fileKey: 'projects/stock-prediction.zip',
      isFeatured: false,
    },
    {
      title: 'DeFi Yield Farming Platform',
      description: 'Decentralized finance platform with yield farming, liquidity pools, staking, and governance token mechanics.',
      price: 8999,
      category: ProjectCategory.BLOCKCHAIN,
      techStack: ['Solidity', 'Hardhat', 'React', 'ethers.js', 'The Graph', 'IPFS', 'Chainlink', 'OpenZeppelin'],
      features: ['Yield farming pools', 'Liquidity provision', 'Staking mechanism', 'Governance voting', 'Token swap', 'Portfolio dashboard', 'Gas optimization', 'Multi-chain support'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/defi-platform.zip',
      fileKey: 'projects/defi-platform.zip',
      isFeatured: false,
    },
    {
      title: 'Kubernetes Auto-Scaling CI/CD Pipeline',
      description: 'Production-grade CI/CD pipeline with auto-scaling Kubernetes deployment, monitoring, and zero-downtime releases.',
      price: 4499,
      category: ProjectCategory.DEVOPS,
      techStack: ['Kubernetes', 'Docker', 'GitHub Actions', 'Terraform', 'Prometheus', 'Grafana', 'ArgoCD', 'Helm'],
      features: ['Auto-scaling pods', 'Blue-green deployments', 'Monitoring dashboards', 'Log aggregation', 'Secret management', 'Infrastructure as code', 'Automated rollbacks', 'Slack notifications'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/k8s-pipeline.zip',
      fileKey: 'projects/k8s-pipeline.zip',
      isFeatured: false,
    },
    {
      title: 'Multiplayer Battle Royale Game',
      description: 'Real-time multiplayer battle royale game with matchmaking, leaderboards, and in-game purchases.',
      price: 9999,
      category: ProjectCategory.GAME_DEVELOPMENT,
      techStack: ['Unity', 'C#', 'Photon PUN', 'Node.js', 'MongoDB', 'AWS GameLift', 'Firebase'],
      features: ['100-player lobbies', 'Real-time combat', 'Matchmaking system', 'Leaderboards', 'In-game store', 'Custom skins', 'Anti-cheat system', 'Cross-platform play'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/battle-royale.zip',
      fileKey: 'projects/battle-royale.zip',
      isFeatured: true,
    },
    {
      title: 'Cloud-Native Microservices E-Commerce',
      description: 'Microservices architecture e-commerce platform with service mesh, event sourcing, and CQRS pattern.',
      price: 6999,
      category: ProjectCategory.CLOUD_COMPUTING,
      techStack: ['Go', 'gRPC', 'Kafka', 'PostgreSQL', 'Redis', 'Docker', 'Istio', 'React'],
      features: ['Microservices architecture', 'Event sourcing', 'CQRS pattern', 'Service mesh', 'API gateway', 'Distributed tracing', 'Circuit breaker', 'Auto-scaling'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/microservices-ecom.zip',
      fileKey: 'projects/microservices-ecom.zip',
      isFeatured: false,
    },
    {
      title: 'Penetration Testing Automation Suite',
      description: 'Automated penetration testing toolkit with vulnerability scanning, exploit modules, and comprehensive reporting.',
      price: 5499,
      category: ProjectCategory.CYBERSECURITY,
      techStack: ['Python', 'Nmap', 'Metasploit API', 'React', 'PostgreSQL', 'Docker', 'Celery', 'Redis'],
      features: ['Automated scanning', 'Vulnerability detection', 'Exploit modules', 'Report generation', 'Asset management', 'Scheduled scans', 'API integrations', 'Team collaboration'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/pentest-suite.zip',
      fileKey: 'projects/pentest-suite.zip',
      isFeatured: false,
    },
    {
      title: 'Smart Agriculture IoT Monitoring System',
      description: 'IoT-based precision agriculture system with soil monitoring, automated irrigation, and crop health prediction.',
      price: 4499,
      category: ProjectCategory.IOT,
      techStack: ['Arduino', 'ESP32', 'MQTT', 'Node.js', 'React', 'TensorFlow Lite', 'InfluxDB', 'Grafana'],
      features: ['Soil moisture monitoring', 'Automated irrigation', 'Weather integration', 'Crop health AI', 'Mobile alerts', 'Historical analytics', 'Multi-zone support', 'Solar powered'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/smart-agri.zip',
      fileKey: 'projects/smart-agri.zip',
      isFeatured: false,
    },
    {
      title: 'TikTok Clone - Short Video Platform',
      description: 'Complete TikTok clone with video recording, effects, infinite scroll feed, likes, comments, and creator monetization.',
      longDescription: 'Build the next viral short-video platform with this comprehensive TikTok clone. Features video recording with filters and effects, AI-powered content recommendation, infinite scroll feed, duets, stitches, live streaming, creator fund dashboard, and brand partnership tools.',
      price: 6499,
      category: ProjectCategory.MOBILE_APP,
      techStack: ['React Native', 'Node.js', 'FFmpeg', 'AWS MediaConvert', 'Redis', 'PostgreSQL', 'Socket.io', 'ML Kit'],
      features: ['Video recording & editing', 'AR filters & effects', 'Infinite scroll feed', 'AI recommendations', 'Live streaming', 'Duets & stitches', 'Creator monetization', 'Analytics dashboard'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/tiktok-clone.zip',
      fileKey: 'projects/tiktok-clone.zip',
      isFeatured: true,
    },
  ];

  for (const project of sampleProjects) {
    await prisma.project.create({
      data: {
        ...project,
        price: project.price,
      },
    });
  }

  console.log('Seed data created successfully: 12 projects added');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
