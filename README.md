# 🛡️ FirewallX - Advanced Personal Firewall Management System

<div align="center">

**A modern, real-time firewall management dashboard with intelligent packet monitoring and alert system**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)

---

## 🎯 Overview

**FirewallX** is a cutting-edge web-based firewall management system designed for real-time network security monitoring. It provides an intuitive cybersecurity-themed interface for managing firewall rules, monitoring packet logs, and receiving instant security alerts.

### Why FirewallX?

- **Real-time Monitoring**: Live packet tracking and instant threat detection
- **Smart Rule Management**: Dynamic firewall rules with priority-based execution
- **Instant Alerts**: Automated security notifications with severity levels
- **Beautiful UI**: Cyberpunk-inspired dark theme with neon accents
- **Secure Backend**: Row-Level Security (RLS) policies ensure data isolation
- **Scalable Architecture**: Built on Supabase for enterprise-grade performance

---

## ✨ Features

### 🔐 Authentication System
- Secure email/password authentication
- Auto-confirm email signups
- Protected routes with session management
- User profile management

### 📊 Real-time Dashboard
- Live statistics for blocked/allowed packets
- Active firewall rules counter
- Recent security alerts overview
- Quick navigation to all modules

### 🎯 Firewall Rules Management
- Create custom firewall rules (ALLOW/DENY/LOG)
- Protocol-specific filtering (TCP/UDP/ICMP/ALL)
- Source/Destination IP filtering
- Port-based rules
- Priority-based rule execution
- Enable/Disable rules on-the-fly

### 📝 Packet Logs Viewer
- Real-time packet monitoring
- Search and filter capabilities
- Protocol and action-based filtering
- Detailed packet information (source, destination, ports)
- Timestamp tracking

### 🚨 Alert System
- Security alerts with severity levels (LOW/MEDIUM/HIGH/CRITICAL)
- Alert descriptions and recommendations
- Mark alerts as acknowledged
- Filter by severity and status

### ⚙️ Settings & Profile
- User profile management
- Email and display name updates
- Future: Firewall configuration options

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **shadcn/ui** - Beautiful component library
- **Lucide React** - Icon system

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row-Level Security (RLS)
  - Real-time subscriptions
  - RESTful API

### State Management
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

---

## 🏗️ Architecture

```
FirewallX/
├── Frontend (React + TypeScript)
│   ├── Authentication Layer
│   ├── Dashboard Module
│   ├── Rules Management Module
│   ├── Packet Logs Module
│   ├── Alerts Module
│   └── Settings Module
│
├── Backend (Supabase)
│   ├── PostgreSQL Database
│   │   ├── profiles
│   │   ├── firewall_rules
│   │   ├── packet_logs
│   │   └── alerts
│   │
│   ├── Row-Level Security Policies
│   └── Authentication System
│
└── API Layer
    └── RESTful API (Supabase Client)
```

### Data Flow

1. **User Authentication** → Supabase Auth → Session Management
2. **Rule Creation** → Validation → Database → Real-time Update
3. **Packet Detection** → Backend Processing → Log Storage → Alert Generation
4. **Dashboard Updates** → Real-time Queries → UI Refresh

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Step 1: Clone the Repository

```bash
git clone <YOUR_REPO_URL>
cd firewallx
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

The `.env` file is auto-configured with Supabase credentials. Verify these variables exist:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 5: Build for Production

```bash
npm run build
```

---

## 📖 Usage

### Creating Your First Account

1. Navigate to the landing page
2. Click **"Get Started"**
3. Enter email and password
4. Account is auto-confirmed (email verification disabled for development)

### Managing Firewall Rules

1. Go to **Dashboard** → **Manage Rules**
2. Click **"Add New Rule"**
3. Configure rule parameters:
   - **Action**: ALLOW, DENY, or LOG
   - **Protocol**: TCP, UDP, ICMP, or ALL
   - **Source IP**: Source address filter
   - **Destination IP**: Target address filter
   - **Port**: Specific port number
   - **Priority**: Execution order (lower = higher priority)
4. Save the rule

### Monitoring Packet Logs

1. Navigate to **Packet Logs**
2. View real-time packet activity
3. Use search to filter by IP addresses
4. Filter by protocol or action

### Managing Alerts

1. Go to **Alerts** section
2. View all security alerts with severity levels
3. Click **"Acknowledge"** to mark alerts as reviewed
4. Filter by severity: LOW, MEDIUM, HIGH, CRITICAL

---

## 🗄️ Database Schema

### Tables

#### `profiles`
```sql
- id: UUID (references auth.users)
- email: TEXT
- full_name: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `firewall_rules`
```sql
- id: UUID (primary key)
- user_id: UUID (references profiles)
- rule_name: TEXT
- source_ip: TEXT
- destination_ip: TEXT
- port: INTEGER
- protocol: TEXT (TCP/UDP/ICMP/ALL)
- action: TEXT (ALLOW/DENY/LOG)
- priority: INTEGER
- enabled: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `packet_logs`
```sql
- id: UUID (primary key)
- user_id: UUID (references profiles)
- source_ip: TEXT
- destination_ip: TEXT
- source_port: INTEGER
- destination_port: INTEGER
- protocol: TEXT
- action: TEXT
- rule_id: UUID (references firewall_rules)
- created_at: TIMESTAMP
```

#### `alerts`
```sql
- id: UUID (primary key)
- user_id: UUID (references profiles)
- severity: TEXT (LOW/MEDIUM/HIGH/CRITICAL)
- title: TEXT
- description: TEXT
- acknowledged: BOOLEAN
- created_at: TIMESTAMP
```

### Row-Level Security (RLS)

All tables enforce RLS policies ensuring:
- Users can only access their own data
- Authentication is required for all operations
- Data isolation between users

---

## 🔒 Security

### Authentication
- Secure password hashing
- Session-based authentication
- Protected routes
- Auto-refresh tokens

### Database Security
- Row-Level Security on all tables
- User data isolation
- SQL injection prevention
- Prepared statements

### Best Practices
- Environment variables for sensitive data
- HTTPS enforcement in production
- Secure session storage
- Input validation and sanitization

---

## 🔌 API Integration

### Connecting External Backend

To integrate with your Python/Scapy backend:

#### 1. Insert Packet Logs

```javascript
import { supabase } from "@/integrations/supabase/client";

await supabase.from("packet_logs").insert({
  source_ip: "192.168.1.100",
  destination_ip: "8.8.8.8",
  source_port: 54321,
  destination_port: 443,
  protocol: "TCP",
  action: "ALLOW",
  rule_id: "rule-uuid-here"
});
```

#### 2. Create Alerts

```javascript
await supabase.from("alerts").insert({
  severity: "HIGH",
  title: "Suspicious Traffic Detected",
  description: "Multiple failed connection attempts from 192.168.1.50",
  acknowledged: false
});
```

#### 3. Real-time Subscriptions

```javascript
const channel = supabase
  .channel('packet_logs')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'packet_logs' },
    (payload) => console.log('New packet:', payload)
  )
  .subscribe();
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Created with ❤️ using [Lovable](https://lovable.dev)

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Supabase** - Backend infrastructure
- **Lucide** - Icon system
- **Tailwind CSS** - Styling framework

---

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

</div>
