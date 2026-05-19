"""
predict.py — KrishiMitra AI
Runs inference and exports top_retailers.json with all fields
needed by both the map and the recommendation cards.

Fixes applied vs. original:
  - Loads feature column list from disk (no hardcoded column names)
  - Includes lat/lng in output (needed for frontend map)
  - Exports explainability reasons per retailer
  - Unified output — no separate optimize_route.py needed for basic demo
"""

import pandas as pd
import numpy as np
import joblib

# ─────────────────────────────────────────────
# LOAD MODEL + FEATURE COLUMNS
# ─────────────────────────────────────────────

try:
    model = joblib.load("models/priority_model.pkl")
    feature_columns = joblib.load("models/feature_columns.pkl")
except FileNotFoundError:
    raise SystemExit("ERROR: Run train_model.py first to generate model files.")

try:
    features = pd.read_csv("processed/retailer_features.csv")
except FileNotFoundError:
    raise SystemExit("ERROR: Run feature_engineering.py first.")

# ─────────────────────────────────────────────
# PREDICT
# ─────────────────────────────────────────────

X = features[feature_columns]

features['prediction_probability'] = model.predict_proba(X)[:, 1]

# ─────────────────────────────────────────────
# RANK + SELECT TOP RETAILERS
# ─────────────────────────────────────────────

ranked = features.sort_values('prediction_probability', ascending=False)
top = ranked.head(10).copy()

top['visit_order'] = range(1, len(top) + 1)

# ─────────────────────────────────────────────
# EXPLAINABILITY REASONS
# (rule-based flags shown in frontend cards)
# ─────────────────────────────────────────────

def get_reasons(row):
    reasons = []
    if row['stockout_count'] > 2:
        reasons.append("High stockout frequency")
    if row['total_sales'] > features['total_sales'].median():
        reasons.append("Strong sales momentum")
    if row['days_since_visit'] > 10:
        reasons.append("Overdue field visit")
    if row.get('wa_click_rate', 0) > 0.05:
        reasons.append("High digital engagement in area")
    if row['stockout_rate'] > 0.3:
        reasons.append("Chronic inventory gaps")
    if not reasons:
        reasons.append("Composite opportunity signal")
    return reasons

top['reasons'] = top.apply(get_reasons, axis=1)

# ─────────────────────────────────────────────
# SELECT OUTPUT COLUMNS
# ─────────────────────────────────────────────

output_cols = [
    'retailer_id',
    'territory_id',
    'state',
    'district',
    'tehsil',
    'lat',
    'lng',
    'prediction_probability',
    'priority_score',
    'visit_order',
    'total_sales',
    'stockout_count',
    'days_since_visit',
    'reasons',
]

# Only keep columns that exist (optional features may be absent)
output_cols = [c for c in output_cols if c in top.columns]
result = top[output_cols]

# ─────────────────────────────────────────────
# EXPORT
# ─────────────────────────────────────────────

import os
os.makedirs("processed", exist_ok=True)

result.to_json("processed/top_retailers.json", orient='records', indent=2)

print(f"Predictions complete. Top {len(result)} retailers exported.")
print(result[['retailer_id', 'prediction_probability',
              'priority_score', 'visit_order']].to_string(index=False))
