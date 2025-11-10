import argparse
import random
import datetime
from faker import Faker
import pandas as pd
import os
from tqdm import tqdm

fake = Faker()

def weighted_choice(choices):
    items, weights = zip(*choices)
    return random.choices(items, weights=weights, k=1)[0]

def main(args):
    os.makedirs(args.output, exist_ok=True)
    csv_encoding = 'utf-8-sig'

    personas = { "Tech Enthusiast": {"prevalence": 0.25, "category_prefs": {"Electronics": 0.90, "Fashion": 0.05, "Groceries": 0.05, "Personal Care": 0.0}}, "Fashionista": {"prevalence": 0.30, "category_prefs": {"Electronics": 0.05, "Fashion": 0.90, "Groceries": 0.0, "Personal Care": 0.05}}, "Family Shopper": {"prevalence": 0.45, "category_prefs": {"Electronics": 0.10, "Fashion": 0.10, "Groceries": 0.50, "Personal Care": 0.30}} }
    persona_names, persona_weights = list(personas.keys()), [p['prevalence'] for p in personas.values()]
    payment_methods = ["UPI", "Cash on Delivery", "Credit Card", "Debit Card", "E-Wallet", "Net Banking"]
    payment_weights = [0.40, 0.25, 0.15, 0.10, 0.05, 0.05]

    print("Generating customers...")
    customers = []
    for i in range(1, args.customers + 1):
        age = weighted_choice([(random.randint(18, 25), 0.25), (random.randint(26, 40), 0.45), (random.randint(41, 60), 0.25), (random.randint(61, 75), 0.05)])
        metros = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata"]; tier2 = ["Lucknow", "Jaipur", "Kanpur", "Indore", "Nagpur", "Bhopal"]; tier3 = ["Meerut", "Varanasi", "Jodhpur", "Raipur", "Gorakhpur", "Mysuru"]
        city = weighted_choice([(random.choice(metros), 0.5), (random.choice(tier2), 0.3), (random.choice(tier3), 0.2)])
        join_date = fake.date_between(start_date=args.start_date, end_date=args.end_date)
        customer_persona = random.choices(persona_names, weights=persona_weights, k=1)[0]
        customers.append({"customer_id": i, "name": fake.name(), "email": fake.email(), "gender": random.choices(["Female", "Male"], weights=[0.65, 0.35], k=1)[0], "age": age, "location": city, "join_date": join_date, "persona": customer_persona})
    customers_df = pd.DataFrame(customers)
    customers_df.to_csv(f"{args.output}/customers.csv", index=False, encoding=csv_encoding)

    print("Generating products...")
    product_catalog = {
        "Electronics": { "items": [
            {"brand": "Apple", "name": "iPhone 15 Pro (Black Titanium, 256 GB)", "description": "A17 Pro Chip, 6 Core Processor", "price_range": (120000, 150000)},
            {"brand": "Apple", "name": "USB-C Power Adapter", "description": "20W, Fast Charging, Lightweight Design", "price_range": (1500, 4000)},
            {"brand": "Samsung", "name": "Galaxy S25 Ultra", "description": "Snapdragon 8 Elite processor, custom-tuned for Galaxy.", "price_range": (110000, 140000)},
            {"brand": "Samsung", "name": "Galaxy Buds 3 Pro", "description": "Crystal clear 24bit/96kHz studio quality sound.", "price_range": (15000, 20000)},
            {"brand": "Dell", "name": "XPS 15 Laptop", "description": "15.6\" OLED UHD+ screen with high resolution and HDR support.", "price_range": (200000, 250000)},
            {"brand": "Dell", "name": "EcoLoop Urban Backpack", "description": "Made from 100% recycled plastic, 420D fabric.", "price_range": (3000, 5000)},
            {"brand": "HP", "name": "Smart Tank Printer", "description": "Integrated ink tanks and automated ink detection.", "price_range": (15000, 22000)},
            {"brand": "HP", "name": "Ink Cartridge", "description": "Black, High-yield for Smart Tank printers.", "price_range": (800, 1500)}
        ]},
        "Fashion": { "items": [
            {"brand": "Peter England", "name": "Men's Kurta", "description": "Linen Blend, perfect for casual occasions.", "price_range": (1000, 3000)},
            {"brand": "Manyavar", "name": "Pajama Set", "description": "Regal color with pure Chanderi fabric for a rich look.", "price_range": (800, 2500)},
            {"brand": "Levi's", "name": "Men's 505 Straight Fit Jeans", "description": "Straight Fit with a classic Vintage Wash.", "price_range": (2000, 4500)},
            {"brand": "Adidas", "name": "Men's Geometric T-Shirt", "description": "Regular Fit and made from Organic Cotton.", "price_range": (1000, 2500)}
        ]},
        "Groceries": { "items": [
            {"brand": "Daawat", "name": "Basmati Rice, 5 Kg", "description": "The world's longest rice grain, perfect for biryani.", "price_range": (600, 900)},
            {"brand": "Shan", "name": "Biryani Masala, 50 gm", "description": "Authentic Spice Mix with no artificial food colour.", "price_range": (50, 100)},
            {"brand": "Barilla", "name": "Penne Pasta, 454 gm", "description": "Classic penne shape, contains Wheat.", "price_range": (200, 350)},
            {"brand": "Barilla", "name": "Pasta Sauce, 400 gm - Arrabbiata", "description": "Made from high-quality Italian tomatoes and chillies.", "price_range": (250, 400)}
        ]},
        "Personal Care": { "items": [
            {"brand": "Colgate", "name": "Antibacterial Toothpaste", "description": "Provides 12-Hour Protection for your teeth and gums.", "price_range": (100, 200)},
            {"brand": "Oral-B", "name": "Cross Action Electric Toothbrush", "description": "IPX7 water resistant, can be safely used in the shower.", "price_range": (1500, 2500)},
            {"brand": "Head & Shoulders", "name": "Anti Dandruff Shampoo, 750ml", "description": "Effectively removes dandruff and prevents it from coming back.", "price_range": (400, 700)},
            {"brand": "Pantene", "name": "Silky Smooth Conditioner, 500ml", "description": "Treats severely damaged hair that needs deep conditioning.", "price_range": (300, 600)},
            {"brand": "Pampers", "name": "Baby Diapers, Pack of 2", "description": "Wetness indicator which turns from Yellow to Blue.", "price_range": (500, 800)},
            {"brand": "Himalaya", "name": "Gentle Baby Wipes, Pack of 2", "description": "With Indian Lotus to keep baby's skin soft and supple.", "price_range": (200, 400)}
        ]}
    }

    products = []
    sku_id = 1

    guaranteed_products_list = [
        ("Electronics", {"brand": "Apple", "name": "iPhone 15 Pro (Black Titanium, 256 GB)", "description": "A17 Pro Chip, 6 Core Processor"}), ("Electronics", {"brand": "Apple", "name": "USB-C Power Adapter", "description": "20W, Fast Charging, Lightweight Design"}),
        ("Electronics", {"brand": "Samsung", "name": "Galaxy S25 Ultra", "description": "Snapdragon 8 Elite processor, custom-tuned for Galaxy."}), ("Electronics", {"brand": "Samsung", "name": "Galaxy Buds 3 Pro", "description": "Crystal clear 24bit/96kHz studio quality sound."}),
        ("Electronics", {"brand": "Dell", "name": "XPS 15 Laptop", "description": "15.6\" OLED UHD+ screen with high resolution and HDR support."}), ("Electronics", {"brand": "Dell", "name": "EcoLoop Urban Backpack", "description": "Made from 100% recycled plastic, 420D fabric."}),
        ("Electronics", {"brand": "HP", "name": "Smart Tank Printer", "description": "Integrated ink tanks and automated ink detection."}), ("Electronics", {"brand": "HP", "name": "Ink Cartridge", "description": "Black, High-yield for Smart Tank printers."}),
        ("Fashion", {"brand": "Peter England", "name": "Men's Kurta", "description": "Linen Blend, perfect for casual occasions."}), ("Fashion", {"brand": "Manyavar", "name": "Pajama Set", "description": "Regal color with pure Chanderi fabric for a rich look."}),
        ("Groceries", {"brand": "Barilla", "name": "Penne Pasta, 454 gm", "description": "Classic penne shape, contains Wheat."}), ("Groceries", {"brand": "Barilla", "name": "Pasta Sauce, 400 gm - Arrabbiata", "description": "Made from high-quality Italian tomatoes and chillies."}),
        ("Personal Care", {"brand": "Colgate", "name": "Antibacterial Toothpaste", "description": "Provides 12-Hour Protection for your teeth and gums."}), ("Personal Care", {"brand": "Oral-B", "name": "Cross Action Electric Toothbrush", "description": "IPX7 water resistant, can be safely used in the shower."}),
        ("Personal Care", {"brand": "Head & Shoulders", "name": "Anti Dandruff Shampoo, 750ml", "description": "Effectively removes dandruff and prevents it from coming back."}), ("Personal Care", {"brand": "Pantene", "name": "Silky Smooth Conditioner, 500ml", "description": "Treats severely damaged hair that needs deep conditioning."}),
        ("Personal Care", {"brand": "Pampers", "name": "Baby Diapers, Pack of 2", "description": "Wetness indicator which turns from Yellow to Blue."}), ("Personal Care", {"brand": "Himalaya", "name": "Gentle Baby Wipes, Pack of 2", "description": "With Indian Lotus to keep baby's skin soft and supple."})
    ]

    for category, item_info in guaranteed_products_list:
        if len(products) < args.products:
            full_item_details = next(item for item in product_catalog[category]['items'] if item['name'] == item_info['name'])
            
            products.append({
                "sku_id": sku_id, "product_id": f"P{sku_id:05d}", "product_code": f"{category[:2].upper()}-{sku_id:05d}",
                "price": round(random.uniform(*full_item_details["price_range"]), 2),
                "product_name": f"{item_info['brand']} {item_info['name']}",
                "description": item_info['description'], "category": category, "brand": item_info['brand'],
                "rating": round(random.uniform(3.8, 5.0), 1)
            })
            sku_id += 1

    while len(products) < args.products:
        category, details = random.choice(list(product_catalog.items()))
        item_details = random.choice(details["items"])
        products.append({
            "sku_id": sku_id, "product_id": f"P{sku_id:05d}", "product_code": f"{category[:2].upper()}-{sku_id:05d}",
            "price": round(random.uniform(*item_details["price_range"]), 2),
            "product_name": f"{item_details['brand']} {item_details['name']}",
            "description": item_details['description'], "category": category, "brand": item_details['brand'],
            "rating": round(random.uniform(3.5, 4.8), 1)
        })
        sku_id += 1
    products_df = pd.DataFrame(products)
    products_df.to_csv(f"{args.output}/products.csv", index=False, encoding=csv_encoding)

    # --- THIS IS THE UPDATED STORE GENERATION BLOCK ---
    print("Generating stores...")
    # Define a list of all real cities from your customer generation logic
    all_real_cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", 
                     "Lucknow", "Jaipur", "Kanpur", "Indore", "Nagpur", "Bhopal", 
                     "Meerut", "Varanasi", "Jodhpur", "Raipur", "Gorakhpur", "Mysuru"]
    stores = []
    for i in range(1, args.stores + 1):
        # Pick a random city from your list of real cities
        stores.append({"store_id": i, "location": random.choice(all_real_cities)})
    pd.DataFrame(stores).to_csv(f"{args.output}/stores.csv", index=False, encoding=csv_encoding)
    # --- END OF UPDATED BLOCK ---

    print("Generating orders and line items...")
    try:
        def get_id(name): return products_df[products_df['product_name'].str.contains(name, regex=False)]['product_id'].iloc[0]
        product_bundles = {
            get_id("iPhone 15 Pro"): (get_id("USB-C Power Adapter"), 0.70), get_id("Galaxy S25 Ultra"): (get_id("Galaxy Buds 3 Pro"), 0.40),
            get_id("XPS 15 Laptop"): (get_id("EcoLoop Urban Backpack"), 0.85), get_id("Smart Tank Printer"): (get_id("Ink Cartridge"), 0.90),
            get_id("Men's Kurta"): (get_id("Pajama Set"), 0.70), get_id("Penne Pasta"): (get_id("Pasta Sauce"), 0.95),
            get_id("Toothpaste"): (get_id("Toothbrush"), 0.30), get_id("Shampoo"): (get_id("Conditioner"), 0.60),
            get_id("Diapers"): (get_id("Baby Wipes"), 0.90),
        }
    except (IndexError, KeyError):
        product_bundles = {}

    orders, lineitems = [], []
    order_id, lineitem_id = 1, 1
    current_date = args.start_date
    products_by_category = {cat: products_df[products_df['category'] == cat] for cat in product_catalog.keys()}

    for _ in tqdm(range((args.end_date - args.start_date).days + 1), desc="Generating Daily Orders"):
        for _ in range(args.orders_per_day):
            cust = customers_df.sample(1).to_dict('records')[0]
            if current_date < cust["join_date"]: continue
            store = random.choice(stores)
            customer_persona_prefs = personas[cust['persona']]['category_prefs']
            pref_categories, pref_weights = list(customer_persona_prefs.keys()), list(customer_persona_prefs.values())
            current_basket = set()
            num_items_in_order = random.randint(1, args.items_per_order)
            for _ in range(num_items_in_order):
                chosen_category = random.choices(pref_categories, weights=pref_weights, k=1)[0]
                if not products_by_category[chosen_category].empty:
                    prod_to_add = products_by_category[chosen_category].sample(1).to_dict('records')[0]
                    current_basket.add(prod_to_add['product_id'])
                    if prod_to_add['product_id'] in product_bundles:
                        paired_product, probability = product_bundles[prod_to_add['product_id']]
                        if random.random() < probability:
                            current_basket.add(paired_product)
            if current_basket:
                orders.append({"order_id": order_id, "customer_id": cust["customer_id"], "store_id": store["store_id"], "order_date": current_date, "order_time": fake.time(), "payment_method": random.choices(payment_methods, weights=payment_weights, k=1)[0]})
                for prod_id in current_basket:
                    prod = products_df.loc[products_df['product_id'] == prod_id].to_dict('records')[0]
                    qty = random.randint(50, 100) if random.random() < 0.001 else (random.randint(1, 2) if prod["category"] == "Electronics" else random.randint(1, 5))
                    total_amount = round(prod["price"] * qty, 2)
                    lineitems.append({"lineitem_id": lineitem_id, "order_id": order_id, "product_id": prod_id, "sku_id": prod["sku_id"], "quantity": qty, "unit_price": prod["price"], "total_amount": total_amount})
                    lineitem_id += 1
                order_id += 1
        current_date += datetime.timedelta(days=1)

    print("Saving final CSV files...")
    pd.DataFrame(orders).to_csv(f"{args.output}/orders.csv", index=False, encoding=csv_encoding)
    pd.DataFrame(lineitems).to_csv(f"{args.output}/lineitems.csv", index=False, encoding=csv_encoding)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--customers", type=int, default=10000)
    parser.add_argument("--products", type=int, default=1000)
    parser.add_argument("--stores", type=int, default=100)
    parser.add_argument("--orders-per-day", type=int, default=100)
    parser.add_argument("--items-per-order", type=int, default=4)
    parser.add_argument("--from", dest="start_date", type=lambda s: datetime.datetime.strptime(s, "%Y-%m-%d").date(), default=datetime.date(2020, 4, 1))
    parser.add_argument("--to", dest="end_date", type=lambda s: datetime.datetime.strptime(s, "%Y-%m-%d").date(), default=datetime.date(2025, 3, 31))
    parser.add_argument("--output", type=str, default=".")
    args = parser.parse_args()
    main(args)
    print(f"\n✅ Data generation complete. Files saved in '{args.output}' folder.")
