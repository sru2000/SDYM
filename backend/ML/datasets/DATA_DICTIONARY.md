## \# Syngenta IITM Hackathon 2026: Data Dictionary

## 

## > \*\*CONFIDENTIALITY NOTICE\*\* > This dataset is strictly confidential and intended solely for use in the Syngenta IITM Hackathon 2026. Sharing, publishing, or distributing this dataset in any form is strictly prohibited.

## 

## \---

## 

## \## 📋 Dataset Overview

## 

## | Attribute | Details |

## | --- | --- |

## | \*\*Season\*\* | Rabi |

## | \*\*Period\*\* | October 2025 – April 2026 |

## | \*\*Data Privacy\*\* | Phone numbers and Names are withheld. Users may generate synthetic identifiers if required for modeling. |

## 

## \---

## 

## \## 📂 Core Tables

## 

## \### 1. `reps\_territory.csv`

## 

## \*\*Purpose:\*\* Defines field representatives and their assigned sales territories, including granular tehsil coverage.

## 

## \*\*Volume:\*\* 500 Rows

## 

## | Column | Description |

## | --- | --- |

## | `rep\_id` | Unique ID of the field representative. |

## | `territory\_id` | Unique ID of the territory. |

## | `territory\_name` | Name of the territory. |

## | `state` | State the territory lies in. |

## | `district` | District the territory lies in. |

## | `tehsil\_list` | List of tehsils in this territory (stored as a JSON array). |

## 

## \---

## 

## \### 2. `retailers.csv`

## 

## \*\*Purpose:\*\* Inventory of agricultural retail outlets and their geographic locations.

## 

## \*\*Volume:\*\* 4,000 Rows

## 

## | Column | Description |

## | --- | --- |

## | `retailer\_id` | Unique ID of the retailer. |

## | `territory\_id` | Territory this retailer is assigned to. |

## | `state` | State of the outlet. |

## | `district` | District of the outlet. |

## | `tehsil` | Tehsil of the outlet. |

## 

## \---

## 

## \### 3. `retailer\_visit\_log.csv`

## 

## \*\*Purpose:\*\* Historical log of field visits conducted by representatives, highlighting promoted products.

## 

## \*\*Volume:\*\* 30,000 Rows

## 

## | Column | Description |

## | --- | --- |

## | `rep\_id` | Representative who made the visit. |

## | `visit\_date` | Date of the visit. |

## | `territory\_id` | Territory the visit was recorded under. |

## | `visit\_tehsil` | Tehsil where the visit took place. |

## | `visit\_type` | Type: `retailer meeting`, `grower meeting`, or `campaign\_conducted`. |

## | `product\_recommended` | Product name discussed/promoted during the visit. |

## 

## \---

## 

## \### 4. `retailer\_inventory\_weekly.csv`

## 

## \*\*Purpose:\*\* Weekly snapshots of stock levels per SKU at the retailer level.

## 

## \*\*Volume:\*\* 310,544 Rows

## 

## | Column | Description |

## | --- | --- |

## | `retailer\_id` | Retailer the stock belongs to. |

## | `sku\_id` | Unique ID of the product (SKU). |

## | `sku\_name` | Name of the product. |

## | `sku\_qty` | Quantity on hand at week end. `0` indicates Out of Stock. |

## | `week\_end\_date` | Sunday date closing the weekly snapshot. |

## 

## \---

## 

## \### 5. `retailer\_pos.csv`

## 

## \*\*Purpose:\*\* Granular retail sales transactions (Point of Sale line items).

## 

## \*\*Volume:\*\* 235,042 Rows

## 

## | Column | Description |

## | --- | --- |

## | `retailer\_id` | Retailer where the sale occurred. |

## | `transaction\_id` | Unique ID for this sale line. |

## | `sku\_id` | Product sold. |

## | `sku\_name` | Name of the product sold. |

## | `sku\_qty` | Quantity sold on this line. |

