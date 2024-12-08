
# **Radiology AI**

**An AI-powered medical imaging tool revolutionizing diagnostic accuracy with advanced deep learning models and secure cloud solutions.**

---

## **Table of Contents**
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technologies Used](#technologies-used)
4. [Project Setup](#project-setup)
5. [Screenshots](#screenshots)
6. [Resources](#resources)

---

## **Overview**

Radiology AI leverages cutting-edge artificial intelligence to enhance diagnostic precision in medical imaging, addressing key challenges faced by radiologists. By combining TensorFlow, PyTorch, and Intel’s NPU-powered acceleration, the solution streamlines analysis for X-rays, CT scans, and ultrasounds.

**Final Results:**  
- Boosted accuracy to **80%** for detecting diabetic retinopathy stages.  
- **30% improvement** in early-stage detection.  
- Reduced computational costs by **60%**.

---

## **Key Features**
- **Automated Image Analysis:** Detects abnormalities using CNNs.
- **AI-Powered Insights:** Generates detailed diagnostic reports.
- **Real-Time Inference:** Accelerated by Intel NPUs and the OpenVINO™ Toolkit.
- **Secure Data Management:** Compliant with HIPAA and GDPR regulations.
- **Predictive Analytics:** Proactive patient management insights.

---

## **Technologies Used**

### **Frontend**
- **Next.js**: Dynamic and responsive interface.  
- **Tailwind CSS**: For rapid, customizable styling.  
- **TypeScript**: Enhances code reliability with type safety.  

### **Backend**
- **Node.js & Express.js**: Server-side logic and APIs.  
- **PostgreSQL (with Prisma)**: Reliable database for user and image data.  

### **AI & Machine Learning**
- **TensorFlow & PyTorch**: Image analysis with transfer learning models.  
- **Google Vision AI**: Supports robust image classification.  
- **Intel NPUs**: Optimized AI inference for real-time performance.  
- **OpenVINO™ Toolkit**: Enhances inference for faster analysis.  

### **Security**
- **OAuth 2.0**: User authentication.  
- **AES Encryption**: Data protection during storage and transfer.  

### **Development Tools**
- **VS Code**: For coding and debugging.  
- **Docker**: Containerized deployments.  

---

## **Project Setup**

### **Prerequisites**
1. **Node.js** (v16 or above)  
2. **PostgreSQL** (Configured with Prisma)  
3. **Docker** (Optional for containerized environments)

### **Steps to Set Up Locally**
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd project-folder

2. **Install dependencies**:
   ```bash
   npm install

3. **Set up environment variables**:
   - Create a `.env` file in the root directory:

     ```bash
     touch .env
     ```
   - Add the following environment variables to the `.env` file:
     ```env
     DATABASE_URL=your_postgres_database_url
     GOOGLE_VISION_API_KEY=your_google_vision_api_key
     PRISMA_SECRET=your_prisma_secret
     NODE_ENV=development
     ```
   - Replace the placeholder values (e.g., `your_postgres_database_url`) with your actual credentials.

4. **Run the development server**:
   ```bash
   npm run dev

5. **Access the application**:  
   Open [http://localhost:3000](http://localhost:3000) in your browser.
