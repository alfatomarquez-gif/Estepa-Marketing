# Estepa Marketing - Premium SaaS Application

🚀 **Enterprise-Level Marketing Automation Platform with Complete Admin Dashboard**

A premium, multi-page SaaS web application built with modern HTML5, CSS3, and JavaScript. This application showcases a professional marketing automation platform with advanced features, animations, responsive design, and a complete administrative dashboard powered by Supabase.

## ✨ Features

### 🎨 Modern Design
- **Glassmorphism UI** - Premium card designs with backdrop blur effects
- **Gradient Animations** - Dynamic, animated gradients throughout
- **Dark/Light Mode** - Seamless theme switching with localStorage persistence
- **Responsive Design** - Mobile-first approach, fully responsive across all devices

### 🚀 Advanced Functionality
- **Multi-Step Forms** - Progressive form validation with visual feedback
- **Smooth Animations** - Intersection Observer-based scroll animations
- **Animated Counters** - Number count-up animations for statistics
- **Interactive Components** - Tabs, accordions, modals, and toasts
- **Pricing Toggle** - Dynamic monthly/annual pricing switcher

### 🎯 Pages Included

#### Public Website
1. **index.html** - Homepage with hero section, features, and stats
2. **features.html** - Detailed feature showcase with tabs
3. **platform.html** - Platform architecture and technology
4. **pricing.html** - Interactive pricing tables with comparison
5. **about.html** - About us / company information
6. **contact.html** - Multi-step contact form with validation
7. **blog.html** - Blog and resources listing
8. **dashboard-preview.html** - Interactive dashboard simulation

#### Administrative Dashboard
1. **admin/dashboard.html** - Main dashboard with stats and analytics
2. **admin/companies.html** - Company management system
3. **admin/content.html** - Content creation and scheduling
4. **admin/media.html** - Media library with drag & drop upload
5. **admin/messages.html** - WhatsApp & Email messaging system
6. **admin/faq-generator.html** - AI-powered FAQ generator
7. **admin/calendar.html** - Interactive event calendar
8. **admin/analytics.html** - Performance metrics dashboard

### 🛠 Technical Stack
- **HTML5** - Semantic, accessible markup
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** - ES6+, modular architecture
- **Supabase** - Backend as a Service (Database, Storage, Auth, Edge Functions)
- **PostgreSQL** - Relational database with advanced features
- **OpenAI GPT-4** - AI-powered FAQ generation
- **No Framework** - Pure web technologies for maximum performance

## 📁 Project Structure

```
/
├── index.html
├── features.html
├── platform.html
├── pricing.html
├── about.html
├── contact.html
├── blog.html
├── dashboard-preview.html
│
├── admin/                    # Administrative Dashboard
│   ├── dashboard.html        # Main admin dashboard
│   ├── companies.html        # Company management
│   ├── content.html          # Content management
│   ├── media.html            # Media library
│   ├── messages.html         # Messaging system
│   ├── faq-generator.html    # AI FAQ generator
│   ├── calendar.html         # Event calendar
│   └── analytics.html        # Analytics dashboard
│
├── assets/
│   ├── css/
│   │   ├── main.css          # Variables, reset, utilities
│   │   ├── components.css    # Reusable UI components
│   │   ├── layout.css        # Header, footer, navigation
│   │   ├── animations.css    # Keyframes and transitions
│   │   ├── pages.css         # Page-specific styles
│   │   └── admin.css         # Admin dashboard styles
│   │
│   ├── js/
│   │   ├── main.js           # Core initialization
│   │   ├── navigation.js     # Menu and scroll behavior
│   │   ├── theme.js          # Dark/light mode toggle
│   │   ├── forms.js          # Form validation and handling
│   │   ├── supabase-client.js # Supabase API integration
│   │   └── admin.js          # Admin UI functionality
│   │
│   └── images/               # Image assets
│
├── database/
│   └── schema.sql            # Complete PostgreSQL schema
│
├── supabase/
│   └── functions/
│       └── generar-faq/      # Edge Function for AI FAQ generation
│           └── index.ts
│
├── config/
│   └── supabase-config.example.js  # Configuration template
│
├── docs/
│   └── INSTALACION.md        # Complete installation guide
│
├── .gitignore
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: `#667eea` (Purple-Blue)
- **Secondary**: `#764ba2` (Deep Purple)
- **Accent**: `#f5576c` (Coral)
- **Success**: `#00f2fe` (Cyan)

### Typography
- **Primary Font**: Inter
- **Heading Font**: Poppins
- **Display Font**: Space Grotesk

### Spacing Scale
Based on 4px increments (4, 8, 12, 16, 24, 32, 48, 64, 96, 128)

## 🚀 Getting Started

### Public Website - Quick Start
1. Clone the repository
2. Open `index.html` in a modern web browser
3. No build process required!

### Admin Dashboard - Full Setup
For the complete administrative dashboard with database and AI features, follow the detailed installation guide:

📚 **[Complete Installation Guide](docs/INSTALACION.md)**

