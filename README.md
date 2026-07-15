# Resume Builder

**AI-powered resume builder** by Sonu Kumar  
Create, edit, and save professional resumes with AI assistance, ATS scoring, PDF upload, and resume templates.

## 🚀 Live Demo
- 🔗 Live Project: https://ats-resume-builder-git-main-sonu-tech006s-projects.vercel.app/

## 📸 Screenshot
![Resume Builder Screenshot](./screenshot.png)

> Sonu Kumar

## 🔧 Tech Stack
[![React](https://camo.githubusercontent.com/27d6a3309ed5f3f77b44d6363633e947c37cd5470610cf3d264ce9dcde5a1049/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f72656163742d2532333230323332612e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d7265616374266c6f676f436f6c6f723d253233363144414642)](https://react.dev/) [![NodeJS](https://camo.githubusercontent.com/ef2b7d0db96aa537dfc682bc36181a27a9152e23378bd002a4331e9e2b27da5b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652e6a732d3644413535463f7374796c653d666f722d7468652d6261646765266c6f676f3d6e6f64652e6a73266c6f676f436f6c6f723d7768697465)](https://nodejs.org/) [![Express.js](https://camo.githubusercontent.com/85f22a805fa4254023c1992fff9ca85de019179734b1fd1ab7961e1aaeac28d9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f657870726573732e6a732d2532333430346435392e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d65787072657373266c6f676f436f6c6f723d253233363144414642)](https://expressjs.com/) [![MongoDB](https://camo.githubusercontent.com/22b4be397ec78a05f56cdbf3190d59918ff84b4e1e867061f2aa7064f154c056/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d6f6e676f44422d2532333465613934622e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d6d6f6e676f6462266c6f676f436f6c6f723d7768697465)](https://www.mongodb.com/) [![TailwindCSS](https://camo.githubusercontent.com/f733fddbc0e4ae906e07fe6cabf861b712934e376975847d7f9d4a40e9e635f2/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f7461696c77696e646373732d2532333338423241432e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d7461696c77696e642d637373266c6f676f436f6c6f723d7768697465)](https://tailwindcss.com/)

## 📁 Project Structure
- `client/` — React + Vite frontend
- `server/` — Node.js + Express backend
- `server/models` — Mongoose schemas
- `server/controllers` — API logic for auth, resumes, and AI features
- `client/src/pages` — application pages including ATS check and dashboard

## 🧰 Tools & Technologies
- React, Vite, TailwindCSS
- Node.js, Express, Axios
- MongoDB, Mongoose
- JWT authentication
- OpenAI / Gemini AI integration
- ImageKit integration for profile image upload
- PDF text extraction for resume upload

## ✅ What this app does
- User authentication and protected dashboard
- Create new resume or upload existing PDF resume
- Extract resume text and run ATS score prediction
- Save resume data to MongoDB
- Preview ATS score, prediction, reasons, and suggestions
- Responsive resume builder experience

## 🔧 Setup and Installation

### 1. Clone the repo
```bash
git clone https://github.com/sonu-tech006/Ats-resume-builder.git
cd Ats-resume-builder
```

### 2. Install dependencies
```bash
cd client
npm install
cd ../server
npm install
```

### 3. Environment variables
Create `server/.env` with:
```bash
PORT=3000
MONGODB_URI=<your mongo uri>
JWT_SECRET=<your jwt secret>
IMAGEKIT_PRIVATE_KEY=<your imagekit key>
OPENAI_API_KEY=<your openai or google api key>
OPENAI_BASE_URL=<openai base url>
OPENAI_MODEL="gemini-2.5-flash"
```
Create `client/.env` with:
```bash
VITE_BASE_URL=http://localhost:3000
```

### 4. Run locally
```bash
# Start frontend
cd client
npm run dev

# Start backend
cd ../server
npm run server
```

## 🚀 Deployment
### Backend on Render
1. Create a new Render Web Service.
2. Connect your GitHub repo.
3. Set the root directory to `server/`.
4. Set the build command: `npm install`
5. Set the start command: `npm run start`
6. Add Render environment variables from `server/.env`.
7. Deploy.

### Frontend on Vercel
1. Create a new Vercel project.
2. Connect your GitHub repo.
3. Set the root directory to `client/`.
4. Set build command: `npm install && npm run build`
5. Set output directory: `dist`
6. Add environment variable:
   - `VITE_BASE_URL=<your render backend URL>`
7. Deploy.

## 📌 Notes
- Use the Render backend URL in frontend `VITE_BASE_URL` after deploy.
- Make sure the backend has access to MongoDB and OpenAI/Gemini keys.
- If you change the deploy URLs, update `client/.env` and redeploy.

## 📬 Contact
- Email: sonukr7435@gmail.com
- GitHub: https://github.com/sonu-tech006

---

Made with ❤️ by Sonu Kumar

