
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
---
### **Backend Technologies Setup**
1. **PostgreSQL with Prisma**:
   
   - Install Prisma CLI globally if not already installed:
     
      ```bash
      npm install -g prisma
      
   - Initialize Prisma:

     ```bash
     npx prisma init

   - Apply migrations to configure your database schema:

     ```bash
     npx prisma migrate dev
---
### **AI & Machine Learning Setup**

- TensorFlow/PyTorch:
  
  - Install required Python packages:
    
    ```bash
    pip install tensorflow torch

- Google Vision AI:
  
  - Obtain a Google Cloud API Key and add it to your .env file:
    
    ```env
    GOOGLE_VISION_API_KEY=your_google_vision_api_key

- Intel NPUs:
  
  - Install the Intel OpenVINO™ Toolkit to leverage NPU acceleration:
    
    ```bash
    sudo apt update && sudo apt install openvino-dev

- Hugging Face Models:
  
  - Ensure the required Python libraries for Hugging Face are installed:
    
    ```bash
    pip install transformers
---
### **Software & Frameworks Setup**

- OpenVINO™ Toolkit:
  
  - Follow the installation guide for OpenVINO™ Toolkit for faster AI inference: [OpenVINO Installation Guide](https://www.intel.com/content/www/us/en/developer/tools/openvino-toolkit/overview.html?cid=sem&source=sa360&campid=2024_ao_cbu_in_gmocoma_gmocrbu_awa_text-link_brand_exact_cd_HQ-ai-openvino_3500268603_google_b2b_is_non-pbm_intel&ad_group=AI_Brand-Openvino_Openvino_Exact&intel_term=intel+openvino+toolkit&sa360id=43700079829618884&gad_source=1&gclid=EAIaIQobChMIjYmTseqhiQMVdiSDAx1lnA1uEAAYASAAEgL4dfD_BwE&gclsrc=aw.ds).
   
- Intel® AI Analytics Toolkit::
  
  - Install Intel's AI Toolkit to optimize AI workflows:
    
    ```bash
    sudo apt install intel-ai-analytics-toolkit

---
## **Screenshots**

Here are some screenshots of the project:
1. ### **User Interface**
![User Interface](https://github.com/CroWzblooD/Radiologist-AI/blob/main/components/images/radiology-ss1.jpg)

2. ### **Dashboard**
![User Interface](https://github.com/CroWzblooD/Radiologist-AI/blob/main/components/images/radiology-ss2.jpg)

3. ### **Image Analysis**
![User Interface](https://github.com/CroWzblooD/Radiologist-AI/blob/main/components/images/radiology-ss3.jpg)

4. ### **AI Assistant**
![User Interface](https://github.com/CroWzblooD/Radiologist-AI/blob/main/components/images/radiology-ss4.jpg)

5. ### **Analytics**
![User Interface](https://github.com/CroWzblooD/Radiologist-AI/blob/main/components/images/radiology-ss5.jpg)

6. ### **Footer**
![User Interface](https://github.com/CroWzblooD/Radiologist-AI/blob/main/components/images/radiology-ss6.jpg)

---
## **Architect**
![Architect](https://github.com/CroWzblooD/Radiologist-AI/blob/main/components/images/image.png)

---
## **Image Inputs**
![Architect](https://github.com/CroWzblooD/Radiologist-AI/blob/main/components/images/xray-demo.jpg)

---
## **Resources**

 - **Intel OpenVINO™ Toolkit**: [Documentation](https://www.intel.com/content/www/us/en/developer/tools/openvino-toolkit/overview.html?cid=sem&source=sa360&campid=2024_ao_cbu_in_gmocoma_gmocrbu_awa_text-link_brand_exact_cd_HQ-ai-openvino_3500268603_google_b2b_is_non-pbm_intel&ad_group=AI_Brand-Openvino_Openvino_Exact&intel_term=intel+openvino+toolkit&sa360id=43700079829618884&gad_source=1&gclid=EAIaIQobChMIjYmTseqhiQMVdiSDAx1lnA1uEAAYASAAEgL4dfD_BwE&gclsrc=aw.ds).

- **TensorFlow**: [Documentation](https://www.intel.com/content/www/us/en/developer/tools/oneapi/optimization-for-tensorflow.html)

- **Intel® Neural Compressor**: [Documentation](https://www.intel.com/content/www/us/en/developer/tools/oneapi/neural-compressor.html)

- **Hugging Face Models**: [Documentation](https://huggingface.co/Intel)

---
**Team Name**: Squirtles
**Members**: Ashish K Choudhary, Krishna

