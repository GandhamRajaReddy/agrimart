from django.core.management.base import BaseCommand
from apps.categories.models import Category
from apps.products.models import Product


class Command(BaseCommand):
    help = "Seed Mandi categories and high-demand agricultural products into the database."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Seeding catalog categories & products..."))

        categories_data = [
            {
                "name": "Seeds & Planting Material",
                "slug": "seeds",
                "icon": "Sprout",
                "description": "Certified high-yield hybrid seeds for wheat, mustard, soybean, pulses & vegetables.",
                "item_count": 24,
            },
            {
                "name": "Crop Nutrition & Fertilizers",
                "slug": "fertilizers",
                "icon": "FlaskConical",
                "description": "Organic bio-fertilizers, NPK complexes, micronutrient sprays & soil enhancers.",
                "item_count": 32,
            },
            {
                "name": "Crop Protection & Pesticides",
                "slug": "pesticides",
                "icon": "ShieldCheck",
                "description": "Targeted bio-fungicides, herbicides, insecticides & pest protection solutions.",
                "item_count": 18,
            },
            {
                "name": "Farming Tools & Equipment",
                "slug": "tools",
                "icon": "Wrench",
                "description": "Ergonomic hand tools, sprayers, pruning shears, soil testing meters & safety gear.",
                "item_count": 15,
            },
            {
                "name": "Irrigation & Water Management",
                "slug": "irrigation",
                "icon": "Droplets",
                "description": "Drip irrigation kits, solar water pump accessories & smart sprinklers.",
                "item_count": 12,
            },
            {
                "name": "Farm Machinery & Rentals",
                "slug": "machinery",
                "icon": "Tractor",
                "description": "Heavy-duty rotavators, seed drills, multi-crop harvesters & rental attachments.",
                "item_count": 9,
            },
        ]

        cat_map = {}
        for cat_data in categories_data:
            cat, created = Category.objects.update_or_create(
                slug=cat_data["slug"],
                defaults=cat_data
            )
            cat_map[cat.slug] = cat

        products_data = [
            {
                "name": "Pioneer Hybrid Mustard Seeds 45S46",
                "category": cat_map["seeds"],
                "description": "High oil content hybrid mustard seed with exceptional frost tolerance and pest resistance.",
                "price": 480.00,
                "original_price": 550.00,
                "unit": "1 kg Pack",
                "rating": 4.9,
                "reviews_count": 142,
                "image_url": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80",
                "badge": "Bestseller",
                "in_stock": True,
                "is_featured": True,
            },
            {
                "name": "IFFCO Bio NPK Liquid Fertilizer Consortium",
                "category": cat_map["fertilizers"],
                "description": "Bio-fertilizer liquid consortium containing Nitrogen-fixing, Phosphate & Potash solubilizing bacteria.",
                "price": 320.00,
                "original_price": 400.00,
                "unit": "1 Litre Bottle",
                "rating": 4.8,
                "reviews_count": 98,
                "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
                "badge": "Eco-Organic",
                "in_stock": True,
                "is_featured": True,
            },
            {
                "name": "Syngenta Ampligo Insecticide (Chlorantraniliprole)",
                "category": cat_map["pesticides"],
                "description": "Broad-spectrum insecticide providing long-duration control against bollworms and stem borers.",
                "price": 890.00,
                "original_price": 1050.00,
                "unit": "250 ml",
                "rating": 4.7,
                "reviews_count": 76,
                "image_url": "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80",
                "badge": "Popular Crop Care",
                "in_stock": True,
                "is_featured": True,
            },
            {
                "name": "Kisan Kraft 16L Battery Operated Knapsack Sprayer",
                "category": cat_map["tools"],
                "description": "Dual-mode 12V battery & manual hand pump sprayer for pesticides, liquid fertilizers & herbicides.",
                "price": 2850.00,
                "original_price": 3400.00,
                "unit": "1 Set",
                "rating": 4.9,
                "reviews_count": 210,
                "image_url": "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=600&auto=format&fit=crop&q=80",
                "badge": "Top Rated Tool",
                "in_stock": True,
                "is_featured": True,
            },
            {
                "name": "Shriram Super Wheat Seeds HD 2967",
                "category": cat_map["seeds"],
                "description": "High grain yield disease-resistant wheat seed variety suitable for irrigated land across Central & Northern Mandis.",
                "price": 1250.00,
                "original_price": 1400.00,
                "unit": "40 kg Bag",
                "rating": 4.8,
                "reviews_count": 185,
                "image_url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
                "badge": "High Yield",
                "in_stock": True,
                "is_featured": False,
            },
            {
                "name": "Jain Drip Irrigation Starter Kit for 1 Acre",
                "category": cat_map["irrigation"],
                "description": "Complete drip irrigation lateral kit with drippers, filters, connectors & pressure regulation.",
                "price": 6490.00,
                "original_price": 7800.00,
                "unit": "1 Acre Kit",
                "rating": 4.9,
                "reviews_count": 64,
                "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
                "badge": "Water Saver",
                "in_stock": True,
                "is_featured": False,
            },
        ]

        for p_data in products_data:
            Product.objects.update_or_create(
                name=p_data["name"],
                defaults=p_data
            )

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(categories_data)} categories and {len(products_data)} products!"))
