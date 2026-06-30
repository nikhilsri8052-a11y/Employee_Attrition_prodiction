# Employee Attrition Predictor

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Flask](https://img.shields.io/badge/Flask-3.1.3-000000)
![Scikit-Learn](https://img.shields.io/badge/scikit-learn-1.9.0-orange)
![License](https://img.shields.io/badge/License-MIT-green)

A sleek and interactive web application that predicts the likelihood of employee attrition using a trained machine learning model. Built with Flask, this project delivers a smooth user experience with a responsive UI, real-time predictions, and an intuitive attrition risk dashboard.

## Try my website!!!

https://employee-attrition-prediction-y777.onrender.com

## ✨ Overview

Employee turnover can be costly for any organization. This application helps HR teams and decision-makers estimate whether an employee is likely to leave based on demographic, job, and satisfaction-related inputs.

The app uses a pre-trained classification model to return:

- A binary prediction: **Likely to Leave** or **Likely to Stay** (yes or no)
- An **attrition probability percentage**
- A **confidence range** with an approximate margin of error

## 🚀 Features

- Interactive employee profile form
- Real-time attrition prediction
- Probability gauge visualization
- Responsive design for desktop and mobile
- Easy deployment with Flask
- Pre-trained pipeline included as a pickled model

## 🧠 Model & Data

The prediction engine is powered by a trained machine learning pipeline stored in:

- [Employee_Attrition_Model.pkl](Employee_Attrition_Model.pkl)

The model is based on historical HR data and uses a supervised classification approach to estimate attrition risk.

## 🛠️ Tech Stack

- **Backend:** Flask
- **Machine Learning:** scikit-learn, pandas, numpy
- **Frontend:** HTML, Bootstrap, CSS, JavaScript
- **Environment:** Python 3.10+

## 📁 Project Structure

```text
.
├── app.py
├── Employee_Attrition_Model.pkl
├── Employee_Attrition_Rate.ipynb
├── HR-Employee-Attrition.csv
├── requirements.txt
├── static/
│   ├── css/
│   └── js/
└── templates/
    └── index.html
```

## ▶️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Jammu Summer School/week 3/Lecture 1"
```

### 2. Create and activate a virtual environment

#### Windows

```powershell
python -m venv .venv
.\.venv\Scripts\activate
```

#### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the app

```bash
python app.py
```

Then open your browser at:

```text
http://localhost:5000
```

## 📋 How to Use

1. Open the web app in your browser.
2. Fill in the employee details in the form.
3. Click **Predict Attrition Risk**.
4. Review the predicted attrition probability and outcome.

## 🔍 API Behavior

The app exposes a POST endpoint at:

```text
/predict
```

It accepts employee attributes as form data and returns a JSON response with:

- `prediction`
- `prediction_label`
- `attrition_probability`
- `lower_bound`
- `upper_bound`

## 📦 Deployment Notes

To run the application on a different port:

```bash
PORT=8000 python app.py
```

This makes the app accessible at:

```text
http://localhost:8000
```

## 🧪 Development Notes

- The frontend is served using Flask templates.
- The prediction logic lives in [app.py](app.py).
- The trained model is loaded at startup using `pickle`.

## 👤 Author

This project was developed as part of an internship at **IIT Jammu**, By **Nikhil Sanjay Kumar Srivastava** initiative focused on applying machine learning to workforce analytics.

## 📌 Summary

This project showcases the integration of:

- a machine learning model for classification, (logistic regression)
- a Flask-based web interface,
- and a polished user experience for HR decision support.