## | `sku\_price` | Price used on this line (standardized currency). |

## | `transaction\_date` | Date of the sale. |

## 

## \---

## 

## \### 6. `growers.csv`

## 

## \*\*Purpose:\*\* Comprehensive grower profiles including demographics, farm size, and engagement metrics.

## 

## \*\*Volume:\*\* 6,000 Rows

## 

## | Column | Description |

## | --- | --- |

## | `grower\_id` | Unique ID of the grower. |

## | `state` | State where the grower is based. |

## | `district` | District where the grower is based. |

## | `tehsil` | Tehsil where the grower is based. |

## | `language` | Primary local language label. |

## | `device\_type` | `smartphone`, `keypad`, or `unknown`. |

## | `grower\_age` | Age of the grower in years. |

## | `gender` | `male` or `female`. |

## | `grower\_crop\_calendar` | JSON describing the main Rabi crop and key biological stages. |

## | `product\_scan` | Boolean indicating if the grower scanned a product. |

## | `product\_name` | Name of the scanned product (if applicable). |

## | `product\_scan\_datetime` | ISO format timestamp of the product scan. |

## | `grower\_farm\_size` | Farm size in acres. |

## | `offline\_campaign\_attended` | Boolean indicating attendance at offline events. |

## | `campaign\_attendance\_date` | Date of attendance (if applicable). |

## 

## \---

## 

## \## 📈 Digital Engagement \& Marketing

## 

## \### 7. `digital\_funnel\_weekly.csv`

## 

## \*\*Purpose:\*\* Weekly performance metrics for the four primary Rabi campaigns.

## 

## \*\*Volume:\*\* 104 Rows | \*\*Weeks:\*\* 26 | \*\*Campaigns:\*\* 4

## 

## | Column | Description |

## | --- | --- |

## | `campaign\_id` | Synthetic ID (Wheat: 001, Mustard: 002, Chickpea: 003, Potato: 004). |

## | `week\_start\_date` | Monday opening the week (ISO date). |

## | `social\_post\_impression` | Weekly impression count. |

## | `landing\_page\_visits` | Resulting visits (always ≤ impressions). |

## | `lead\_form\_submission` | Resulting leads (always ≤ visits). |

## | `campaign\_crop` | Primary crop focus (`wheat`, `mustard`, etc.). |

## | `campaign\_product` | Aligned product name from the catalog. |

## 

## \#### Campaign Mapping Reference

## 

## | `campaign\_id` | `campaign\_crop` | `campaign\_product` |

## | --- | --- | --- |

## | CMP\_RABI25\_001 | wheat | Topik 15 WP |

## | CMP\_RABI25\_002 | mustard | Score 250 EC |

## | CMP\_RABI25\_003 | chickpea | Actara 25 WG |

## | CMP\_RABI25\_004 | potato | Kavach 75 WP |

## 

## \---

## 

## \### 8. `whatsapp\_message\_log.csv`

## 

## \*\*Purpose:\*\* Tracking delivery and engagement for flagship fungicide outreach via WhatsApp.

## 

## \*\*Volume:\*\* 4,479 Rows (Excludes non-smartphone users)

## 

## | Column | Description |

## | --- | --- |

## | `id` | Unique message row ID (`WAM\_RABI25\_#####`). |

## | `campaign\_product` | Flagship fungicide messaged for the grower's crop. |

## | `campaign\_crop` | Crop parsed from `grower\_crop\_calendar`. |

## | `grower\_id` | Foreign key to `growers.csv`. |

## | `message\_sent\_date` | ISO Date (Between 2025-10-06 and 2026-04-05). |

## | `delivered\_status` | Boolean: reached the handset. |

## | `opened\_status` | Boolean: user opened the message. |

## | `clicked\_status` | Boolean: user clicked a tracked link. |

## 

## \---

## 

## \### Support

Please contact Ayush.Verma@syngenta.com



## \---

2026, Syngenta India

