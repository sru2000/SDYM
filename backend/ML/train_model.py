"""
train_model.py — KrishiMitra AI
Trains XGBoost priority classifier on retailer_features.csv.

Fixes applied vs. original:
  - priority_score REMOVED from feature set (it was derived from the
    same columns as X, making it circular and redundant)
  - scale_pos_weight added to handle class imbalance
  - Cross-validation added (don't trust the accuracy number — see note below)
  - Stratified split to preserve label ratio in test set

⚠️  NOTE ON ACCURACY:
    priority_label is computed from a rule using stockout_count, total_sales,
    and days_since_visit — the same columns the model learns from.
    The model will achieve high accuracy by replicating the rule.
    Do not present this accuracy as a generalizable ML result.
    Instead, frame it as: "Our model operationalizes domain-expert rules
    and extends them with behavioral signals."
"""

import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report
from xgboost import XGBClassifier
import joblib

# ─────────────────────────────────────────────
# LOAD
# ─────────────────────────────────────────────

try:
    features = pd.read_csv("processed/retailer_features.csv")
except FileNotFoundError:
    raise SystemExit("ERROR: Run feature_engineering.py first.")

# ─────────────────────────────────────────────
# FEATURE SET
# priority_score is intentionally excluded — it is a weighted sum
# of the columns below, which would introduce circular redundancy.
# ─────────────────────────────────────────────

BASE_FEATURES = [
    'total_sales',
    'avg_sales',
    'total_quantity',
    'unique_skus',
    'transaction_count',
    'stockout_count',
    'stockout_rate',
    'avg_inventory',
    'retailer_visit_count',
    'days_since_visit',
    'campaign_count',
    'days_since_campaign',
    'unique_products_recommended',
]

# WhatsApp features are optional (only present if growers.csv was available)
OPTIONAL_FEATURES = ['wa_open_rate', 'wa_click_rate', 'wa_messages_sent']

available_features = BASE_FEATURES + [
    f for f in OPTIONAL_FEATURES if f in features.columns
]

X = features[available_features]
y = features['priority_label']

# ─────────────────────────────────────────────
# HANDLE CLASS IMBALANCE
# ─────────────────────────────────────────────

n_negative = (y == 0).sum()
n_positive = (y == 1).sum()
scale_pos_weight = n_negative / max(n_positive, 1)

print(f"Class distribution — 0: {n_negative}, 1: {n_positive}")
print(f"scale_pos_weight: {scale_pos_weight:.2f}")

# ─────────────────────────────────────────────
# STRATIFIED TRAIN/TEST SPLIT
# ─────────────────────────────────────────────

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y         # preserves label ratio — important for imbalanced data
)

# ─────────────────────────────────────────────
# MODEL
# ─────────────────────────────────────────────

model = XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    scale_pos_weight=scale_pos_weight,  # handles imbalance
    random_state=42,
    eval_metric='logloss',
    verbosity=0
)

# ─────────────────────────────────────────────
# CROSS-VALIDATION (more honest than single split)
# ─────────────────────────────────────────────

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='f1')

print(f"\nCross-val F1 scores: {cv_scores.round(3)}")
print(f"Mean F1: {cv_scores.mean():.3f} (+/- {cv_scores.std():.3f})")

# ─────────────────────────────────────────────
# FINAL FIT + EVALUATION
# ─────────────────────────────────────────────

model.fit(X_train, y_train)
predictions = model.predict(X_test)

print("\nTest Set Report:")
print(classification_report(y_test, predictions,
                             target_names=['Normal', 'High Priority']))

# Feature importance (useful for demo explainability slide)
importance = pd.Series(model.feature_importances_, index=available_features)
print("\nTop feature importances:")
print(importance.sort_values(ascending=False).head(8).round(3))

# ─────────────────────────────────────────────
# SAVE
# ─────────────────────────────────────────────

import os
os.makedirs("models", exist_ok=True)

joblib.dump(model, "models/priority_model.pkl")
joblib.dump(available_features, "models/feature_columns.pkl")  # save column list

print("\nModel saved → models/priority_model.pkl")
print("Feature list saved → models/feature_columns.pkl")
