"""
feature_engineering.py — KrishiMitra AI
Builds retailer_features.csv from raw datasets.

Fixes applied vs. original:
  - days_since_visit fillna → 999 (not 0, which implied "visited today")
  - visit features split by visit_type (retailer meeting vs. campaign)
  - WhatsApp tehsil-level engagement features added (with fallback)
  - priority_score NOT included in ML feature set (only kept for display)
  - try/except on every file load with clear error messages
"""

import pandas as pd
import numpy as np
from datetime import datetime

# ─────────────────────────────────────────────
# LOAD DATASETS
# ─────────────────────────────────────────────

try:
    retailers = pd.read_csv("datasets/retailers.csv")
except FileNotFoundError:
    raise SystemExit("ERROR: datasets/retailers.csv not found. Check your path.")

try:
    pos = pd.read_csv("datasets/retailer_pos.csv")
except FileNotFoundError:
    raise SystemExit("ERROR: datasets/retailer_pos.csv not found.")

try:
    inventory = pd.read_csv("datasets/retailer_inventory_weekly.csv")
except FileNotFoundError:
    raise SystemExit("ERROR: datasets/retailer_inventory_weekly.csv not found.")

try:
    visits = pd.read_csv("datasets/retailer_visit_log.csv")
    visits['visit_date'] = pd.to_datetime(visits['visit_date'])
except FileNotFoundError:
    raise SystemExit("ERROR: datasets/retailer_visit_log.csv not found.")

# ─────────────────────────────────────────────
# POS FEATURES (retailer_id level)
# ─────────────────────────────────────────────

pos['sales_value'] = pos['sku_qty'] * pos['sku_price']

sales_features = pos.groupby('retailer_id').agg(
    total_sales=('sales_value', 'sum'),
    avg_sales=('sales_value', 'mean'),
    total_quantity=('sku_qty', 'sum'),
    unique_skus=('sku_id', 'nunique'),           # SKU breadth — new feature
    transaction_count=('transaction_id', 'nunique')  # purchase frequency — new
).reset_index()

# ─────────────────────────────────────────────
# INVENTORY FEATURES (retailer_id level)
# ─────────────────────────────────────────────

inventory['stockout'] = (inventory['sku_qty'] == 0).astype(int)

inventory_features = inventory.groupby('retailer_id').agg(
    stockout_count=('stockout', 'sum'),
    avg_inventory=('sku_qty', 'mean'),
    stockout_rate=('stockout', 'mean'),          # fraction of weeks OOS — new
).reset_index()

# ─────────────────────────────────────────────
# VISIT FEATURES (territory_id level)
#
# NOTE: retailer_visit_log has NO retailer_id column.
# Visits are logged at territory level. All retailers in a
# territory share these visit stats. This is a data limitation,
# not a code bug — the territory_id merge below is intentional.
# ─────────────────────────────────────────────

latest_date = visits['visit_date'].max()

# Retailer-facing visits only (filter visit_type)
retailer_visits = visits[visits['visit_type'] == 'retailer meeting']

visit_features = retailer_visits.groupby('territory_id').agg(
    retailer_visit_count=('visit_date', 'count'),
    last_retailer_visit=('visit_date', 'max'),
    unique_products_recommended=('product_recommended', 'nunique'),  # new
).reset_index()

visit_features['days_since_visit'] = (
    latest_date - visit_features['last_retailer_visit']
).dt.days

# Campaign activity at territory level (separate feature)
campaign_visits = visits[visits['visit_type'] == 'campaign_conducted']

campaign_features = campaign_visits.groupby('territory_id').agg(
    campaign_count=('visit_date', 'count'),
    last_campaign=('visit_date', 'max'),
).reset_index()

campaign_features['days_since_campaign'] = (
    latest_date - campaign_features['last_campaign']
).dt.days

# ─────────────────────────────────────────────
# WHATSAPP ENGAGEMENT FEATURES (tehsil level)
# Requires growers.csv to map grower_id → tehsil.
# Gracefully skipped if growers.csv is missing.
# ─────────────────────────────────────────────

whatsapp_features = None

try:
    growers = pd.read_csv("datasets/growers.csv")
    whatsapp = pd.read_csv("datasets/whatsapp_campaign.csv")

    # Join grower tehsil onto WhatsApp log
    wa_with_location = whatsapp.merge(
        growers[['grower_id', 'tehsil']],
        on='grower_id',
        how='left'
    )

    # Aggregate engagement by tehsil
    whatsapp_features = wa_with_location.groupby('tehsil').agg(
        wa_messages_sent=('id', 'count'),
        wa_open_rate=('opened_status', 'mean'),
        wa_click_rate=('clicked_status', 'mean'),
    ).reset_index()

    print("WhatsApp engagement features loaded successfully.")

