"""
optimize_route.py — KrishiMitra AI
Nearest-neighbor greedy TSP for visit route ordering.

Replaces the original "sort by score" approach with an actual
travel-distance-minimizing algorithm. OR-Tools removed from
requirements — this gives a real optimization without the install weight.

Algorithm: Nearest-Neighbor Heuristic
  - Start from the highest-priority retailer
  - Greedily go to the closest unvisited retailer next
  - Repeat until all visited
  - Complexity: O(n²) — fine for n=10-20 stops
"""

import pandas as pd
import numpy as np
import json

# ─────────────────────────────────────────────
# LOAD TOP RETAILERS
# ─────────────────────────────────────────────

try:
    retailers = pd.read_json("processed/top_retailers.json")
except FileNotFoundError:
    raise SystemExit("ERROR: Run predict.py first.")

if retailers.empty:
    raise SystemExit("ERROR: top_retailers.json is empty.")

# ─────────────────────────────────────────────
# HAVERSINE DISTANCE (km between two lat/lng points)
# ─────────────────────────────────────────────

def haversine(lat1, lng1, lat2, lng2):
    R = 6371  # Earth radius in km
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    dphi = np.radians(lat2 - lat1)
    dlambda = np.radians(lng2 - lng1)
    a = np.sin(dphi / 2)**2 + np.cos(phi1) * np.cos(phi2) * np.sin(dlambda / 2)**2
    return 2 * R * np.arcsin(np.sqrt(a))

# ─────────────────────────────────────────────
# NEAREST-NEIGHBOR TSP
# ─────────────────────────────────────────────

def nearest_neighbor_route(df):
    """
    Returns df with visit_order set to minimize travel distance.
    Start node = highest prediction_probability retailer.
    """
    df = df.reset_index(drop=True)
    n = len(df)
    visited = [False] * n
    route = []

    # Start from the highest-priority retailer
    current = df['prediction_probability'].idxmax()
    visited[current] = True
    route.append(current)

    for _ in range(n - 1):
        curr_lat = df.loc[current, 'lat']
        curr_lng = df.loc[current, 'lng']

        best_dist = float('inf')
        best_next = -1

        for j in range(n):
            if not visited[j]:
                d = haversine(curr_lat, curr_lng,
                              df.loc[j, 'lat'], df.loc[j, 'lng'])
                if d < best_dist:
                    best_dist = d
                    best_next = j

        visited[best_next] = True
        route.append(best_next)
        current = best_next

    df['visit_order'] = 0
    for order, idx in enumerate(route, start=1):
        df.loc[idx, 'visit_order'] = order

    return df

# ─────────────────────────────────────────────
# COMPUTE ROUTE
# ─────────────────────────────────────────────

optimized = nearest_neighbor_route(retailers)

# Estimate total route distance
total_km = 0
ordered = optimized.sort_values('visit_order').reset_index(drop=True)
for i in range(len(ordered) - 1):
    d = haversine(
        ordered.loc[i, 'lat'], ordered.loc[i, 'lng'],
        ordered.loc[i+1, 'lat'], ordered.loc[i+1, 'lng']
    )
    total_km += d

print(f"Route optimized. Estimated total distance: {total_km:.1f} km")
print(optimized[['visit_order', 'retailer_id', 'lat', 'lng']].sort_values('visit_order').to_string(index=False))

# ─────────────────────────────────────────────
# EXPORT
# ─────────────────────────────────────────────

import os
os.makedirs("processed", exist_ok=True)

optimized['estimated_total_route_km'] = round(total_km, 1)
optimized.to_json("processed/optimized_route.json", orient='records', indent=2)

print("\nRoute saved → processed/optimized_route.json")
