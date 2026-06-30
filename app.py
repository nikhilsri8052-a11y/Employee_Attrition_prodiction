from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd
import os

app = Flask(__name__)

model = pickle.load(open("house_price_model.pkl", "rb"))

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    location = request.form["location"]
    sqft = float(request.form["sqft"])
    bath = int(request.form["bath"])
    bedrooms = int(request.form["bedrooms"])

    data = pd.DataFrame({
        "location": [location],
        "total_sqft": [sqft],
        "bath": [bath],
        "bedrooms": [bedrooms]
    })

    prediction = model.predict(data)[0]
    prediction_text = f"Predicted Price: ₹ {prediction:.2f} Lakhs"

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        return jsonify({
            "predicted_price": float(prediction),
            "prediction_text": prediction_text
        })

    return render_template(
        "index.html",
        prediction_text=prediction_text,
        prediction_value=float(prediction)
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
