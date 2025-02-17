import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/bakliyat", name: "Makarna & Bakliyat", imageUrl: "/jeans.jpg" },
	{ href: "/icecekler", name: "İçecekler", imageUrl: "/tshirts.jpg" },
	{ href: "/meyve-sebze", name: "Meyve & Sebze", imageUrl: "/shoes.jpg" },
	{ href: "/sut", name: "Süt & Süt Ürünleri", imageUrl: "/glasses.png" },
	{ href: "/atistirmalik", name: "Atıştırmalıklar", imageUrl: "/jackets.jpg" },
	{ href: "/temizlik", name: "Temizlik & Hijyen", imageUrl: "/suits.jpg" },
	{ href: "/et", name: "Şarküteri & Et Ürünleri", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Alışverişin En Kolay Yolu, Benim Marketim!
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					En yeni ürünleri keşfedin
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		</div>
	);
};
export default HomePage;
