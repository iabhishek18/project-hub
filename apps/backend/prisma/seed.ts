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
      title: 'E-Commerce Platform with Next.js',
      description: 'Full-stack e-commerce application with cart, payments, and admin panel. Built with Next.js 14, Prisma, and Stripe integration.',
      longDescription: 'A complete e-commerce solution featuring product catalog, shopping cart, user authentication, payment processing with Stripe, order management, and a comprehensive admin dashboard. Built using modern React patterns with server components.',
      price: 2999,
      category: ProjectCategory.WEB_DEVELOPMENT,
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
      features: ['User authentication', 'Product CRUD', 'Shopping cart', 'Payment integration', 'Order tracking', 'Admin dashboard', 'Responsive design'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/ecommerce.zip',
      fileKey: 'projects/ecommerce.zip',
      isFeatured: true,
    },
    {
      title: 'AI-Powered Chatbot with Python',
      description: 'Intelligent chatbot using OpenAI GPT-4 API with conversation memory, custom training data support, and React frontend.',
      price: 3499,
      category: ProjectCategory.MACHINE_LEARNING,
      techStack: ['Python', 'FastAPI', 'OpenAI', 'React', 'Redis', 'Docker'],
      features: ['GPT-4 integration', 'Conversation memory', 'Custom training', 'REST API', 'WebSocket support', 'Docker deployment'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/chatbot.zip',
      fileKey: 'projects/chatbot.zip',
      isFeatured: true,
    },
    {
      title: 'Flutter Food Delivery App',
      description: 'Cross-platform food delivery app with real-time order tracking, payment integration, and restaurant management.',
      price: 4999,
      category: ProjectCategory.MOBILE_APP,
      techStack: ['Flutter', 'Dart', 'Firebase', 'Google Maps', 'Razorpay', 'Node.js'],
      features: ['Real-time tracking', 'Payment gateway', 'Push notifications', 'Restaurant panel', 'Driver app', 'Admin panel'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/food-delivery.zip',
      fileKey: 'projects/food-delivery.zip',
      isFeatured: true,
    },
    {
      title: 'Blockchain Voting System',
      description: 'Decentralized voting application built on Ethereum with smart contracts, ensuring transparent and tamper-proof elections.',
      price: 5999,
      category: ProjectCategory.BLOCKCHAIN,
      techStack: ['Solidity', 'Ethereum', 'Web3.js', 'React', 'Hardhat', 'IPFS'],
      features: ['Smart contracts', 'Voter verification', 'Result transparency', 'Gas optimization', 'MetaMask integration', 'Admin controls'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/voting.zip',
      fileKey: 'projects/voting.zip',
      isFeatured: false,
    },
    {
      title: 'IoT Smart Home Dashboard',
      description: 'Complete IoT dashboard for monitoring and controlling smart home devices with MQTT protocol and real-time data visualization.',
      price: 3999,
      category: ProjectCategory.IOT,
      techStack: ['React', 'Node.js', 'MQTT', 'InfluxDB', 'Grafana', 'Raspberry Pi'],
      features: ['Real-time monitoring', 'Device control', 'Data visualization', 'Alerts system', 'Mobile responsive', 'API documentation'],
      fileUrl: 'https://project-hub-files.s3.amazonaws.com/projects/smart-home.zip',
      fileKey: 'projects/smart-home.zip',
      isFeatured: false,
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

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