except FileNotFoundError:
    print("WARNING: growers.csv or whatsapp_campaign.csv not found. "
          "Skipping WhatsApp engagement features.")

# ─────────────────────────────────────────────
# SYNTHETIC COORDINATES
# (No lat/lng in source data; using state-bounded randoms for demo)
# Replace with real geocoding before production use.
# ─────────────────────────────────────────────

STATE_BOUNDS = {
    # (lat_min, lat_max, lng_min, lng_max)
    'default': (18.0, 28.0, 73.0, 85.0),
    'Maharashtra': (15.6, 22.0, 72.6, 80.9),
    'Rajasthan': (23.0, 30.2, 69.5, 78.3),
    'Uttar Pradesh': (23.8, 30.4, 77.1, 84.6),
    'Punjab': (29.5, 32.5, 73.9, 76.9),
    'Haryana': (27.7, 30.9, 74.5, 77.6),
    'Madhya Pradesh': (21.1, 26.9, 74.0, 82.8),
}

def get_coords(state):
    bounds = STATE_BOUNDS.get(state, STATE_BOUNDS['default'])
    lat = np.random.uniform(bounds[0], bounds[1])
    lng = np.random.uniform(bounds[2], bounds[3])
    return lat, lng

retailers[['lat', 'lng']] = retailers['state'].apply(
    lambda s: pd.Series(get_coords(s))
)

# ─────────────────────────────────────────────
# MERGE EVERYTHING
# ─────────────────────────────────────────────

features = retailers.merge(sales_features, on='retailer_id', how='left')
features = features.merge(inventory_features, on='retailer_id', how='left')
features = features.merge(visit_features, on='territory_id', how='left')
features = features.merge(campaign_features, on='territory_id', how='left')

if whatsapp_features is not None:
    features = features.merge(whatsapp_features, on='tehsil', how='left')
    # Fill missing WhatsApp stats with 0 (no engagement = 0 signal)
    for col in ['wa_messages_sent', 'wa_open_rate', 'wa_click_rate']:
        features[col] = features[col].fillna(0)

# ─────────────────────────────────────────────
# FILL NULLS — INTENTIONAL DEFAULTS
# ─────────────────────────────────────────────

# Sales/inventory: 0 means no data = no activity
for col in ['total_sales', 'avg_sales', 'total_quantity',
            'unique_skus', 'transaction_count',
            'stockout_count', 'avg_inventory', 'stockout_rate',
            'retailer_visit_count', 'unique_products_recommended',
            'campaign_count']:
    features[col] = features[col].fillna(0)

# Days since visit: 999 means "never visited" — NOT 0
# 0 would mean "visited today", which is semantically wrong for nulls.
for col in ['days_since_visit', 'days_since_campaign']:
    features[col] = features[col].fillna(999)

# ─────────────────────────────────────────────
# LABELS
# ─────────────────────────────────────────────

features['priority_label'] = np.where(
    (
        (features['stockout_count'] > 2)
        & (features['total_sales'] > features['total_sales'].median())
        & (features['days_since_visit'] > 10)
    ),
    1,
    0
)

# ─────────────────────────────────────────────
# DISPLAY-ONLY PRIORITY SCORE
# (used in frontend cards, NOT fed into XGBoost)
# ─────────────────────────────────────────────

features['priority_score'] = (
    0.35 * (features['total_sales'] / (features['total_sales'].max() + 1))
    + 0.30 * (features['stockout_count'] / (features['stockout_count'].max() + 1))
    + 0.20 * (features['days_since_visit'].clip(upper=100) / 100)
    + 0.15 * (features['retailer_visit_count'] / (features['retailer_visit_count'].max() + 1))
)

# ─────────────────────────────────────────────
# SAVE
# ─────────────────────────────────────────────

import os
os.makedirs("processed", exist_ok=True)

features.to_csv("processed/retailer_features.csv", index=False)

label_counts = features['priority_label'].value_counts()
print(f"\nFeature engineering complete. Shape: {features.shape}")
print(f"Priority labels — 1 (urgent): {label_counts.get(1, 0)}, "
      f"0 (normal): {label_counts.get(0, 0)}")
print(features[['retailer_id', 'total_sales', 'stockout_count',
                 'days_since_visit', 'priority_label', 'priority_score']].head())
