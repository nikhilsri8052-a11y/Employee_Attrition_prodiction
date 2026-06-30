from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd
import os

app = Flask(__name__)

model = pickle.load(open("Employee_Attrition_Model.pkl", "rb"))

NUMERIC_FIELDS = {
    "Age", "DailyRate", "DistanceFromHome", "Education", "EmployeeCount",
    "EmployeeNumber", "EnvironmentSatisfaction", "HourlyRate", "JobInvolvement",
    "JobSatisfaction", "MonthlyIncome", "MonthlyRate", "NumCompaniesWorked",
    "PercentSalaryHike", "RelationshipSatisfaction", "StandardHours",
    "StockOptionLevel", "TrainingTimesLastYear", "WorkLifeBalance",
    "YearsAtCompany", "YearsSinceLastPromotion",
}

CATEGORICAL_FIELDS = {
    "BusinessTravel", "Department", "EducationField", "Gender",
    "JobRole", "MaritalStatus", "Over18", "OverTime",
}

ALL_FIELDS = [
    "Age", "BusinessTravel", "DailyRate", "Department", "DistanceFromHome",
    "Education", "EducationField", "EmployeeCount", "EmployeeNumber",
    "EnvironmentSatisfaction", "Gender", "HourlyRate", "JobInvolvement",
    "JobRole", "JobSatisfaction", "MaritalStatus", "MonthlyIncome",
    "MonthlyRate", "NumCompaniesWorked", "Over18", "OverTime",
    "PercentSalaryHike", "RelationshipSatisfaction", "StandardHours",
    "StockOptionLevel", "TrainingTimesLastYear", "WorkLifeBalance",
    "YearsAtCompany", "YearsSinceLastPromotion",
]


def build_input_dataframe(form):
    """Build a single-row DataFrame from the submitted form, raising a
    ValueError with a friendly message if anything is missing/invalid."""
    row = {}

    for field in NUMERIC_FIELDS:
        raw = form.get(field, "").strip()
        if raw == "":
            raise ValueError(f"Missing value for '{field}'.")
        try:
            row[field] = int(float(raw))
        except ValueError:
            raise ValueError(f"'{field}' must be a number, got '{raw}'.")

    for field in CATEGORICAL_FIELDS:
        raw = form.get(field, "").strip()
        if raw == "":
            raise ValueError(f"Missing value for '{field}'.")
        row[field] = raw

    return pd.DataFrame([row], columns=ALL_FIELDS)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    is_ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"

    try:
        data = build_input_dataframe(request.form)

        pred_class = int(model.predict(data)[0])
        proba = model.predict_proba(data)[0]
        attrition_probability = float(proba[1]) * 100 

        margin_of_error = 12  # +/- percentage points around the predicted probability
        lower_bound = max(0.0, attrition_probability - margin_of_error)
        upper_bound = min(100.0, attrition_probability + margin_of_error)

        label = "Likely to Leave" if pred_class == 1 else "Likely to Stay"
        prediction_text = f"{label} — Attrition Risk: {attrition_probability:.1f}% (\u00b1{margin_of_error}%)"

        result = {
            "success": True,
            "prediction": pred_class,
            "prediction_label": label,
            "attrition_probability": round(attrition_probability, 2),
            "margin_of_error": margin_of_error,
            "lower_bound": round(lower_bound, 2),
            "upper_bound": round(upper_bound, 2),
            "prediction_text": prediction_text,
        }

        if is_ajax:
            return jsonify(result)

        return render_template("index.html", result=result)

    except Exception as e:
        error_message = str(e)
        result = {"success": False, "error": error_message}

        if is_ajax:
            return jsonify(result), 400

        return render_template("index.html", result=result)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)