# 🏛️ Ladki Bahin Yojana - AI-Powered Government Welfare Chatbot

An intelligent conversational assistant for Maharashtra's **Mukhyamantri Majhi Ladki Bahin Yojana** (मुख्यमंत्री माझी लाडकी बहीण योजना) - a women's welfare scheme providing ₹1,500 monthly benefits to eligible women.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Linux System Dependencies](#-linux-system-dependencies)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [API Endpoints](#-api-endpoints)
- [Conversation Flow](#-conversation-flow)
- [Database Schema](#-database-schema)
- [Running the Application](#-running-the-application)
- [Frontend Development](#-frontend-development)
- [Deployment](#-deployment)

---

## 🎯 Overview

This system serves as an intelligent assistant that helps users:
- **Check eligibility** against 10 mandatory criteria
- **Submit applications** with OCR-validated document uploads
- **Query application status** and payment history through conversational AI

The chatbot supports **trilingual conversations** in English, Hindi, and Marathi with intelligent intent routing.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Smart Intent Router** | AI-powered routing to appropriate agent based on conversation context |
| **Eligibility Verification** | Comprehensive check against all 10 mandatory criteria |
| **Document OCR** | Automated extraction from Aadhaar, Bank Passbook, Income Certificate |
| **Voice Support** | Speech-to-Text and Text-to-Speech in multiple languages |
| **Real-time Status** | Database integration for application and payment queries |
| **Multi-language** | Full support for English, Hindi, and Marathi |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | REST API framework |
| **Azure OpenAI** | Conversational AI (GPT-4) |
| **Azure Speech Services** | STT/TTS capabilities |
| **Azure Blob Storage** | Document storage |
| **MS SQL Server** | Beneficiary database |
| **pymssql** | Database connectivity |
| **Tesseract OCR** | Document text extraction |
| **Pydub** | Audio processing |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Angular 16** | SPA framework |
| **Bootstrap 5** | UI components |
| **TypeScript** | Type-safe development |
| **RxJS** | Reactive programming |

---

## 📁 Project Structure

```
ladki-bahin-yojana/
├── 📂 Backend (Python/FastAPI)
│   ├── main.py                 # Main API with Smart Router
│   ├── pre_registration.py     # Eligibility Agent
│   ├── registration.py         # Form Filling Agent (OCR + Document Upload)
│   ├── post_registration.py    # Post-Application Agent (Status/Payments)
│   ├── database.py             # MSSQL connectivity & queries
│   ├── config.py               # Azure Speech configuration
│   ├── eligibility_rules.py    # Scheme eligibility criteria
│   ├── models.py               # Pydantic models
│   ├── text_to_speech.py       # TTS utilities
│   ├── utils.py                # Helper functions
│   └── requirements.txt        # Python dependencies
│
├── 📂 Frontend (Angular)
│   ├── angular.json            # Angular configuration
│   ├── package.json            # Node dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── index.html              # Entry point
│   ├── main.ts                 # Bootstrap
│   ├── app_module.ts           # Root module
│   ├── app_component.*         # Root component
│   ├── app-routing_module.ts   # Routing
│   ├── login_component.*       # Login/Chat UI
│   └── chat_service.ts         # API service
│
└── 📄 Configuration
    ├── .env                    # Environment variables (create this)
    ├── .gitignore
    └── .editorconfig
```

---

## 📋 Prerequisites

### Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| Python | 3.10+ | Backend runtime |
| Node.js | 18+ | Frontend build |
| MSSQL Server | 2019+ | Database |
| Tesseract OCR | 4.1+ | Document processing |
| Poppler | Latest | PDF to image conversion |

### Azure Services

- **Azure OpenAI** - GPT-4 deployment
- **Azure Speech Services** - Central India region
- **Azure Blob Storage** - Document storage account

---

## 🐧 Linux System Dependencies

Install required system packages on Ubuntu/Debian:

```bash
# Update package list
sudo apt update

# Core dependencies
sudo apt install -y \
    python3.10 \
    python3.10-venv \
    python3-pip \
    build-essential \
    libffi-dev \
    libssl-dev

# MSSQL ODBC Driver
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list | sudo tee /etc/apt/sources.list.d/mssql-release.list
sudo apt update
sudo ACCEPT_EULA=Y apt install -y msodbcsql18 unixodbc-dev

# FreeTDS (for pymssql)
sudo apt install -y freetds-dev freetds-bin

# OCR Dependencies
sudo apt install -y \
    tesseract-ocr \
    tesseract-ocr-mar \
    tesseract-ocr-hin \
    libtesseract-dev \
    poppler-utils

# Audio Processing (for Azure Speech SDK)
sudo apt install -y \
    libasound2 \
    libasound2-dev \
    libssl-dev \
    libgstreamer1.0-0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good

# Additional utilities
sudo apt install -y \
    ffmpeg \
    libsndfile1
```

### Verify Installations

```bash
# Check Tesseract
tesseract --version
tesseract --list-langs  # Should include: eng, hin, mar

# Check FreeTDS
tsql -C

# Check Python
python3.10 --version
```

---

## ⚙️ Installation

### Backend Setup

```bash
# Clone repository
git clone <repository-url>
cd ladki-bahin-yojana

# Create virtual environment
python3.10 -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate   # Windows

# Install Python dependencies
pip install -r requirements.txt
```

### Frontend Setup

```bash
# Install Node dependencies
npm install

# Install Angular CLI globally (optional)
npm install -g @angular/cli@16
```

---

## 🔐 Environment Configuration

Create a `.env` file in the project root:

```env
# ============================================
# Azure OpenAI Configuration
# ============================================
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-4

# ============================================
# Azure Speech Services
# ============================================
AZURE_SPEECH_KEY=your-speech-key
AZURE_SPEECH_REGION=centralindia

# ============================================
# Azure Blob Storage
# ============================================
AZURE_SA_NAME=your-storage-account
AZURE_SA_ACCESSKEY=your-access-key
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...

# ============================================
# Database Configuration (MSSQL)
# ============================================
DB_HOST=your-db-server-ip
DB_PORT=1433
DB_NAME=DBLadliBehan
DB_USER=your-username
DB_PASSWORD=your-password

# ============================================
# Google TTS (Optional)
# ============================================
GOOGLE_API_KEY=your-google-api-key

# ============================================
# Application Settings
# ============================================
HOST_URL=https://your-domain.com
```

---

## 🔌 API Endpoints

### Main Router API (Port 9015)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/smart-chat-router-ladki-bahin` | **Main chat endpoint** - Routes to appropriate agent |
| `POST` | `/call-center-smart-chat-router-ladki-bahin` | Call center variant (no form filling) |
| `GET` | `/api/speech-token` | Get Azure Speech auth token |
| `POST` | `/api/tts` | Text-to-Speech generation |

### Smart Chat Router Request

```bash
POST /smart-chat-router-ladki-bahin
Content-Type: multipart/form-data

# Form Fields:
- message: string (required)       # User message
- session_id: string (required)    # Session identifier
- prev_res: string (optional)      # Previous bot response
- prev_res_mode: string (optional) # Previous response mode
- aadhaar_last4: string (optional) # Last 4 digits of Aadhaar
- doc_type: string (optional)      # Document type for upload
- file: file (optional)            # Document file upload
```

### Response Structure

```json
{
  "response": {
    "response": "Bot message here..."
  },
  "mode": "eligible | form_filling | post_application"
}
```

### Routing Modes

| Mode | Trigger | Description |
|------|---------|-------------|
| `eligible` | Eligibility questions | Pre-application verification |
| `form_filling` | "I want to apply", "Start application" | Document collection & submission |
| `post_application` | Status queries, payment history | Post-submission assistance |

---

## 🔄 Conversation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER MESSAGE                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SMART INTENT ROUTER                           │
│              (Azure OpenAI Classification)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  ELIGIBILITY  │    │ FORM FILLING  │    │    POST       │
│    AGENT      │    │    AGENT      │    │ APPLICATION   │
│               │    │               │    │    AGENT      │
│ • 10 criteria │    │ • OCR upload  │    │ • Status      │
│ • Scheme info │    │ • Validation  │    │ • Payments    │
│ • Guidance    │    │ • Submission  │    │ • Linkage     │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Eligibility Criteria (10 Mandatory Checks)

1. ✅ Gender: Female only
2. ✅ Age: 21-65 years
3. ✅ Residency: Maharashtra permanent resident
4. ✅ Income: Annual family income ≤ ₹2.5 lakh
5. ✅ Income Tax: No family member pays income tax
6. ✅ Govt Employee: No family member is govt employee
7. ✅ Pension: No family member receives govt pension
8. ✅ Political Position: No MP/MLA/Board member in family
9. ✅ Four Wheeler: No car/SUV ownership (tractor exempt)
10. ✅ Bank Account: Own Aadhaar-linked bank account

---

## 🗄️ Database Schema

### BeneficiaryApplication Table

```sql
CREATE TABLE BeneficiaryApplication (
    BeneficiaryId BIGINT PRIMARY KEY,
    Username NVARCHAR(100),
    PasswordHash NVARCHAR(255),
    LastLogin DATETIME,
    AadhaarNumber NVARCHAR(12),
    FullName NVARCHAR(200),
    DateOfBirth DATE,
    Gender CHAR(1),
    MobileNumber NVARCHAR(15),
    Email NVARCHAR(100),
    Address NVARCHAR(500),
    District NVARCHAR(100),
    Taluka NVARCHAR(100),
    Village NVARCHAR(100),
    AnnualIncome DECIMAL(12,2),
    BankAccountNo NVARCHAR(20),
    BankIFSC NVARCHAR(11),
    SchemeCode NVARCHAR(50),
    ApplicationDate DATETIME,
    ApplicationStatus NVARCHAR(50),
    ApprovedBy NVARCHAR(100),
    ApprovedOn DATETIME,
    RejectionReason NVARCHAR(500),
    CreatedOn DATETIME,
    UpdatedOn DATETIME
);
```

### BeneficiaryTransactions Table

```sql
CREATE TABLE BeneficiaryTransactions (
    TransactionId BIGINT PRIMARY KEY IDENTITY,
    BeneficiaryId BIGINT FOREIGN KEY,
    TransactionDate DATETIME,
    Amount DECIMAL(10,2),
    TransactionType NVARCHAR(50),
    Status NVARCHAR(50),
    ReferenceNumber NVARCHAR(100)
);
```

---

## 🚀 Running the Application

### Development Mode

```bash
# Terminal 1: Start Backend
source venv/bin/activate
python main.py
# API runs at http://localhost:9015

# Terminal 2: Start Frontend
npm start
# App runs at http://localhost:4200
```

### Production Mode

```bash
# Backend with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:9015

# Build Angular for production
npm run build -- --configuration production
```

### Quick Test

```bash
# Health check
curl http://localhost:9015/

# Test chat (eligibility)
curl -X POST http://localhost:9015/smart-chat-router-ladki-bahin \
  -F "message=Am I eligible for Ladki Bahin scheme?" \
  -F "session_id=test-123"
```

---

## 🖥️ Frontend Development

### Angular CLI Commands

```bash
# Development server
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test

# Generate component
ng generate component component-name
```

### API Service Integration

```typescript
// chat_service.ts
@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://localhost:9015';
  
  sendMessage(message: string, sessionId: string): Observable<any> {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('session_id', sessionId);
    
    return this.http.post(`${this.apiUrl}/smart-chat-router-ladki-bahin`, formData);
  }
}
```

---

## 📦 Deployment

### Environment Security

⚠️ **Important**: Never commit `.env` files. Use Azure Key Vault or similar secrets management for production.

```bash
# Use Azure Key Vault
az keyvault secret set --vault-name your-vault --name "DB-PASSWORD" --value "secret"
```

---

## 📞 Support

- **Helpline**: 181, 1800-120-8040
- **Official Portal**: [ladakibahin.maharashtra.gov.in](https://ladakibahin.maharashtra.gov.in)
- **eKYC Portal**: [ladakibahin.maharashtra.gov.in/ekyc](https://ladakibahin.maharashtra.gov.in/ekyc/)

---

## 📄 License

This project is developed for the Government of Maharashtra's welfare initiatives.

---

<p align="center">
  <b>Built with ❤️ for the women of Maharashtra</b>
</p>