**Quick Overview:**
1. Create a Supabase project (free)
2. Execute the database schema (`database/schema.sql`)
3. Configure Storage bucket for media files
4. Deploy Edge Functions for AI features
5. Update configuration with your credentials
6. Access admin dashboard at `/admin/dashboard.html`

### Local Development Server (Optional)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

Then visit:
- Public site: `http://localhost:8000`
- Admin dashboard: `http://localhost:8000/admin/dashboard.html`

## 🌟 Key Features Explained

### Scroll Animations
Elements fade in and animate as they enter the viewport using Intersection Observer API for optimal performance.

### Theme Switcher
Light and dark modes with smooth transitions. Theme preference is saved to localStorage.

### Multi-Step Form
Progressive contact form with real-time validation, visual feedback, and step indicators.

### Pricing Toggle
Switch between monthly and annual pricing with smooth animations.

### Responsive Navigation
Desktop mega menu with dropdowns, mobile hamburger menu with slide-in animation.

## 🎛️ Administrative Dashboard Features

The complete admin dashboard provides powerful tools for managing multiple client companies:

### 🏢 Company Management
- Create and manage multiple client companies
- Store contact information, social media profiles, and API tokens
- Track company activity and content statistics
- Filter and search companies by sector and status

### 📝 Content Management
- Create, schedule, and publish content across multiple social networks
- Support for posts, stories, reels, videos, and carousels
- Multi-platform scheduling (Facebook, Instagram, TikTok, YouTube, Twitter, LinkedIn)
- Draft, approval, and publication workflow
- Performance tracking with likes, comments, shares, and views

### 🖼️ Media Library
- Centralized media storage powered by Supabase Storage
- Drag & drop file upload
- Support for images, videos, documents, and audio
- Automatic thumbnail generation
- Tag-based organization
- Search and filter capabilities

### 💬 Messaging System
- WhatsApp and Email campaign management
- Template library for reusable messages
- AI-powered message generation
- Schedule messages for optimal timing
- Track delivery, opens, and clicks
- Campaign history and analytics

### 🤖 AI-Powered FAQ Generator
- Generate professional FAQs using GPT-4
- Customize tone (formal, informal, technical)
- Bulk generation (5-20 FAQs at once)
- Edit and refine generated content
- Categorize and prioritize FAQs
- Export to JSON/CSV

### 📅 Interactive Calendar
- Month, week, and day views
- Visual event management
- Drag & drop scheduling
- Event types: Publications, Meetings, Deadlines
- Reminders and notifications
- Integration with content publishing

### 📊 Analytics Dashboard
- Real-time performance metrics
- Engagement tracking across all platforms
- Content performance comparison
- Best performing posts analysis
- Export reports to PDF/Excel
- Custom date range filtering

### 🔐 Security & Data Management
- PostgreSQL database with Supabase
- Row Level Security (RLS) support
- Encrypted API tokens
- Automatic backups
- CRUD operations with validation
- Audit trails and logging

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Skip to content link
- Focus visible states

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Performance

- **No dependencies** - Zero external libraries
- **CSS Variables** - Dynamic theming without JavaScript
- **Lazy animations** - Only animate elements in viewport
- **Optimized assets** - Minimal file sizes
- **Mobile-first** - Optimized for mobile devices

## 📝 License

© 2024 Estepa Marketing. All rights reserved.

## 🤝 Contributing

This project includes:
- ✅ Complete backend integration with Supabase
- ✅ Real database operations (CRUD)
- ✅ File storage system
- ✅ AI-powered features with OpenAI
- ✅ Edge Functions for serverless computing

For further enhancements, consider:
- Adding user authentication system
- Implementing social media API integrations
- Adding real-time notifications
- Setting up CI/CD pipeline
- Adding comprehensive testing suite

## 🛠️ Database Schema

The system includes a complete PostgreSQL schema with:

- **9 Core Tables**: empresa, media, contenido, mensajes, faq, plantillas, calendario, analytics
- **Custom Types**: ENUMs for media types, content states, social networks, etc.
- **Indexes**: Optimized for search and performance
- **Triggers**: Auto-update timestamps
- **Views**: Pre-built queries for common operations
- **Constraints**: Data validation and integrity

View the complete schema: [`database/schema.sql`](database/schema.sql)

## 🔌 API Integration

The Supabase client provides complete API coverage:

```javascript
// Example: Create a company
const { data, error } = await SupabaseAPI.crearEmpresa({
  nombre: 'Mi Empresa',
  sector: 'Tecnología',
  email_contacto: 'info@miempresa.com'
});

// Example: Upload media
const file = document.querySelector('input[type="file"]').files[0];
const { data, error } = await SupabaseAPI.subirArchivo(file, empresaId);

// Example: Generate FAQs with AI
const { data, error } = await SupabaseAPI.generarFAQConIA(
  empresaId, 
  'Describe tu negocio...', 
  10
);
```

All API functions are documented in [`assets/js/supabase-client.js`](assets/js/supabase-client.js)
- Adding analytics tracking

## 📧 Contact

For questions or feedback, visit the contact page or open an issue.

---

**Built with ❤️ using modern web technologies**
