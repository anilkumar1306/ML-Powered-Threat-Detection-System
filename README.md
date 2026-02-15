# ML-Powered Threat Detection System

A full-stack machine learning application for real-time network intrusion detection and threat classification using the CICIDS2017 dataset. The system leverages ensemble machine learning models to classify network traffic into benign or 15 different attack categories with >99% accuracy.

![System Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-teal)
![React](https://img.shields.io/badge/React-19.2.0-blue)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Dataset: CICIDS2017](#dataset-cicids2017)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Machine Learning Models](#machine-learning-models)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Model Performance](#model-performance)
- [Deployment Considerations](#deployment-considerations)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)

---

## 🎯 Overview

This project implements an end-to-end machine learning pipeline for network intrusion detection using the Canadian Institute for Cybersecurity Intrusion Detection System 2017 (CICIDS2017) dataset. The system provides:

- **Real-time threat detection** for network traffic flows
- **Multi-class classification** identifying 15 distinct threat types
- **Anomaly detection** for zero-day threats using Isolation Forest
- **Interactive dashboard** for visualization and analysis
- **RESTful API** for integration with existing security infrastructure
- **Batch processing** for large-scale network traffic analysis

### Attack Types Detected

The system can classify network traffic into the following categories:

1. **BENIGN** - Normal network traffic
2. **Bot** - Botnet activity
3. **DDoS** - Distributed Denial of Service
4. **DoS GoldenEye** - HTTP-based DoS attack
5. **DoS Hulk** - HTTP-based DoS attack
6. **DoS Slowhttptest** - Slow HTTP DoS attack
7. **DoS slowloris** - Slow HTTP DoS attack
8. **FTP-Patator** - FTP brute force attack
9. **Heartbleed** - OpenSSL vulnerability exploit
10. **Infiltration** - Network infiltration
11. **PortScan** - Port scanning activity
12. **SSH-Patator** - SSH brute force attack
13. **Web Attack - Brute Force** - Web application brute force
14. **Web Attack - SQL Injection** - SQL injection attack
15. **Web Attack - XSS** - Cross-Site Scripting attack

---

## 📊 Dataset: CICIDS2017

### Dataset Overview

The **CICIDS2017** dataset is a comprehensive collection of network traffic data created by the Canadian Institute for Cybersecurity at the University of New Brunswick. It represents realistic background traffic and modern attack scenarios.

### Dataset Specifications

| Attribute | Details |
|-----------|---------|
| **Source** | Canadian Institute for Cybersecurity (CIC) |
| **Total Records** | ~2.5 million network flows (2,520,798 rows) |
| **Time Period** | 5 days of captured traffic |
| **CSV Files** | 8 files merged for complete dataset |
| **Features** | 78 original features (70 retained after preprocessing) |
| **Target Variable** | Label (15 classes) |
| **Class Distribution** | Highly imbalanced (BENIGN dominates) |

### Feature Categories

The dataset includes 70 engineered features across multiple categories:

#### 1. **Basic Flow Information**
- Destination Port
- Flow Duration
- Total Forward/Backward Packets
- Total Length of Forward/Backward Packets

#### 2. **Packet Length Statistics**
- Forward/Backward Packet Length (Max, Min, Mean, Std)
- Packet Length Statistics (Mean, Std, Variance)
- Min/Max Packet Length

#### 3. **Inter-Arrival Time (IAT) Features**
- Flow IAT (Mean, Std, Max, Min)
- Forward IAT (Total, Mean, Std, Max, Min)
- Backward IAT (Total, Mean, Std, Max, Min)

#### 4. **Flow Rate Metrics**
- Flow Bytes/s
- Flow Packets/s
- Forward/Backward Packets/s

#### 5. **TCP Flags**
- FIN, SYN, RST, PSH, ACK, URG Flags Count
- CWE Flag Count
- ECE Flag Count
- Forward PSH/URG Flags

#### 6. **Header Information**
- Forward/Backward Header Length
- Forward Header Length.1

#### 7. **Subflow Characteristics**
- Subflow Forward/Backward Packets
- Subflow Forward/Backward Bytes

#### 8. **TCP Window Features**
- Init_Win_bytes_forward
- Init_Win_bytes_backward

#### 9. **Active/Idle Time Statistics**
- Active (Mean, Std, Max, Min)
- Idle (Mean, Std, Max, Min)

#### 10. **Additional Metrics**
- Down/Up Ratio
- Average Packet Size
- Avg Forward/Backward Segment Size
- act_data_pkt_fwd
- min_seg_size_forward

### Data Preprocessing Pipeline

The following preprocessing steps are applied to ensure data quality:

1. **Column Name Cleaning** - Whitespace removal from column names
2. **Missing Value Handling** - Removal of NaN and Infinity values
3. **Deduplication** - Removal of duplicate records
4. **Feature Selection** - Variance Threshold (0.01) applied, 70 features retained
5. **Feature Scaling** - StandardScaler normalization for all numeric features
6. **Label Encoding** - Target variable encoded as integers (0-14)

### Class Imbalance Characteristics

| Class | Approximate Distribution |
|-------|-------------------------|
| BENIGN | ~80% (Dominant class) |
| DoS Hulk | ~7% |
| PortScan | ~5% |
| DDoS | ~3% |
| Others | <1% each (Rare attacks) |

**Note**: Classes like Heartbleed and Web Attack variants have extremely low support (<0.1%), making them challenging for model training but critical for real-world detection.

---

## 🏗️ System Architecture

The system follows a modern microservices architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │  Upload  │  │ Results  │  │Analytics │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
┌────────────────────────▼────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Endpoints (main.py)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Inference Engine (inference.py)             │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │       Preprocessing Pipeline                    │  │  │
│  │  │  1. Column Validation                           │  │  │
│  │  │  2. Feature Selection (Variance Threshold)      │  │  │
│  │  │  3. Standardization (StandardScaler)            │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │       Anomaly Detection (Isolation Forest)      │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │   Supervised Classification (RF/XGBoost/etc)    │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │       Label Decoding (LabelEncoder)             │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 Saved Models Directory                       │
│  • random_forest_model.pkl                                   │
│  • xgboost_model.pkl                                         │
│  • decision_tree_model.pkl                                   │
│  • gradient_boosting_model.pkl                               │
│  • logistic_regression_model.pkl                             │
│  • isolation_forest_anomaly.pkl                              │
│  • scaler.pkl (StandardScaler)                               │
│  • label_encoder.pkl (LabelEncoder)                          │
│  • feature_selector_variance.pkl (VarianceThreshold)         │
└──────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### Backend Features

- **Multi-Model Support**: Switch between 5 different ML models (Random Forest, XGBoost, Decision Tree, Gradient Boosting, Logistic Regression)
- **Hybrid Detection**: Combines supervised learning with unsupervised anomaly detection
- **Strict Preprocessing Pipeline**: Ensures production data matches training data distribution
- **Batch Processing**: Upload CSV files for bulk predictions
- **Real-time Inference**: Single prediction API for live traffic analysis
- **Model Metadata**: Detailed information about loaded models and preprocessing artifacts
- **Error Handling**: Comprehensive validation and error messages
- **CORS Support**: Cross-origin requests enabled for frontend integration

### Frontend Features

- **Interactive Dashboard**: Real-time statistics and visualizations
- **File Upload Interface**: Drag-and-drop CSV upload with validation
- **Results Visualization**: Charts and tables for prediction results
- **Analytics Page**: Detailed breakdown of attack distribution
- **Model Information**: View loaded models and their performance metrics
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Toast Notifications**: User-friendly feedback for actions
- **Dark Theme**: Modern cybersecurity-themed UI

---

## 🤖 Machine Learning Models

### Ensemble Models

The system includes 5 pre-trained supervised learning models:

#### 1. **Random Forest** ⭐ (Recommended)
- **Accuracy**: ~99.9%
- **Strengths**: Excellent multi-class separation, robust to overfitting, high precision/recall
- **Use Case**: General-purpose threat detection
- **Training**: 100 trees, parallel processing enabled

#### 2. **XGBoost**
- **Accuracy**: ~99.9%
- **Strengths**: Optimized gradient boosting, fast inference, handles imbalanced data well
- **Use Case**: High-throughput production environments
- **Training**: Gradient boosting with early stopping

#### 3. **Decision Tree**
- **Accuracy**: ~99.8%
- **Strengths**: Fast inference, interpretable rules, low memory footprint
- **Use Case**: Explainable predictions for security analysts
- **Weakness**: Risk of overfitting

#### 4. **Gradient Boosting**
- **Accuracy**: ~96%
- **Strengths**: Baseline ensemble performance
- **Use Case**: Comparison baseline

#### 5. **Logistic Regression**
- **Accuracy**: ~96%
- **Strengths**: Fast training/inference, linear decision boundaries
- **Weakness**: Poor recall on complex attacks (e.g., Web Attacks)
- **Use Case**: Lightweight deployment scenarios

### Unsupervised Model

#### **Isolation Forest** (Anomaly Detection)
- **Purpose**: Zero-day threat detection for unknown attack patterns
- **Output**: Binary classification (normal vs. anomaly)
- **Integration**: Runs before supervised models; flags anomalies immediately

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Core language |
| **FastAPI** | 0.109.0 | REST API framework |
| **Uvicorn** | 0.27.0 | ASGI server |
| **Pandas** | 1.5.3 | Data manipulation |
| **NumPy** | 1.23.5 | Numerical computing |
| **Scikit-learn** | 1.2.2 | ML algorithms & preprocessing |
| **XGBoost** | 1.7.6 | Gradient boosting |
| **Joblib** | 1.2.0 | Model serialization |
| **Pydantic** | 2.6.1 | Data validation |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **TypeScript** | 5.9.3 | Type safety |
| **Vite** | 7.3.1 | Build tool |
| **React Router** | 7.13.0 | Navigation |
| **Axios** | 1.13.5 | HTTP client |
| **Recharts** | 3.7.0 | Data visualization |
| **Tailwind CSS** | 4.1.18 | Styling |
| **Lucide React** | 0.564.0 | Icons |

---

## 🚀 Installation & Setup

### Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 18.0 or higher
- **npm** or **yarn**: Latest version

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Verify model files exist** in `backend/saved_models/`:
   - random_forest_model.pkl
   - xgboost_model.pkl
   - decision_tree_model.pkl
   - gradient_boosting_model.pkl
   - logistic_regression_model.pkl
   - isolation_forest_anomaly.pkl
   - scaler.pkl
   - label_encoder.pkl
   - feature_selector_variance.pkl

6. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Production Build

**Backend**:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend**:
```bash
npm run build
npm run preview
```

---

## 📖 Usage

### Web Interface

1. **Access the dashboard**: Navigate to `http://localhost:5173`
2. **Upload CSV file**: Go to Upload page and select a CSV with network flow features
3. **Select model**: Choose from Random Forest, XGBoost, Decision Tree, etc.
4. **View results**: Predictions displayed with confidence scores and attack types
5. **Analyze data**: Use Analytics page for detailed breakdowns

### API Usage

#### Single Prediction

```bash
POST http://localhost:8000/api/v1/predict
Content-Type: application/json

{
  "features": {
    "Destination Port": 80,
    "Flow Duration": 120000,
    "Total Fwd Packets": 10,
    ...
  },
  "model_name": "Random Forest"
}
```

#### Batch Prediction

```bash
POST http://localhost:8000/api/v1/predict_batch
Content-Type: multipart/form-data

file: network_traffic.csv
model_name: Random Forest
```

#### Health Check

```bash
GET http://localhost:8000/health
```

Response:
```json
{
  "status": "active",
  "version": "1.0.0",
  "loaded_models": [
    "Random Forest",
    "XGBoost",
    "Decision Tree",
    "Gradient Boosting",
    "Logistic Regression"
  ]
}
```

---

## 📡 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check and model status |
| GET | `/api/v1/models` | List available models |
| POST | `/api/v1/predict` | Single prediction |
| POST | `/api/v1/predict_batch` | Batch prediction from CSV |
| GET | `/api/v1/download_results/{batch_id}` | Download batch results |

### Request/Response Schemas

#### Prediction Request
```json
{
  "features": {
    "Destination Port": 80,
    "Flow Duration": 120000,
    "Total Fwd Packets": 10,
    "Total Backward Packets": 8,
    ...
  },
  "model_name": "Random Forest"
}
```

#### Prediction Response
```json
{
  "prediction": "DDoS",
  "confidence": 0.98,
  "is_anomaly": false,
  "model_used": "Random Forest",
  "inference_time_ms": 12.5
}
```

#### Batch Prediction Summary
```json
{
  "total_predictions": 1000,
  "benign_count": 850,
  "attack_count": 150,
  "attack_breakdown": {
    "DDoS": 80,
    "PortScan": 45,
    "Bot": 25
  },
  "anomaly_count": 5,
  "batch_id": "uuid-here",
  "processing_time_ms": 1250.5
}
```

### Interactive API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 📁 Project Structure

```
ML-Powered Threat Detection System/
│
├── README.md                          # This file
├── technical report.md                # Detailed technical analysis
│
├── backend/                           # Backend API
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI application & routes
│   │   ├── config.py                  # Configuration settings
│   │   ├── schemas.py                 # Pydantic models
│   │   ├── model_loader.py            # Singleton model loader
│   │   ├── preprocessing.py           # Data preprocessing pipeline
│   │   ├── inference.py               # Inference engine
│   │   └── utils.py                   # Utility functions
│   │
│   ├── saved_models/                  # Pre-trained models
│   │   ├── random_forest_model.pkl
│   │   ├── xgboost_model.pkl
│   │   ├── decision_tree_model.pkl
│   │   ├── gradient_boosting_model.pkl
│   │   ├── logistic_regression_model.pkl
│   │   ├── isolation_forest_anomaly.pkl
│   │   ├── scaler.pkl
│   │   ├── label_encoder.pkl
│   │   └── feature_selector_variance.pkl
│   │
│   ├── requirements.txt               # Python dependencies
│   ├── verify_setup.py                # Setup verification script
│   ├── verify_features.py             # Feature validation script
│   └── reproduce_error.py             # Error reproduction script
│
└── frontend/                          # React frontend
    ├── src/
    │   ├── components/                # Reusable components
    │   │   ├── Navbar.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── FileUpload.tsx
    │   │   ├── DataTable.tsx
    │   │   ├── Charts.tsx
    │   │   ├── StatsCard.tsx
    │   │   ├── Loader.tsx
    │   │   ├── Toast.tsx
    │   │   └── ErrorBoundary.tsx
    │   │
    │   ├── pages/                     # Page components
    │   │   ├── Dashboard.tsx
    │   │   ├── Upload.tsx
    │   │   ├── Results.tsx
    │   │   ├── Analytics.tsx
    │   │   └── ModelInfo.tsx
    │   │
    │   ├── context/                   # React context
    │   │   └── AppContext.tsx
    │   │
    │   ├── services/                  # API services
    │   │   └── api.ts
    │   │
    │   ├── App.tsx                    # Main app component
    │   ├── main.tsx                   # Entry point
    │   └── index.css                  # Global styles
    │
    ├── public/                        # Static assets
    ├── index.html                     # HTML template
    ├── package.json                   # Node dependencies
    ├── tsconfig.json                  # TypeScript config
    ├── vite.config.ts                 # Vite config
    └── README.md                      # Frontend-specific docs
```

---

## 📊 Model Performance

### Classification Metrics

| Model | Accuracy | Avg Precision | Avg Recall | Avg F1-Score |
|-------|----------|---------------|------------|--------------|
| **Random Forest** | 99.9% | 0.998 | 0.997 | 0.997 |
| **XGBoost** | 99.9% | 0.998 | 0.996 | 0.997 |
| **Decision Tree** | 99.8% | 0.996 | 0.995 | 0.995 |
| **Gradient Boosting** | 96.0% | 0.960 | 0.945 | 0.952 |
| **Logistic Regression** | 96.0% | 0.950 | 0.930 | 0.940 |

### Performance by Attack Type

**Random Forest Model (Best Performer)**:

| Attack Type | Precision | Recall | F1-Score | Support |
|-------------|-----------|--------|----------|---------|
| BENIGN | 1.00 | 1.00 | 1.00 | High |
| Bot | 0.99 | 0.98 | 0.99 | Medium |
| DDoS | 0.99 | 1.00 | 1.00 | Medium |
| DoS Hulk | 1.00 | 1.00 | 1.00 | High |
| PortScan | 1.00 | 1.00 | 1.00 | Medium |
| Web Attacks | 0.95-0.98 | 0.92-0.96 | 0.94-0.97 | Low |
| Heartbleed | 0.90 | 0.85 | 0.87 | Very Low |

### Key Observations

- **High Accuracy**: Tree-based models achieve near-perfect accuracy due to distinct feature patterns in network attacks
- **Class Imbalance Handling**: Models perform well even on minority classes (e.g., Heartbleed)
- **Zero False Negatives**: Critical attacks like DDoS have 100% recall in testing
- **Potential Overfitting**: Perfect scores suggest need for external validation with new data

---

## 🚢 Deployment Considerations

### Critical Requirements

1. **Model Artifacts**: All 9 pickle files must be deployed together:
   - 5 supervised models
   - 1 anomaly detection model
   - 1 scaler (StandardScaler)
   - 1 label encoder (LabelEncoder)
   - 1 feature selector (VarianceThreshold)

2. **Feature Order**: Production inputs must match exact training feature order (70 features)

3. **Preprocessing Pipeline**: Must apply transformations in strict order:
   ```
   Input → Clean Names → Validate Features → Variance Threshold → StandardScaler → Model
   ```

4. **Version Control**: Lock all dependencies to avoid library version mismatches

### Production Risks

⚠️ **Data Leakage**: High accuracy may indicate feature leakage - validate on external data
⚠️ **Concept Drift**: Network traffic patterns change - implement retraining pipeline
⚠️ **Inference Latency**: Random Forest may be slow for real-time packet inspection
⚠️ **False Positives**: Validate in shadow mode before production deployment

### Scalability Recommendations

- **Horizontal Scaling**: Deploy multiple FastAPI instances behind load balancer
- **Model Caching**: Keep models in memory (already implemented via singleton)
- **Async Processing**: Use background tasks for batch predictions
- **Monitoring**: Track prediction latency and accuracy drift
- **A/B Testing**: Compare model performance in production

---

## 🔮 Future Improvements

### Short Term
- [ ] Implement hyperparameter tuning (GridSearchCV/RandomizedSearchCV)
- [ ] Add SHAP/LIME explanations for prediction interpretability
- [ ] Create automated retraining pipeline
- [ ] Add authentication and rate limiting to API
- [ ] Implement result caching with Redis

### Medium Term
- [ ] Explore deep learning models (LSTM/GRU) for sequence-based analysis
- [ ] Create ensemble voting classifier (RF + XGBoost)
- [ ] Add real-time streaming support (Kafka/Redis Streams)
- [ ] Implement model versioning and A/B testing
- [ ] Add alerting system for critical threats

### Long Term
- [ ] Deploy to cloud (AWS/Azure/GCP)
- [ ] Implement continuous learning from production data
- [ ] Add federated learning for multi-organization deployment
- [ ] Create mobile application for security monitoring
- [ ] Integrate with SIEM systems (Splunk, ELK)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 style guide for Python code
- Use ESLint/Prettier for TypeScript/React code
- Add unit tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is developed for educational and research purposes. Please refer to the CICIDS2017 dataset license for data usage restrictions.

---

## 🙏 Acknowledgments

- **Canadian Institute for Cybersecurity (CIC)** for the CICIDS2017 dataset
- **Scikit-learn** and **XGBoost** communities for excellent ML libraries
- **FastAPI** team for the modern Python web framework
- **React** and **Tailwind CSS** communities for frontend tools

---

## 📞 Contact & Support

For questions, issues, or contributions:

- **Technical Report**: See `technical report.md` for detailed analysis
- **API Documentation**: Visit `/docs` endpoint when server is running
- **Issues**: Report bugs and request features via issue tracker

---

## 📌 Version History

### v1.0.0 (Current)
- Initial release with 5 supervised models
- Isolation Forest anomaly detection
- Full-stack web application
- REST API with batch processing
- Interactive dashboard and analytics

---

**Built with ❤️ for Cybersecurity**
